import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
      <div className="mb-8 text-center">
        <Link
          href="/"
          className="font-serif text-lg font-semibold text-foreground"
        >
          Alpha Fellowship
        </Link>
        <p className="type-body-sm text-muted-foreground mt-2">
          Sign in to the admin dashboard
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
