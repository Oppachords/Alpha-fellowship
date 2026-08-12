import { isCloudinaryConfigured } from "@/lib/integrations/cloudinary";
import { isYouTubeAutoSyncAvailable } from "@/lib/integrations/youtube";
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
      configured: isYouTubeAutoSyncAvailable(),
      envVars: [
        "YOUTUBE_CHANNEL_ID (optional — defaults to Alpha Fellowship channel)",
        "YOUTUBE_API_KEY (optional — enables live stream detection)",
      ],
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
