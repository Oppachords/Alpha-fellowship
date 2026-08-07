import { isCloudinaryConfigured } from "@/lib/integrations/cloudinary";
import { isYouTubeConfigured } from "@/lib/integrations/youtube";
import { isEmailConfigured } from "@/lib/email/send-email";

export type IntegrationStatus = {
  id: string;
  name: string;
  description: string;
  configured: boolean;
  envVars: string[];
};

export function getIntegrationStatuses(): IntegrationStatus[] {
  return [
    {
      id: "youtube",
      name: "YouTube",
      description: "Live streams and sermon videos on the public site.",
      configured: isYouTubeConfigured(),
      envVars: ["YOUTUBE_API_KEY", "YOUTUBE_CHANNEL_ID (optional — handle fallback used)"],
    },
    {
      id: "cloudinary",
      name: "Cloudinary",
      description: "Image uploads for admin media library.",
      configured: isCloudinaryConfigured(),
      envVars: ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"],
    },
    {
      id: "resend",
      name: "Resend Email",
      description: "Staff notifications for forms and registrations.",
      configured: isEmailConfigured(),
      envVars: ["RESEND_API_KEY", "EMAIL_FROM", "ADMIN_NOTIFICATION_EMAIL (optional)"],
    },
  ];
}
