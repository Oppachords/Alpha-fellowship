import { AdminHeader } from "@/components/admin/admin-header";
import { AdminRecordActions } from "@/components/admin/admin-record-actions";
import { DeleteRecordButton } from "@/components/admin/delete-record-button";
import { CreateProgramForm } from "@/components/admin/create-program-form";
import { ProgramImageUpload } from "@/components/admin/program-image-upload";
import { EditProgramForm } from "@/components/admin/cms/operations-forms";
import { deleteProgramAction } from "@/lib/actions/church-content-admin";
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
                  <div className="flex flex-col sm:flex-row gap-5">
                    {program.imageUrl ? (
                      <div className="relative h-24 w-full sm:h-20 sm:w-28 shrink-0 overflow-hidden rounded-xl bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={program.imageUrl}
                          alt={program.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-24 w-full sm:h-20 sm:w-28 shrink-0 items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 text-xs text-muted-foreground">
                        No photo
                      </div>
                    )}
                    <div className="flex-1">
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
                      <div className="mt-4">
                        <ProgramImageUpload
                          programId={program.id}
                          programTitle={program.title}
                          currentUrl={program.imageUrl}
                        />
                      </div>
                      <AdminRecordActions
                        editForm={<EditProgramForm program={program} />}
                        deleteButton={
                          <DeleteRecordButton id={program.id} action={deleteProgramAction} />
                        }
                      />
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
