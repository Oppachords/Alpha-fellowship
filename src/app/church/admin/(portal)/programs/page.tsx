import { AdminHeader } from "@/components/admin/admin-header";
import { CreateProgramForm } from "@/components/admin/create-program-form";
import { db } from "@/lib/db";

async function getPrograms() {
  try {
    return await db.program.findMany({
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    });
  } catch {
    return null;
  }
}

export default async function AdminProgramsPage() {
  const programs = await getPrograms();

  return (
    <>
      <AdminHeader title="Programs" />
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <CreateProgramForm />
          </div>
          <div className="lg:col-span-2 space-y-3">
            {programs === null ? (
              <div className="rounded-2xl border border-border bg-white p-8 text-center">
                <p className="type-body-sm text-muted-foreground">
                  Connect the database to manage programs.
                </p>
              </div>
            ) : programs.length === 0 ? (
              <div className="rounded-2xl border border-border bg-white p-8 text-center">
                <p className="type-body-sm text-muted-foreground">No programs yet.</p>
              </div>
            ) : (
              programs.map((program) => (
                <article
                  key={program.id}
                  className="rounded-2xl border border-border bg-white p-5"
                >
                  <div className="flex justify-between gap-4 mb-2">
                    <h2 className="font-medium text-foreground">{program.title}</h2>
                    <span className="text-xs text-muted-foreground capitalize shrink-0">
                      {program.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                  {program.description && (
                    <p className="text-sm text-muted-foreground">{program.description}</p>
                  )}
                  {(program.schedule || program.location) && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {[program.schedule, program.location].filter(Boolean).join(" · ")}
                    </p>
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
