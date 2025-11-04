// [id] was created for dynamic routes eg: url/startup/[id]
import { formatDate } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import { STARTUP_BY_ID_QUERY } from "@/sanity/lib/queries";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import markdown from "markdown-it";
import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";

const md = markdown();

export const experimental_ppr = true;

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const post = await client.fetch(STARTUP_BY_ID_QUERY, { id });
  if (!post) return notFound();
  const parsed_content = md.render(post?.pitch || '');
  return (
    <>
      <section className="pink_container max-h-[230px]!">
        <p className="tag">{formatDate(post?._createdAt)}</p>
        <h1 className="heading">{post.title}</h1>
        <p className="sub-heading max-w-5xl">{post?.description}</p>
      </section>
      <section className="section_container">
        <img
          src={post.image}
          alt="thumbnail"
          className="w-full h-auto rounded-xl"
        />
        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            <Link
              href={`/user/${post.author?._id}`}
              className=" flex gap-2 items-center mb-3"
            >
              <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0">
                <Image
                  src={post.author?.image}
                  alt="profile image"
                  fill={true} /* 2. Tells Image to fill its relative parent */
                  className="drop-shadow-lg object-cover" /* 3. 'object-cover' crops the image to fit the circle */
                  /* 4. Remove width={64} and height={64} */
                />
              </div>
              <div>
                <p className="text-20-medium">{post.author?.name}</p>
                <p className="text-16-medium text-black-300!">@{post.author?.username}</p>
              </div>
            </Link>
            <p className="category-tag">{post.category}</p>
          </div>
          <h3 className="text-30-bold">Pitch Details</h3>
          {parsed_content?(
          <article className="prose max-w-4xl font-work-sans break-all"
            dangerouslySetInnerHTML={{__html:parsed_content}}
            />
          ):(
            <p className="no-result">No details</p>
          )}
        </div>
        <hr className="divider"></hr>
        <Suspense fallback={<Skeleton className="view_skeleton"/>}>
        <View id={id} />
        </Suspense>
      </section>
    </>
  );
};

export default page;
