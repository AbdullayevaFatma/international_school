"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { subjectSchema } from "@/lib/formValidationSchemas";
import { createSubject, updateSubject } from "@/lib/actions";
import { startTransition, useFormState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const SubjectForm = ({ type, data, setOpen, relatedData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(subjectSchema),
  });


  const [state, formAction] = useFormState(
    type === "create" ? createSubject : updateSubject,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
  console.log(data);

  startTransition(() => {
    formAction(data);
  });
});
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(
        `Subject has been ${type === "create" ? "created" : "updated"}!`
      );
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { teachers } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new subject" : "Update the subject"}
      </h1>

      <div className="flex justify-between  flex-wrap gap-4">
        <InputField
          label="Subject name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
      
        />
        {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden
          />
        )}
        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <label className="text-sm text-gray-700">Teachers</label>
          <select
            multiple
            className=" p-3 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm transition-all overflow-auto space-y-2.5"
            {...register("teachers")}
            defaultValue={data?.teachers}
          >
            {teachers.map((teacher) => (
              <option value={teacher.id} key={teacher.id} >
                {teacher.name + " " + teacher.surname}
              </option>
            ))}
          </select>
          {errors.teachers?.message && (
            <p className="text-xs text-secon">
              {errors.teachers.message.toString()}
            </p>
          )}
        </div>
      </div>
      {state.error && (
        <span className="text-secondary">Something went wrong!</span>
      )}
      <button className="bg-primary text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default SubjectForm;
