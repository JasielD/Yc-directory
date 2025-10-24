import Search from "../../components/Search_Input";

export default async function Home({searchParams}:{
  searchParams: Promise<{query?:string}>
}) {
  const query = (await searchParams).query
  return (
    <div>
      <section className="pink_container bg-primary">
      <h1 className="heading">Pitch Your Start-up <br/> Connect with Enterpreneurs</h1> 
      <p className="sub-heading max-w-3xl">Submit Ideas, Vote on pitches, Get Noticed in Virtual Compitition</p>
      <Search  query={query}/>
      </section>
    </div>
  );
}
