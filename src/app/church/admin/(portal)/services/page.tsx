import { formatTime, serviceDayLabel, serviceDuration } from "@/lib/content/format-service";
import { AdminHeader } from "@/components/admin/admin-header";
import { CreateServiceForm } from "@/components/admin/create-service-form";
import { db } from "@/lib/db";

async function getServices() {
  try {
    return await db.service.findMany({
      orderBy: [{ sortOrder: "asc" }, { dayOfWeek: "asc" }],
    });
  } catch {
    return null;
  }
}

export default async function AdminServicesPage() {
  const services = await getServices();

  return (
    <>
      <AdminHeader title="Gatherings" />
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <CreateServiceForm />
          </div>
          <div className="lg:col-span-2 space-y-3">
            {services === null ? (
              <div className="rounded-2xl border border-border bg-white p-8 text-center">
                <p className="type-body-sm text-muted-foreground">
                  Connect the database to manage weekly gatherings.
                </p>
              </div>
            ) : services.length === 0 ? (
              <div className="rounded-2xl border border-border bg-white p-8 text-center">
                <p className="type-body-sm text-muted-foreground">No gatherings yet.</p>
              </div>
            ) : (
              services.map((service) => (
                <article
                  key={service.id}
                  className="rounded-2xl border border-border bg-white p-5"
                >
                  <div className="flex justify-between gap-4 mb-2">
                    <h2 className="font-medium text-foreground">{service.name}</h2>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {service.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {serviceDayLabel(service.dayOfWeek, service.name)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatTime(service.startTime)}
                    {service.endTime ? ` – ${formatTime(service.endTime)}` : ""}
                    {serviceDuration(service.startTime, service.endTime)
                      ? ` · ${serviceDuration(service.startTime, service.endTime)}`
                      : ""}
                  </p>
                  {service.venue && (
                    <p className="text-sm text-muted-foreground mt-1">{service.venue}</p>
                  )}
                  {service.description && (
                    <p className="text-sm text-muted-foreground mt-2">{service.description}</p>
                  )}
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
