import { churchContent } from "@/lib/content/church-content";
import {
  formatTime,
  serviceDayLabel,
  serviceDuration,
  type PublicAnnouncement,
  type PublicChurchProfile,
  type PublicFaq,
  type PublicGallery,
  type PublicGalleryItem,
  type PublicLeader,
  type PublicMinistry,
  type PublicProgram,
  type PublicService,
  type PublicTestimonial,
} from "@/lib/content/format-service";
import { db } from "@/lib/db";

const leaderPhotoFallbacks: Record<string, string> = {
  "leader-john-mukisa": "/images/leaders/br-mukisa-john-jackson.png",
};

function resolveLeaderPhoto(id: string, name: string, photoUrl: string | null | undefined) {
  if (photoUrl) return photoUrl;
  if (leaderPhotoFallbacks[id]) return leaderPhotoFallbacks[id];
  if (name.includes("Mukisa")) return "/images/leaders/br-mukisa-john-jackson.png";
  return null;
}

export async function getPublicServices(): Promise<{
  services: PublicService[];
  fromDatabase: boolean;
}> {
  try {
    const rows = await db.service.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { dayOfWeek: "asc" }],
    });

    if (rows.length > 0) {
      const uniqueByDay = new Map<number, (typeof rows)[number]>();
      for (const row of rows) {
        if (!uniqueByDay.has(row.dayOfWeek)) {
          uniqueByDay.set(row.dayOfWeek, row);
        }
      }

      const deduped = Array.from(uniqueByDay.values()).sort(
        (a, b) => a.sortOrder - b.sortOrder || a.dayOfWeek - b.dayOfWeek
      );

      return {
        fromDatabase: true,
        services: deduped.map((row) => ({
          id: row.id,
          name: row.name,
          dayLabel: serviceDayLabel(row.dayOfWeek, row.name),
          startTime: row.startTime,
          endTime: row.endTime,
          venue: row.venue,
          description: row.description,
          duration: serviceDuration(row.startTime, row.endTime),
        })),
      };
    }
  } catch {
    // fall through
  }

  return {
    fromDatabase: false,
    services: churchContent.services.map((service, index) => ({
      id: `fallback-${index}`,
      name: service.day,
      dayLabel: service.day,
      startTime: service.startTime,
      endTime: service.endTime,
      venue: service.venue,
      description: churchContent.serviceDescription,
      duration: service.duration,
    })),
  };
}

export async function getPublicPrograms(): Promise<{
  programs: PublicProgram[];
  fromDatabase: boolean;
}> {
  try {
    const rows = await db.program.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    });

    if (rows.length > 0) {
      return {
        fromDatabase: true,
        programs: rows.map((row) => ({
          id: row.id,
          title: row.title,
          slug: row.slug,
          description: row.description,
          schedule: row.schedule,
          location: row.location,
          imageUrl: row.imageUrl,
        })),
      };
    }
  } catch {
    // fall through
  }

  return {
    fromDatabase: false,
    programs: churchContent.programs.map((program, index) => ({
      id: `fallback-program-${index}`,
      title: program.title,
      slug: program.title.toLowerCase().replace(/\s+/g, "-"),
      description: program.description,
    })),
  };
}

export async function getPublicMinistries(): Promise<{
  ministries: PublicMinistry[];
  fromDatabase: boolean;
}> {
  try {
    const rows = await db.ministry.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    if (rows.length > 0) {
      return {
        fromDatabase: true,
        ministries: rows.map((row) => ({
          id: row.id,
          name: row.name,
          slug: row.slug,
          description: row.description,
          schedule: row.schedule,
          location: row.location,
          imageUrl: row.imageUrl,
        })),
      };
    }
  } catch {
    // fall through
  }

  return {
    fromDatabase: false,
    ministries: churchContent.programs.map((program, index) => ({
      id: `fallback-ministry-${index}`,
      name: program.title,
      slug: program.title.toLowerCase().replace(/\s+/g, "-"),
      description: program.description,
      schedule: null,
      location: churchContent.contact.venue,
    })),
  };
}

export async function getPublicLeaders(): Promise<{
  leaders: PublicLeader[];
  fromDatabase: boolean;
}> {
  try {
    const rows = await db.leader.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    if (rows.length > 0) {
      return {
        fromDatabase: true,
        leaders: rows.map((row) => ({
          id: row.id,
          name: row.name,
          position: row.position,
          bio: row.bio,
          photoUrl: resolveLeaderPhoto(row.id, row.name, row.photoUrl),
        })),
      };
    }
  } catch {
    // fall through
  }

  return {
    fromDatabase: false,
    leaders: churchContent.leadership.map((leader, index) => ({
      id: `fallback-leader-${index}`,
      name: leader.name,
      position: leader.position,
      bio: leader.bio,
      photoUrl: leader.photoUrl ?? null,
    })),
  };
}

export async function getPublicChurchProfile(): Promise<PublicChurchProfile> {
  try {
    const profile = await db.churchProfile.findUnique({
      where: { id: "default" },
    });

    if (profile) {
      return {
        name: profile.name,
        tagline: profile.tagline,
        mission: profile.mission,
        vision: profile.vision,
        story: profile.story,
        fromDatabase: true,
      };
    }
  } catch {
    // fall through
  }

  return {
    name: churchContent.fullName,
    tagline: churchContent.tagline,
    mission: churchContent.mission,
    vision: churchContent.vision,
    story: `${churchContent.story.intro}\n\n${churchContent.story.description}\n\n${churchContent.story.extended}`,
    fromDatabase: false,
  };
}

export async function getEliteFoundationMinistry(): Promise<PublicMinistry | null> {
  try {
    const ministry = await db.ministry.findUnique({
      where: { slug: "elite-foundation" },
    });

    if (ministry?.isPublished) {
      return {
        id: ministry.id,
        name: ministry.name,
        slug: ministry.slug,
        description: ministry.description,
        schedule: ministry.schedule,
        location: ministry.location,
      };
    }
  } catch {
    // fall through
  }

  const { eliteFoundation } = churchContent;
  return {
    id: "fallback-elite-foundation",
    name: eliteFoundation.name,
    slug: "elite-foundation",
    description: `${eliteFoundation.mission}\n\n${eliteFoundation.vision}`,
    schedule: `Founded ${eliteFoundation.founded}`,
    location: churchContent.contact.venue,
  };
}

export { formatTime };

export async function getPublicGalleries(): Promise<{
  galleries: PublicGallery[];
  fromDatabase: boolean;
}> {
  try {
    const rows = await db.gallery.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
      include: { _count: { select: { items: true } } },
    });

    if (rows.length > 0) {
      return {
        fromDatabase: true,
        galleries: rows.map((row) => ({
          id: row.id,
          title: row.title,
          slug: row.slug,
          description: row.description,
          coverImage: row.coverImage,
          itemCount: row._count.items,
        })),
      };
    }
  } catch {
    // fall through
  }

  return { fromDatabase: false, galleries: [] };
}

export async function getPublicGalleryBySlug(slug: string): Promise<{
  gallery: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    coverImage: string | null;
  } | null;
  items: PublicGalleryItem[];
}> {
  try {
    const gallery = await db.gallery.findFirst({
      where: { slug, isPublished: true },
      include: {
        items: {
          orderBy: { sortOrder: "asc" },
          include: { media: true },
        },
      },
    });

    if (gallery) {
      return {
        gallery: {
          id: gallery.id,
          title: gallery.title,
          slug: gallery.slug,
          description: gallery.description,
          coverImage: gallery.coverImage,
        },
        items: gallery.items.map((item) => ({
          id: item.id,
          url: item.media.url,
          altText: item.media.altText,
          caption: item.caption,
        })),
      };
    }
  } catch {
    // fall through
  }

  return { gallery: null, items: [] };
}

export async function getPublicFaqs(): Promise<{
  faqs: PublicFaq[];
  fromDatabase: boolean;
}> {
  try {
    const rows = await db.fAQ.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: "asc" }, { question: "asc" }],
    });

    if (rows.length > 0) {
      return {
        fromDatabase: true,
        faqs: rows.map((row) => ({
          id: row.id,
          question: row.question,
          answer: row.answer,
          category: row.category,
        })),
      };
    }
  } catch {
    // fall through
  }

  return { fromDatabase: false, faqs: [] };
}

export async function getPublicTestimonials(): Promise<{
  testimonials: PublicTestimonial[];
  fromDatabase: boolean;
}> {
  try {
    const rows = await db.testimonial.findMany({
      where: { isPublished: true, hasConsent: true },
      orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }],
      take: 12,
    });

    if (rows.length > 0) {
      return {
        fromDatabase: true,
        testimonials: rows.map((row) => ({
          id: row.id,
          name: row.name,
          content: row.content,
          photoUrl: row.photoUrl,
        })),
      };
    }
  } catch {
    // fall through
  }

  return { fromDatabase: false, testimonials: [] };
}

export async function getActiveAnnouncements(): Promise<PublicAnnouncement[]> {
  try {
    const now = new Date();
    const rows = await db.announcement.findMany({
      where: {
        isPublished: true,
        startDate: { lte: now },
        OR: [{ expiryDate: null }, { expiryDate: { gte: now } }],
      },
      orderBy: [{ isFeatured: "desc" }, { startDate: "desc" }],
      take: 5,
    });

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      content: row.content,
      type: row.type,
    }));
  } catch {
    return [];
  }
}
