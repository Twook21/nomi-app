import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Post } from "@/lib/blogPosts";

const PostListItem: React.FC<{ post: Post }> = ({ post }) => {
  return (
    <article className="flex items-center gap-6 group">
      <div className="flex-shrink-0 w-48 h-32 relative rounded-lg overflow-hidden">
        <Link href={`/blogs/${post.slug}`}>
          <Image
            src={post.imageUrl}
            alt={post.title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      </div>
      <div className="flex-grow">
        <Link
          href={`/blog?category=${post.category}`}
          className="text-sm font-bold text-nimo-yellow uppercase hover:underline"
        >
          {post.category}
        </Link>
        <h2 className="text-xl font-bold text-[var(--nimo-dark)] mt-1 leading-tight">
          <Link
            href={`/blogs/${post.slug}`}
            className="hover:text-nimo-yellow transition-colors duration-300"
          >
            {post.title}
          </Link>
        </h2>
        <div className="mt-2 text-sm text-[var(--nimo-dark)]/60">
          <span>Oleh {post.author}</span>
          <span className="mx-2">•</span>
          <span>{post.publishedDate}</span>
        </div>
      </div>
    </article>
  );
};

export default PostListItem;
