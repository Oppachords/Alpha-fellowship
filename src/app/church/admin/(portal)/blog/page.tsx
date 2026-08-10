import Link from "next/link";
import { format } from "date-fns";
import { AdminHeader } from "@/components/admin/admin-header";
import { CreateBlogForm } from "@/components/admin/create-blog-form";
import { db } from "@/lib/db";

async function getBlogPosts() {
  try {
    return await db.blogPost.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { name: true } },
      },
      take: 40,
    });
  } catch {
    return null;
  }
}

export default async function AdminBlogPage() {
  const posts = await getBlogPosts();

  return (
    <>
      <AdminHeader title="Blog" />
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <CreateBlogForm />
          </div>
          <div className="lg:col-span-2 space-y-3">
            {posts === null ? (
              <div className="rounded-2xl border border-border bg-white p-8 text-center">
                <p className="type-body-sm text-muted-foreground">
                  Connect the database to manage blog posts.
                </p>
              </div>
            ) : posts.length === 0 ? (
              <div className="rounded-2xl border border-border bg-white p-8 text-center">
                <p className="type-body-sm text-muted-foreground">No blog posts yet.</p>
              </div>
            ) : (
              posts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-2xl border border-border bg-white p-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-2">
                    <div>
                      <h2 className="font-medium text-foreground">{post.title}</h2>
                      {post.author?.name && (
                        <p className="text-xs text-muted-foreground mt-1">
                          By {post.author.name}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground capitalize shrink-0">
                      {post.status}
                      {post.publishedAt
                        ? ` · ${format(post.publishedAt, "d MMM yyyy")}`
                        : ""}
                    </span>
                  </div>
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {post.excerpt}
                    </p>
                  )}
                  {post.status === "published" && (
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="text-sm text-primary hover:underline"
                    >
                      View on website
                    </Link>
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
