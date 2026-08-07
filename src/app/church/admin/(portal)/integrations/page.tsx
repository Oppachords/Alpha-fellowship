import Link from "next/link";
import { CheckCircle2, Circle, ExternalLink } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { getIntegrationStatuses } from "@/lib/integrations/status";

export default function AdminIntegrationsPage() {
  const integrations = getIntegrationStatuses();

  return (
    <>
      <AdminHeader title="Integrations" />
      <div className="flex-1 p-6">
        <div className="max-w-3xl space-y-4">
          <p className="type-body-sm text-muted-foreground mb-6">
            Configure these services via Vercel environment variables. Secrets are
            never shown here — only whether each integration is ready.
          </p>

          {integrations.map((integration) => (
            <article
              key={integration.id}
              className="rounded-2xl border border-border bg-white p-5 md:p-6"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h2 className="font-medium text-foreground">{integration.name}</h2>
                  <p className="type-body-sm text-muted-foreground mt-1">
                    {integration.description}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium shrink-0 ${
                    integration.configured
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {integration.configured ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Ready
                    </>
                  ) : (
                    <>
                      <Circle className="h-3.5 w-3.5" />
                      Not configured
                    </>
                  )}
                </span>
              </div>

              <ul className="text-xs text-muted-foreground space-y-1 mb-4">
                {integration.envVars.map((envVar) => (
                  <li key={envVar}>
                    <code className="rounded bg-muted px-1.5 py-0.5">{envVar}</code>
                  </li>
                ))}
              </ul>

              {integration.id === "youtube" && (
                <Link
                  href="/watch-live"
                  target="_blank"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  Preview watch live page
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              )}
              {integration.id === "cloudinary" && (
                <Link
                  href="/church/admin/media"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  Open media library
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              )}
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
