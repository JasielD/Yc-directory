import { auth } from "@/auth";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_ID_QUERY } from "@/sanity/lib/queries";
import Image from "next/image";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import UserStartups, { StartupCardSkeleton } from "@/components/userStartups";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await auth();
  const user = await client.fetch(AUTHOR_BY_ID_QUERY, { id });
  if (!user) {
    return notFound();
  }

  return (
    <section className="profile_container">
      <div className="profile_card">
        <div className="profile_title">
          <h3 className="text-24-black line-clamp-1 text-center uppercase">
            {user.name}
          </h3>
        </div>
        <div className="relative w-55 h-55 rounded-full overflow-hidden shrink-0">
          <Image
            src={user.image}
            alt={user.name}
            fill={true} /* 2. Tells Image to fill its relative parent */
            className="profile_image" /* 3. 'object-cover' crops the image to fit the circle */
            /* 4. Remove width={64} and height={64} */
          />
        </div>
        <p className="text-30-extrabold m-7 text-center">
            @{user?.username}
        </p>
        <p className="mt-1 text-center text-14-normal">
            {user?.bio}
        </p>
      </div>
      <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
        <p className="text-30-bold"> 
            {session?.id === id ? "Your Startup":' Your All Startups'}
        </p>
        <ul className="card_grid-sm">
            <Suspense fallback={<StartupCardSkeleton />}>
            <UserStartups id={id}/>
            </Suspense>
        </ul>
      </div>
    </section>
  );
};

export default page;
