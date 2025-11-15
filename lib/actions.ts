"use server";
import { auth } from "@/auth";
import { ParseServerActionResponse } from "./utils";
import slugify from "slugify"
import { write_Client } from "@/sanity/lib/write-client";
import { error } from "console";


export const createPitch = async(
    state:any,
    form:FormData,
    pitch:string,
)=>{
    const session = await auth();
    if(!session){
        return ParseServerActionResponse({
            error:"Not signed in",
            Status:"ERROR",
        })
    }

    const { title, description, category, link } = Object.fromEntries(
    Array.from(form).filter(([key]) => key !== "pitch"),
  );

  const slug = slugify(title as string,{lower:true,strict:true})

  try {
    const startup = {
        title,
        description,
        category,
        image:link,
        slug:{
            _type:slug,
            current:slug,
        },
        author:{
            _type:"reference",
            _ref:session?.id
        },
        pitch,
    }
     const result = await write_Client.create({ _type: "startup", ...startup });
     return ParseServerActionResponse({
            data:result,
            error:'',
            Status:"SUCCESS",
        })
  } catch (error) {
    console.log(error)
    return ParseServerActionResponse({
            error:JSON.stringify(error),
            Status:"ERROR",
        })
  }
} 