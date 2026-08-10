import type { Metadata } from "next";
import { PageHero } from "@/components/public/page-hero";
import { BlogCard } from "@/components/public/blog-card";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Messages, reflections, and updates from Alpha Fellowship Uganda.",
};

async function getPublishedPosts() {
  try {
    return await db.blogPost.findMany({
      where: { status: "published" },
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
      include: {
        author: { select: { name: true } },
      },
      take: 24,
    });
  } catch {
    return null;
  }
}

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <PageHero
        eyebrow="Updates & reflections"
        title="Blog"
        description="Messages, teachings, and news from our fellowship community."
      />

      <section className="section-padding bg-background">
        <div className="container-wide">
          {posts === null ? (
            <div className="rounded-2xl border border-border bg-white p-10 text-center">
              <p className="type-body-sm text-muted-foreground">
                Blog posts will appear here once the database is connected.
              </p>
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-2xl border border-border bg-white p-10 text-center">
              <p className="type-subheading mb-2">Posts coming soon</p>
              <p className="type-body-sm text-muted-foreground">
                Our pastors and leaders will share updates and reflections here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <BlogCard
                  key={post.id}
                  post={{
                    slug: post.slug,
                    title: post.title,
                    excerpt: post.excerpt,
                    featuredImage: post.featuredImage,
                    publishedAt: post.publishedAt,
                    authorName: post.author?.name,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
