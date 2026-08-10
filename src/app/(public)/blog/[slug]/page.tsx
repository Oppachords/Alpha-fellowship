import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";
import { db } from "@/lib/db";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

async function getPost(slug: string) {
  try {
    return await db.blogPost.findFirst({
      where: { slug, status: "published" },
      include: {
        author: { select: { name: true } },
      },
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: "Post not found" };
  }

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || undefined,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt || undefined,
      images: post.featuredImage ? [post.featuredImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const paragraphs = (post.content ?? "").split(/\n\n+/).filter(Boolean);

  return (
    <article>
      <section className="section-padding bg-cream pt-32">
        <div className="container-content">
          <Link
            href="/blog"
            className="inline-flex text-sm font-semibold text-primary hover:underline mb-6"
          >
            ← Back to blog
          </Link>

          {post.publishedAt && (
            <p className="type-eyebrow mb-4">
              {format(post.publishedAt, "d MMMM yyyy")}
              {post.author?.name ? ` · ${post.author.name}` : ""}
            </p>
          )}

          <h1 className="type-heading mb-6">{post.title}</h1>

          {post.excerpt && (
            <p className="type-body-lg text-muted-foreground mb-8">{post.excerpt}</p>
          )}

          {post.featuredImage && (
            <div className="relative mb-10 overflow-hidden rounded-2xl border border-border bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.featuredImage}
                alt=""
                className="w-full max-h-[420px] object-cover"
              />
            </div>
          )}
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-content prose prose-neutral max-w-none">
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="type-body text-muted-foreground mb-6">
              {paragraph}
            </p>
          ))}
        </div>
      </section>
    </article>
  );
}
