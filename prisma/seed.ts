import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const connectionString =
  process.env.DIRECT_URL ??
  process.env.DATABASE_URL_UNPOOLED ??
  process.env.DATABASE_URL;

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding Alpha Fellowship database...");

  // Church Profile
  await prisma.churchProfile.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      name: "Alpha Fellowship Uganda",
      tagline: "A Place to Worship, Pray, and Grow Spiritually",
      mission: "Setting Ablaze all Nations for Christ",
      vision: "Transforming the lives of young people and directing them to Christ",
      story: `Alpha fellowship is a non denominational fellowship that is working among the young people and love to see the young people grow in their understanding of the spirit. We have a trust that the Lord sent us a message in this hour through a messenger following the scripture of MALACHI 4:5.`,
    },
  });

  // Services (weekly gatherings)
  const services = [
    {
      id: "service-tuesday",
      name: "Tuesday Fellowship",
      dayOfWeek: 2,
      startTime: "17:00",
      endTime: "20:00",
      venue: "Grace Gardens Namungoona",
      description:
        "Mid-week fellowship with live worship, sharing of the word of God, prayer, and fellowship.",
      sortOrder: 0,
    },
    {
      id: "service-sunday",
      name: "Sunday Service",
      dayOfWeek: 0,
      startTime: "09:00",
      endTime: "12:00",
      venue: "Grace Gardens Namungoona",
      description:
        "Sunday gathering with live worship, the word of God, and a time of prayer and fellowship. All are welcome.",
      sortOrder: 1,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.id },
      update: service,
      create: { ...service, isActive: true },
    });
  }

  await prisma.service.deleteMany({
    where: { id: { in: ["service-0", "service-1"] } },
  });

  // Social Links
  const socialLinks = [
    { platform: "youtube", url: "https://youtube.com/@alphabfellowship", sortOrder: 0 },
    { platform: "facebook", url: "https://www.facebook.com/profile.php?id=61567883189973", sortOrder: 1 },
    { platform: "twitter", url: "https://x.com/FellowshipAlpha", sortOrder: 2 },
    { platform: "instagram", url: "https://www.instagram.com/stories/fellowshipalpha/", sortOrder: 3 },
  ];

  for (const link of socialLinks) {
    await prisma.socialLink.upsert({
      where: { id: `social-${link.platform}` },
      update: link,
      create: { id: `social-${link.platform}`, ...link },
    });
  }

  // Payment Methods (from official site — CMS configurable)
  const paymentMethods = [
    {
      id: "mtn",
      type: "mtn",
      displayName: "MTN Mobile Money",
      phoneNumber: "+256-742-924-852",
      merchantCode: "123456",
      instructions: "Send your donation via MTN Mobile Money to the number above.",
    },
    {
      id: "airtel",
      type: "airtel",
      displayName: "Airtel Money",
      phoneNumber: "+256-707-768-708",
      merchantCode: "123456",
      instructions: "Send your donation via Airtel Money to the number above.",
    },
    {
      id: "bank",
      type: "bank",
      displayName: "Equity Bank",
      bankName: "Equity Bank",
      accountName: "Mukisa John",
      accountNumber: "1017102126287",
      instructions: "Use these details to make a manual bank transfer.",
    },
  ];

  for (const method of paymentMethods) {
    await prisma.paymentMethod.upsert({
      where: { id: method.id },
      update: method,
      create: method,
    });
  }

  // Site Settings
  const settings = [
    { key: "contact_phone", value: "0751577730", group: "contact", label: "Phone" },
    { key: "contact_email", value: "alphabfellowship7@gmail.com", group: "contact", label: "Email" },
    { key: "contact_whatsapp", value: "+256707768708", group: "contact", label: "WhatsApp" },
    { key: "contact_address", value: "Grace Gardens Namungoona", group: "contact", label: "Address" },
    { key: "youtube_channel_id", value: "", group: "integrations", label: "YouTube Channel ID" },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  // Leadership (verified from official site)
  await prisma.leader.upsert({
    where: { id: "leader-john-mukisa" },
    update: {
      isPublished: true,
      position: "Pastor / Church Leadership",
      photoUrl: "/images/leaders/br-mukisa-john-jackson.png",
    },
    create: {
      id: "leader-john-mukisa",
      name: "BR Mukisa John Jackson",
      position: "Pastor / Church Leadership",
      bio: "Brother John Mukisa was Guild president at a great university in Kampala and was a person that loved leadership, so was his mind until God called him to ministry. He saw a number of young people at the University and he was touched to help the lives of the young people.",
      photoUrl: "/images/leaders/br-mukisa-john-jackson.png",
      isPublished: true,
      sortOrder: 0,
    },
  });

  const serviceTeam = [
    {
      id: "leader-service-administrator",
      position: "Service Administrator",
      bio: "Coordinates weekly gatherings, schedules, and fellowship operations.",
      sortOrder: 10,
    },
    {
      id: "leader-head-media",
      position: "Head Media",
      bio: "Leads media, live stream, and digital communication for the fellowship.",
      sortOrder: 11,
    },
    {
      id: "leader-administrator",
      position: "Administrator",
      bio: "Supports church administration, records, and day-to-day coordination.",
      sortOrder: 12,
    },
  ];

  for (const member of serviceTeam) {
    await prisma.leader.upsert({
      where: { id: member.id },
      update: {
        position: member.position,
        bio: member.bio,
        isPublished: true,
        sortOrder: member.sortOrder,
      },
      create: {
        id: member.id,
        name: member.position,
        position: member.position,
        bio: member.bio,
        isPublished: true,
        sortOrder: member.sortOrder,
      },
    });
  }

  // Roles
  const roles = [
    { slug: "super-admin", name: "Super Administrator", description: "Full system access", isSystem: true },
    { slug: "admin", name: "Administrator", description: "Church operations and content management", isSystem: true },
    { slug: "pastor", name: "Pastor / Minister", description: "Pastoral care access", isSystem: true },
    { slug: "ministry-leader", name: "Ministry Leader", description: "Ministry management", isSystem: true },
    { slug: "editor", name: "Editor", description: "Content management", isSystem: true },
    { slug: "member", name: "Member", description: "Members portal access", isSystem: true },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { slug: role.slug },
      update: {},
      create: role,
    });
  }

  // Super-admin user (change password after first login)
  const adminEmail =
    process.env.SEED_ADMIN_EMAIL ?? "admin@alphafellowshipug.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, isActive: true },
    create: {
      email: adminEmail,
      name: "Alpha Fellowship Admin",
      passwordHash,
      isActive: true,
    },
  });

  const superAdminRole = await prisma.role.findUnique({
    where: { slug: "super-admin" },
  });

  if (superAdminRole) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: adminUser.id,
          roleId: superAdminRole.id,
        },
      },
      update: {},
      create: {
        userId: adminUser.id,
        roleId: superAdminRole.id,
      },
    });
  }

  console.log(`👤 Admin user seeded: ${adminEmail}`);

  // Ministries (verified from alphafellowshipug.com)
  const ministries = [
    {
      slug: "weekly-fellowship",
      name: "Weekly Fellowship",
      description:
        "Join us for a journey of faith, prayer, counselling and guidance.",
      location: "Grace Gardens Namungoona",
      isPublished: true,
      sortOrder: 0,
    },
    {
      slug: "counselling",
      name: "Counselling",
      description: "Pastoral counselling and spiritual guidance for those in need.",
      isPublished: true,
      sortOrder: 1,
    },
    {
      slug: "charity-donations",
      name: "Charity and Donations",
      description:
        "Acts of charity embodying love, compassion, and selflessness — food drives, clothing donations, and financial support for those in need.",
      isPublished: true,
      sortOrder: 2,
    },
    {
      slug: "book-printing",
      name: "Book Printing",
      description:
        "Printing message books and supplying them to churches that aren't able to do so.",
      isPublished: true,
      sortOrder: 3,
    },
    {
      slug: "tapes-sd-cards",
      name: "Tapes & SD Cards",
      description:
        "Supporting believers with recorded messages through SD cards and tapes.",
      isPublished: true,
      sortOrder: 4,
    },
    {
      slug: "elite-foundation",
      name: "Elite Foundation",
      description:
        "Humanitarian and community outreach under Alpha Fellowship. Mission: To empower and uplift vulnerable communities through sustainable outreach programs, education, health services, and youth empowerment initiatives. Vision: A society where every individual, especially the underserved, has access to opportunities, dignity, and a voice.",
      schedule: "Founded 4th April 2023",
      location: "Grace Gardens Namungoona, Kampala",
      isPublished: true,
      sortOrder: 5,
    },
  ];

  for (const ministry of ministries) {
    await prisma.ministry.upsert({
      where: { slug: ministry.slug },
      update: ministry,
      create: ministry,
    });
  }

  await prisma.navigationItem.deleteMany({ where: { id: "nav-programs" } });

  // Navigation
  const navItems = [
    { id: "nav-home", label: "Home", href: "/", sortOrder: 0 },
    { id: "nav-about", label: "About", href: "/about", sortOrder: 1 },
    { id: "nav-ministries", label: "Ministries", href: "/ministries", sortOrder: 2 },
    { id: "nav-events", label: "Events", href: "/events", sortOrder: 3 },
    { id: "nav-watch-live", label: "Watch Live", href: "/watch-live", sortOrder: 5 },
    { id: "nav-blog", label: "Blog", href: "/blog", sortOrder: 6 },
    { id: "nav-involved", label: "Get Involved", href: "/get-involved", sortOrder: 7 },
    { id: "nav-contact", label: "Contact", href: "/contact", sortOrder: 8 },
  ];

  for (const item of navItems) {
    await prisma.navigationItem.upsert({
      where: { id: item.id },
      update: item,
      create: { ...item, location: "main" },
    });
  }

  console.log("✅ Seed completed successfully");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
