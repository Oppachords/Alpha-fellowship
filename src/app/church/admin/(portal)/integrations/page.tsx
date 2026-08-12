import Link from "next/link";
import { CheckCircle2, Circle, ExternalLink, AlertTriangle } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { getIntegrationStatuses } from "@/lib/integrations/status";
import { getYouTubeHealth } from "@/lib/integrations/youtube";

export default async function AdminIntegrationsPage() {
  const integrations = getIntegrationStatuses();
  const youtubeHealth = await getYouTubeHealth();

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
                <div className="space-y-3">
                  <div
                    className={`rounded-xl border px-4 py-3 text-sm ${
                      youtubeHealth.error
                        ? "border-amber-200 bg-amber-50 text-amber-950"
                        : "border-emerald-200 bg-emerald-50 text-emerald-950"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {youtubeHealth.error ? (
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                      ) : (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                      )}
                      <div>
                        {youtubeHealth.error ? (
                          <>
                            <p className="font-medium">YouTube connection failed</p>
                            <p className="mt-1 text-xs opacity-90">{youtubeHealth.error}</p>
                          </>
                        ) : (
                          <>
                            <p className="font-medium">YouTube connection OK</p>
                            <p className="mt-1 text-xs opacity-90">
                              Channel{" "}
                              <code className="rounded bg-white/70 px-1 py-0.5">
                                {youtubeHealth.channelId}
                              </code>
                              {youtubeHealth.videoCount > 0
                                ? " — videos reachable"
                                : " — connected, but no public videos returned yet"}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {!youtubeHealth.error && (
                    <p className="text-xs text-muted-foreground">
                      Use the channel ID above in Vercel as{" "}
                      <code className="rounded bg-muted px-1 py-0.5">YOUTUBE_CHANNEL_ID</code>.
                      Handles like <code className="rounded bg-muted px-1 py-0.5">@alphabfellowship</code>{" "}
                      also work now.
                    </p>
                  )}

                  {youtubeHealth.error && (
                    <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-5">
                      <li>
                        Enable <strong>YouTube Data API v3</strong> in Google Cloud Console.
                      </li>
                      <li>
                        Set API key application restriction to <strong>None</strong> or{" "}
                        <strong>IP addresses</strong> — not HTTP referrers (server-side fetch).
                      </li>
                      <li>
                        Set <code className="rounded bg-muted px-1 py-0.5">YOUTUBE_CHANNEL_ID</code>{" "}
                        to{" "}
                        <code className="rounded bg-muted px-1 py-0.5">UCFQ3S1UouA2OPlPZLISnbXA</code>{" "}
                        or <code className="rounded bg-muted px-1 py-0.5">@alphabfellowship</code>.
                      </li>
                    </ul>
                  )}

                  <Link
                    href="/watch-live"
                    target="_blank"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    Preview watch live page
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
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
