import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";

export type BlogPostSummary = {
  slug: string;
  title: string;
  excerpt: string | null;
  featuredImage: string | null;
  publishedAt: Date | null;
  authorName?: string | null;
};

export function BlogCard({ post }: { post: BlogPostSummary }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md h-full">
      {post.featuredImage ? (
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.featuredImage}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="flex aspect-[16/10] items-center justify-center bg-cream text-sm text-muted-foreground">
          Alpha Fellowship Blog
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        {post.publishedAt && (
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
            {format(post.publishedAt, "d MMM yyyy")}
            {post.authorName ? ` · ${post.authorName}` : ""}
          </p>
        )}
        <h3 className="type-subheading text-lg mb-3 line-clamp-2">{post.title}</h3>
        {post.excerpt && (
          <p className="type-body-sm text-muted-foreground line-clamp-3 mb-5 flex-1">
            {post.excerpt}
          </p>
        )}
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline mt-auto"
        >
          Read more
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
