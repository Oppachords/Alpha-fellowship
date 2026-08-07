"use server";

export async function submitMembershipApplicationAction(
  _prevState: { success?: boolean; error?: string } | undefined,
  formData: FormData
) {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();

  if (!name || !email) {
    return { error: "Name and email are required." };
  }

  // Database integration will persist MembershipApplication records in a later phase.
  void phone;
  void message;

  return { success: true };
}
