const DAY_LABELS = [
  "Every Sunday",
  "Every Monday",
  "Every Tuesday",
  "Every Wednesday",
  "Every Thursday",
  "Every Friday",
  "Every Saturday",
] as const;

export function formatTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const h = hours % 12 || 12;
  return `${h}:${String(minutes).padStart(2, "0")} ${period}`;
}

export function serviceDayLabel(dayOfWeek: number, name?: string) {
  if (name?.startsWith("Every ")) return name;
  return DAY_LABELS[dayOfWeek] ?? name ?? "Weekly gathering";
}

export function serviceDuration(startTime: string, endTime?: string | null) {
  if (!endTime) return null;
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  const minutes = eh * 60 + em - (sh * 60 + sm);
  if (minutes <= 0) return null;
  const hours = minutes / 60;
  return hours === 1 ? "1 Hour" : `${hours} Hours`;
}

export type PublicService = {
  id: string;
  name: string;
  dayLabel: string;
  startTime: string;
  endTime: string | null;
  venue: string | null;
  description: string | null;
  duration: string | null;
};

export type PublicProgram = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
};

export type PublicLeader = {
  id: string;
  name: string;
  position: string;
  bio: string | null;
};

export type PublicMinistry = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  schedule: string | null;
  location: string | null;
};

export type PublicChurchProfile = {
  name: string;
  tagline: string | null;
  mission: string | null;
  vision: string | null;
  story: string | null;
  fromDatabase: boolean;
};
