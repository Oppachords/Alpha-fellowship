/**
 * Verified Alpha Fellowship content from alphafellowshipug.com
 * Used as fallback when CMS/database is unavailable.
 * Administrators should manage this content through the CMS in production.
 */

export const churchContent = {
  name: "Alpha Fellowship",
  fullName: "Alpha Fellowship Uganda",
  tagline: "A Place to Worship, Pray, and Grow Spiritually",
  mission: "Setting Ablaze all Nations for Christ",
  vision: "Transforming the lives of young people and directing them to Christ",
  heroSubtitle:
    "Experience the love, peace, hope, and a vibrant prayerful community as we journey this walk of faith together. We shall be really glad to see you on your visit.",
  story: {
    intro:
      "Welcome to our church community! We invite you to be part of the faithful congregation that gathers together in worship, praise, prayer and giving glory to our Mighty and loving God.",
    description:
      "Alpha fellowship is a non denominational fellowship that is working among the young people and love to see the young people grow in their understanding of the spirit. We have a trust that the Lord sent us a message in this hour through a messenger following the scripture of MALACHI 4:5.",
    extended:
      "Brother John Mukisa was Guild president at a great university in Kampala and was a person that loved leadership, so was his mind until God called him to ministry. He saw a number of young people at the University and he was touched to help the lives of the young people. Alpha fellowship started in Jinja at Kampala University and it's still ongoing in Jinja. We have later extended to Kampala in Lugala areas.",
  },
  services: [
    {
      day: "Every Tuesday",
      dayOfWeek: 2,
      startTime: "17:00",
      endTime: "20:00",
      venue: "Grace Gardens Namungoona",
      duration: "3 Hours",
    },
    {
      day: "Every Sunday",
      dayOfWeek: 0,
      startTime: "09:00",
      endTime: "12:00",
      venue: "Grace Gardens Namungoona",
      duration: "3 Hours",
    },
  ],
  serviceDescription:
    "Come as you are and experience the warmth of our community. Our services include live worship, sharing of the word of God, and a time of prayer and fellowship. All are welcome.",
  contact: {
    phone: "0751577730",
    mobile: ["+256 707 768 708", "+256 742 924 852"],
    email: "alphabfellowship7@gmail.com",
    whatsapp: "+256707768708",
    venue: "Grace Gardens Namungoona",
  },
  social: {
    youtube: "https://youtube.com/@alphabfellowship",
    facebook: "https://www.facebook.com/profile.php?id=61567883189973",
    twitter: "https://x.com/FellowshipAlpha",
    instagram: "https://www.instagram.com/stories/fellowshipalpha/",
  },
  leadership: [
    {
      name: "BR Mukisa John Jackson",
      position: "Church Leadership",
      bio: "Brother John Mukisa was Guild president at a great university in Kampala and was a person that loved leadership, so was his mind until God called him to ministry.",
    },
  ],
  programs: [
    {
      title: "Weekly Fellowship",
      description: "Join us for a journey of faith, prayer, counselling and guidance.",
    },
    {
      title: "Counselling",
      description: "Pastoral counselling and spiritual guidance for those in need.",
    },
    {
      title: "Charity and Donations",
      description:
        "Acts of charity embodying love, compassion, and selflessness — food drives, clothing donations, and financial support.",
    },
    {
      title: "Book Printing",
      description:
        "Printing message books and supplying them to churches that aren't able to do so.",
    },
    {
      title: "Tapes & SD Cards",
      description:
        "Supporting believers with recorded messages through SD cards and tapes.",
    },
  ],
  eliteFoundation: {
    name: "Elite Foundation",
    founded: "4th April 2023",
    mission:
      "To empower and uplift vulnerable communities through sustainable outreach programs, education, health services, and youth empowerment initiatives.",
    vision:
      "A society where every individual, especially the underserved, has access to opportunities, dignity, and a voice.",
    focusAreas: [
      "Community Outreach & Relief",
      "Youth & Women Empowerment",
      "Education Support",
      "Health & Sanitation Awareness",
      "Livelihood & Skills Development",
    ],
  },
  payments: {
    mtn: {
      number: "+256-742-924-852",
      merchantCode: "123456",
    },
    airtel: {
      number: "+256-707-768-708",
      merchantCode: "123456",
    },
    bank: {
      accountName: "Mukisa John",
      accountNumber: "1017102126287",
      bank: "Equity Bank",
    },
  },
} as const;

export const navigation = {
  main: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Ministries", href: "/ministries" },
    { label: "Programs", href: "/programs" },
    { label: "Events", href: "/events" },
    { label: "Sermons", href: "/sermons" },
    { label: "Blog", href: "/blog" },
    { label: "Get Involved", href: "/get-involved" },
    { label: "Contact", href: "/contact" },
  ],
  footer: [
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Services", href: "/services" },
    { label: "Gallery", href: "/gallery" },
    { label: "Watch Live", href: "/watch-live" },
    { label: "Give", href: "/give" },
  ],
} as const;
