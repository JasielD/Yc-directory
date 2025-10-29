import { defineQuery } from "next-sanity";


export const STARTUP_QUERY = defineQuery(`*[_type=="startup" && defined(slug.current)]| order(_createdAt desc){
  _id,
    title,category,
    _createdAt,
    views,
    author ->{
      _id,name,slug,image,bio
    },
    image,
    description
}`)