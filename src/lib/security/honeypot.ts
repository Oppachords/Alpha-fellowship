export function isHoneypotTriggered(formData: FormData) {
  const value = (formData.get("_hp") as string | null)?.trim();
  return Boolean(value);
}

export const honeypotFieldProps = {
  name: "_hp" as const,
  tabIndex: -1,
  autoComplete: "off" as const,
  "aria-hidden": true as const,
};
