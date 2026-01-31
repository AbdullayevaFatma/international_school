"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { classSchema } from "@/lib/formValidationSchemas";
import { createClass, updateClass } from "@/lib/actions";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ClassForm = ({ type, data, setOpen, relatedData }) => {
 const { register, handleSubmit, watch, formState: { errors } } = useForm({
  resolver: zodResolver(classSchema),
  defaultValues: {
    supervisorId: data?.supervisorId ?? null,
    name: data?.name || "",
    capacity: data?.capacity || "",
    gradeId: data?.gradeId ?? null,
    id: data?.id,
  },
});

  const [success, setSuccess] = useState(false);
const [error, setError] = useState(false);

const onSubmit = handleSubmit((formData) => {
  if (type === "create") {
    createClass(formData).then((res) => {
      if (res.success) {
        toast("Class created!");
        setOpen(false);
        router.refresh();
      } else {
        setError(true);
      }
    });
  } else {
    updateClass(formData).then((res) => {
      if (res.success) {
        toast("Class updated!");
        setOpen(false);
        router.refresh();
      } else {
        setError(true);
      }
    });
  }
});


  const router = useRouter();

useEffect(() => {
  if (success) {
    toast(`Class has been ${type === "create" ? "created" : "updated"}!`);
    setOpen(false);
    router.refresh();
  }
}, [success, router, type, setOpen]);

  const { teachers, grades } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new class" : "Update the class"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Class name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />

        <InputField
          label="Capacity"
          name="capacity"
          defaultValue={data?.capacity}
          register={register}
          error={errors?.capacity}
        />

        {type === "update" && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden
          />
        )}

        <div className="flex flex-col gap-2 w-full md:w-1/4">
  <label className="text-xs text-gray-500">Supervisor</label>
<select
  {...register("supervisorId", {
    setValueAs: (v) => (v === "" ? null : v),
  })}
  value={watch("supervisorId") ?? ""}
>
  <option value=""> - Select - </option>
  {teachers.map((teacher) => (
    <option value={teacher.id} key={teacher.id}>
      {teacher.name} {teacher.surname}
    </option>
  ))}
</select>


  {errors.supervisorId?.message && (
    <p className="text-xs text-red-400">
      {errors.supervisorId.message.toString()}
    </p>
  )}
</div>


        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Grade</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("gradeId", { valueAsNumber: true })}
            defaultValue={data?.gradeId || ""}
          >
            {grades.map((grade) => (
              <option value={grade.id} key={grade.id}>
                {grade.level}
              </option>
            ))}
          </select>

          {errors.gradeId?.message && (
            <p className="text-xs text-red-400">
              {errors.gradeId.message.toString()}
            </p>
          )}
        </div>
      </div>

      {error && (
        <span className="text-red-500">Something went wrong!</span>
      )}

      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ClassForm;
