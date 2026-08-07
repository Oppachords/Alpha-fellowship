import { auth } from "@/lib/auth";

export async function AdminHeader({ title }: { title: string }) {
  const session = await auth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-white px-6">
      <h1 className="font-serif text-xl font-semibold text-foreground">
        {title}
      </h1>
      <div className="text-right">
        <p className="text-sm font-medium text-foreground">
          {session?.user?.name ?? session?.user?.email}
        </p>
        <p className="text-xs text-muted-foreground capitalize">
          {(session?.user?.roles ?? []).join(", ").replace(/-/g, " ")}
        </p>
      </div>
    </header>
  );
}
