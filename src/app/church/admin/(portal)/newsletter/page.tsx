import { format } from "date-fns";
import { AdminHeader } from "@/components/admin/admin-header";
import { db } from "@/lib/db";

async function getSubscribers() {
  try {
    return await db.newsletterSubscriber.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  } catch {
    return null;
  }
}

export default async function AdminNewsletterPage() {
  const subscribers = await getSubscribers();

  return (
    <>
      <AdminHeader title="Newsletter" />
      <div className="flex-1 p-6">
        <div className="rounded-2xl border border-border bg-white p-6 mb-6">
          <p className="type-body-sm text-muted-foreground">
            Subscribers who sign up via the website newsletter form appear here.
            Sending campaigns requires an email integration (Resend).
          </p>
        </div>

        {subscribers === null ? (
          <div className="rounded-2xl border border-border bg-white p-8 text-center">
            <p className="type-body-sm text-muted-foreground">Database not connected.</p>
          </div>
        ) : subscribers.length === 0 ? (
          <div className="rounded-2xl border border-border bg-white p-8 text-center">
            <p className="type-body-sm text-muted-foreground">No subscribers yet.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left p-4 font-medium">Email</th>
                  <th className="text-left p-4 font-medium">Name</th>
                  <th className="text-left p-4 font-medium">Source</th>
                  <th className="text-left p-4 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="border-b border-border last:border-0">
                    <td className="p-4">{sub.email}</td>
                    <td className="p-4 text-muted-foreground">{sub.name ?? "—"}</td>
                    <td className="p-4 text-muted-foreground">{sub.source ?? "—"}</td>
                    <td className="p-4 text-muted-foreground">
                      {format(sub.createdAt, "d MMM yyyy")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
