import z from "zod";

export const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(3, "Category must be at least 3 characters"),
  
  link: z.string().url("Must be a valid URL"),
  // 👇 FIX 1: Removed the refine. It's slow and unreliable.
  // A simple .url() check is much better for a server action.
  // If you must check for an image, do it *after* validation.
  
  pitch: z.string().min(10, "Pitch must be at least 10 characters"),
  // 👇 FIX 2: Changed from z.string().url() to z.string().min(10)
  // This now accepts your markdown text.
});