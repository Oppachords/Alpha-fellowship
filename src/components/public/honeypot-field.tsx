import { honeypotFieldProps } from "@/lib/security/honeypot";

export function HoneypotField() {
  return (
    <input
      type="text"
      {...honeypotFieldProps}
      className="hidden"
      defaultValue=""
    />
  );
}
