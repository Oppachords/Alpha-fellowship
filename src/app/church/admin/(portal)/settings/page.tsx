import { AdminHeader } from "@/components/admin/admin-header";
import { ChangePasswordForm } from "@/components/admin/change-password-form";
import { ChurchProfileForm } from "@/components/admin/church-profile-form";
import { db } from "@/lib/db";
import { churchContent } from "@/lib/content/church-content";

async function getChurchProfile() {
  try {
    const profile = await db.churchProfile.findUnique({
      where: { id: "default" },
    });

    if (profile) {
      return {
        name: profile.name,
        tagline: profile.tagline ?? "",
        mission: profile.mission ?? "",
        vision: profile.vision ?? "",
        story: profile.story ?? "",
        fromDatabase: true,
      };
    }
  } catch {
    // fall through to static content
  }

  return {
    name: churchContent.fullName,
    tagline: churchContent.tagline,
    mission: churchContent.mission,
    vision: churchContent.vision,
    story: `${churchContent.story.intro}\n\n${churchContent.story.description}`,
    fromDatabase: false,
  };
}

export default async function AdminSettingsPage() {
  const profile = await getChurchProfile();

  return (
    <>
      <AdminHeader title="Site Settings" />
      <div className="flex-1 p-6">
        <div className="max-w-3xl space-y-6">
          {!profile.fromDatabase && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Showing fallback content. Connect the database to persist changes.
            </div>
          )}

          <div className="rounded-2xl border border-border bg-white p-6 md:p-8">
            <h2 className="type-subheading mb-1">Church profile</h2>
            <p className="type-body-sm text-muted-foreground mb-6">
              Core identity information shown on the public website.
            </p>
            <ChurchProfileForm profile={profile} />
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 md:p-8">
            <h2 className="type-subheading mb-1">Change password</h2>
            <p className="type-body-sm text-muted-foreground mb-6">
              Update your admin account password.
            </p>
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </>
  );
}
