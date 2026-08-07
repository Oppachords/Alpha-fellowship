import { AdminHeader } from "@/components/admin/admin-header";
import { db } from "@/lib/db";
import { formatDistanceToNow } from "date-fns";

async function getMessages() {
  try {
    return await db.contactMessage.findMany({
      where: { isArchived: false },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  } catch {
    return null;
  }
}

export default async function AdminMessagesPage() {
  const messages = await getMessages();

  return (
    <>
      <AdminHeader title="Contact Messages" />
      <div className="flex-1 p-6">
        {messages === null ? (
          <div className="rounded-2xl border border-border bg-white p-8 text-center">
            <p className="type-body text-muted-foreground">
              Connect your database to view contact form submissions.
            </p>
          </div>
        ) : messages.length === 0 ? (
          <div className="rounded-2xl border border-border bg-white p-8 text-center">
            <p className="type-subheading mb-2">No messages yet</p>
            <p className="type-body-sm text-muted-foreground">
              Contact form submissions will appear here once the public form is
              wired to the database.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <article
                key={message.id}
                className="rounded-2xl border border-border bg-white p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                  <div>
                    <h2 className="font-medium text-foreground">{message.name}</h2>
                    <p className="text-sm text-muted-foreground">{message.email}</p>
                  </div>
                  <div className="text-right">
                    {!message.isRead && (
                      <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary mb-1">
                        New
                      </span>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(message.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-medium text-foreground mb-2">
                  {message.subject}
                </p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {message.message}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
