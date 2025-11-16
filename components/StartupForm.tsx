"use client";

import React, { useState, useActionState,useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createPitch } from "@/lib/actions";

type FormState = {
  error: string;
  status: "INITIAL" | "SUCCESS" | "ERROR";
  fieldErrors?: Record<string, string>;
  _id?: string; // We'll pass the new startup ID back in the state
};

const initialFormState: FormState = {
  error: "",
  status: "INITIAL",
};

const StartupForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  // 3. Modify your action handler
  // It should NOT call any hooks (toast, router, setErrors).
  // It should ONLY return the new state.
  const handleFormSubmit = async (
    prevState: FormState,
    formData: FormData
  ): Promise<FormState> => { // Ensure it returns the new FormState
    try {
      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        link: formData.get("link") as string,
        pitch, // This closure works since handleFormSubmit is defined in the component
      };

      // Validate data
      await formSchema.parseAsync(formValues);
      formData.append('pitch', pitch);
      // Call your server action.
      // Make sure createPitch returns { status: 'SUCCESS', _id: '...' }
      // or { status: 'ERROR', error: '...' }
      const result = await createPitch(prevState, formData);

      // Return the new state based on the result
      if (result.status === "SUCCESS") {
        return {
          status: "SUCCESS",
          _id: result._id, // Pass the ID back in the state
          error: "",
        };
      } else {
        // Handle a non-success error from createPitch
        return {
          status: "ERROR",
          error: result.error || "Failed to create pitch",
          fieldErrors: result.fieldErrors || {},
        };
      }
    } catch (error) {
      // Handle Zod validation error
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        return {
          ...prevState,
          status: "ERROR",
          error: "Validation failed. Please check your inputs.",
          fieldErrors: fieldErrors as unknown as Record<string, string>,
        };
      }

      // Handle other unexpected errors
      return {
        ...prevState,
        status: "ERROR",
        error: "An unexpected error has occurred",
      };
    }
  };

  // Your useActionState hook is now correctly set up
  const [state, formAction, isPending] = useActionState(
    handleFormSubmit,
    initialFormState
  );

  // 4. Use useEffect to handle ALL side effects
  useEffect(() => {
    // On success
    if (state.status === "SUCCESS" && state._id) {
      toast({
        title: "Success",
        description: "Your startup pitch has been created successfully",
      });
      // Now you can safely redirect
      router.push(`/startup/${state._id}`);
    }

    // On error
    if (state.status === "ERROR") {
      toast({
        title: "Error",
        description: state.error, // Use the error message from the state
        variant: "destructive",
      });
      // Set local error state for your UI
      if (state.fieldErrors) {
        setErrors(state.fieldErrors);
      }
    }
    // This effect runs whenever the 'state' object changes
  }, [state, router, toast])
  // const handleFormSubmit = async (prevState: any, formData: FormData) => {
  //   try {
  //     const formValues = {
  //       title: formData.get("title") as string,
  //       description: formData.get("description") as string,
  //       category: formData.get("category") as string,
  //       link: formData.get("link") as string,
  //       pitch,
  //     };

  //     await formSchema.parseAsync(formValues);

  //     const result = await createPitch(prevState, formData, pitch);

  //     if (result.status == "SUCCESS") {
  //       toast({
  //         title: "Success",
  //         description: "Your startup pitch has been created successfully",
  //       });

  //       router.push(`/startup/${result._id}`);
  //     }

  //     return result;
  //   } catch (error) {
  //     if (error instanceof z.ZodError) {
  //       const fieldErorrs = error.flatten().fieldErrors;

  //       setErrors(fieldErorrs as unknown as Record<string, string>);

  //       toast({
  //         title: "Error",
  //         description: "Please check your inputs and try again",
  //         variant: "destructive",
  //       });

  //       return { ...prevState, error: "Validation failed", status: "ERROR" };
  //     }

  //     toast({
  //       title: "Error",
  //       description: "An unexpected error has occurred",
  //       variant: "destructive",
  //     });

  //     return {
  //       ...prevState,
  //       error: "An unexpected error has occurred",
  //       status: "ERROR",
  //     };
  //   }
  // };

  // const [state, formAction, isPending] = useActionState(handleFormSubmit, {
  //   error: "",
  //   status: "INITIAL",
  // });

  return (
    <form action={formAction} className="startup-form">
      <div>
        <label htmlFor="title" className="startup-form_label">
          Title
        </label>
        <Input
          id="title"
          name="title"
          className="startup-form_input"
          required
          placeholder="Startup Title"
        />

        {errors.title && <p className="startup-form_error">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="startup-form_label">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          className="startup-form_textarea"
          required
          placeholder="Startup Description"
        />

        {errors.description && (
          <p className="startup-form_error">{errors.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="startup-form_label">
          Category
        </label>
        <Input
          id="category"
          name="category"
          className="startup-form_input"
          required
          placeholder="Startup Category (Tech, Health, Education...)"
        />

        {errors.category && (
          <p className="startup-form_error">{errors.category}</p>
        )}
      </div>

      <div>
        <label htmlFor="link" className="startup-form_label">
          Image URL
        </label>
        <Input
          id="link"
          name="link"
          className="startup-form_input"
          required
          placeholder="Startup Image URL"
        />

        {errors.link && <p className="startup-form_error">{errors.link}</p>}
      </div>

      <div data-color-mode="light">
        <label htmlFor="pitch" className="startup-form_label">
          Pitch
        </label>

        <MDEditor
          value={pitch}
          onChange={(value) => setPitch(value as string)}
          id="pitch"
          preview="edit"
          height={300}
          style={{ borderRadius: 20, overflow: "hidden" }}
          textareaProps={{
            placeholder:
              "Briefly describe your idea and what problem it solves",
          }}
          previewOptions={{
            disallowedElements: ["style"],
          }}
        />

        {errors.pitch && <p className="startup-form_error">{errors.pitch}</p>}
      </div>

      <Button
        type="submit"
        className="startup-form_btn text-white"
        disabled={isPending}
      >
        {isPending ? "Submitting..." : "Submit Your Pitch"}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
};

export default StartupForm;