import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Post } from "@/lib/blogPosts";

const FeaturedPostCard: React.FC<{ post: Post }> = ({ post }) => {
  return (
    <article className="relative w-full h-96 rounded-2xl overflow-hidden group shadow-lg">
      <Image
        src={post.imageUrl}
        alt={post.title}
        layout="fill"
        objectFit="cover"
        className="transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-8 text-white">
        <Link
          href={`/blog?category=${post.category}`}
          className="text-sm font-bold text-nimo-yellow uppercase hover:underline"
        >
          {post.category}
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold mt-2 leading-tight">
          <Link
            href={`/blogs/${post.slug}`}
            className="hover:text-nimo-yellow transition-colors duration-300"
          >
            {post.title}
          </Link>
        </h1>
        <div className="mt-4 text-sm opacity-80">
          <span>Oleh {post.author}</span>
          <span className="mx-2">•</span>
          <span>{post.publishedDate}</span>
        </div>
      </div>
    </article>
  );
};

export default FeaturedPostCard;
