import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export const metadata: Metadata = {
  title: "Sign In",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <p className="font-serif text-lg font-semibold text-foreground">
            Alpha Fellowship
          </p>
          <p className="type-body-sm text-muted-foreground mt-2">
            Staff sign in
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
}
