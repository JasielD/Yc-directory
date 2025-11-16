"use server";
import { auth } from "@/auth";
import { ParseServerActionResponse } from "./utils";
import slugify from "slugify";
import { write_Client } from "@/sanity/lib/write-client";

export const createPitch = async (
  state: any,
  form: FormData // FIX: Removed the extra 'pitch: string' argument
) => {
  const session = await auth();
  if (!session) {
    return ParseServerActionResponse({
      error: "Not signed in",
      status: "ERROR", // FIX: 'status' should be lowercase to match client
    });
  }

  // FIX: Get all fields from the 'form' object, including pitch
  const title = form.get("title") as string;
  const description = form.get("description") as string;
  const category = form.get("category") as string;
  const link = form.get("link") as string;
  const pitch = form.get("pitch") as string; // FIX: Get pitch from the form

  const slug = slugify(title as string, { lower: true, strict: true });

  try {
    const startup = {
      title,
      description,
      category,
      image: link,
      slug: {
        _type: "slug", // FIX: The _type is "slug", not the variable 'slug'
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: session?.id,
      },
      pitch,
    };
    
    console.log(startup);
    
    const result = await write_Client.create({ _type: "startup", ...startup });

    // FIX: This is the critical change for your redirect.
    // The client's useEffect needs 'status: "SUCCESS"' and the '_id'
    // at the top level of the returned object.
    return ParseServerActionResponse({
      status: "SUCCESS", // 'status', not 'Status'
      _id: result._id,   // Pass the _id here
      error: '',
      // data: result, // You can still pass data if you need it, but _id is key
    });

  } catch (error) {
    console.log(error);
    return ParseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR", // 'status', not 'Status'
    });
  }
};