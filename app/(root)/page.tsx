import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import Search from "../../components/Search_Input";
import { client } from "@/sanity/lib/client";
import { STARTUP_QUERY } from "@/sanity/lib/queries";

export default async function Home({searchParams}:{
  searchParams: Promise<{query?:string}>
}) {
  const query = (await searchParams).query
  const posts = await client.fetch(STARTUP_QUERY)
  console.log(JSON.stringify(posts,null,2))

  return (
    <div>
      <section className="pink_container bg-primary">
      <h1 className="heading">Pitch Your Start-up <br/> Connect with Enterpreneurs</h1> 
      <p className="sub-heading max-w-3xl">Submit Ideas, Vote on pitches, Get Noticed in Virtual Compitition</p>
      <Search  query={query}/>
      </section>
      <section className="section_container">
        <p className="text-30-semibold">
          {query?`Search results for "${query}"`:"All Startups"}
        </p>
        <ul className="mt-7 card_grid">
          {posts?.length>0?(
            posts.map((post:StartupTypeCard,index:number)=>(
               <StartupCard key={post?._id} post={post}/>
            ))
          ):(
            <p className="no_results">No Startups Found</p>
          )}
        </ul>
      </section>
    </div>
  );
}
