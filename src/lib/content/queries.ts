import { churchContent } from "@/lib/content/church-content";
import {
  formatTime,
  serviceDayLabel,
  serviceDuration,
  type PublicChurchProfile,
  type PublicLeader,
  type PublicMinistry,
  type PublicProgram,
  type PublicService,
} from "@/lib/content/format-service";
import { db } from "@/lib/db";

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
      return {
        fromDatabase: true,
        services: rows.map((row) => ({
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
