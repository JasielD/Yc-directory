import { defineQuery } from "next-sanity";


export const STARTUP_QUERY = defineQuery(`*[_type=="startup" && defined(slug.current) && !defined($search) || title match $search || category match $search || author->name match $search]| order(_createdAt desc){
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

export const  STARTUP_BY_ID_QUERY = defineQuery(`*[_type=="startup" && _id == $id] [0]{
  _id,
    title,
    category,
    _createdAt,
    views,
    author ->{
      _id,name,username,image,bio
    },
    image,
    description,
    pitch,
    slug
}`)