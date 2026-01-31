"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { studentSchema } from "@/lib/formValidationSchemas";
import { CldUploadWidget } from "next-cloudinary";
import { CloudUpload } from "lucide-react";
import { useFormState, useEffect, useState } from "react";
import { createStudent, updateStudent } from "@/lib/actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const StudentForm = ({ type, data, setOpen, relatedData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(studentSchema),
  });
  const [img, setImg] = useState(null);
  const [state, setState] = useState({
    success: false,
    error: false,
    message: "",
  });


 

  const router = useRouter();
   const onSubmit = handleSubmit(async (formData) => {
    try {
      if (type === "update" && !formData.id) {
        formData.id = data.id;
      }

      const res =
        type === "create"
          ? await createStudent({ ...formData, img: img?.secure_url })
          : await updateStudent({ ...formData, img: img?.secure_url });

      if (res.success) {
        setState({ success: true, error: false, message: "" });
        toast.success(
          `Student has been ${type === "create" ? "created" : "updated"}!`
        );
        setOpen(false);
        router.refresh();
      } else {
        setState({ success: false, error: true, message: res.message || "" });
        toast.error(res.message || "Something went wrong!");
      }
    } catch (err) {
      setState({ success: false, error: true, message: err.message });
      toast.error(err.message || "Something went wrong!");
    }
  });

 useEffect(() => {
    if (state.success) {
      setOpen(false);
      router.refresh();
    }
  }, [state, router, setOpen]);
  
  const { grades, classes } = relatedData;
  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {" "}
        {type === "create" ? "Create a new student" : "Update the student"}
      </h1>

      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>

     
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Username"
          name="username"
          defaultValue={data?.username}
          register={register}
          error={errors?.username}
        />
        <InputField
          label="Email"
          name="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          defaultValue={data?.password}
          register={register}
          error={errors?.password}
        />
  </div>
 <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>
        <CldUploadWidget
          uploadPreset="<international_school>"
          onSuccess={(result, { widget }) => {
            setImage(result.info);
            widget.close();
          }}
        >
          {({ open }) => {
            return (
              <div
                className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
                onClick={() => open()}
              >
                <CloudUpload />
                <span>Upload a photo</span>
              </div>
            );
          }}
        </CldUploadWidget>

 <div className="flex justify-between flex-wrap gap-4">
       <InputField
          label="First Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors.name}
        />
        <InputField
          label="Last Name"
          name="surname"
          defaultValue={data?.surname}
          register={register}
          error={errors.surname}
        />
        <InputField
          label="Phone"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors.phone}
        />
        <InputField
          label="Address"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors.address}
        />
        <InputField
          label="Blood Type"
          name="bloodType"
          defaultValue={data?.bloodType}
          register={register}
          error={errors.bloodType}
        />
        <InputField
          label="Birthday"
          name="birthday"
          type="date"
          defaultValue={
            data?.birthday
              ? data.birthday.toISOString().split("T")[0]
              : ""
          }
          register={register}
          error={errors.birthday}
        />
        <InputField
          label="Parent Id"
          name="parentId"
          defaultValue={data?.parentId}
          register={register}
          error={errors.parentId}
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

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Sex</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("sex")}
            defaultValue={data?.sex}
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          {errors.sex?.message && (
            <p className="text-xs text-red-400">
              {errors.sex.message.toString()}
            </p>
          )}
      
      </div>
     

      <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Grade</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("gradeId")}
            defaultValue={data?.gradeId}
          >
            {grades.map((grade) => (
              <option value={grade.id} key={grade.id}>
                {grade.level}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("classId")}
            defaultValue={data?.classId}
          >
            {classes.map((classItem) => (
              <option value={classItem.id} key={classItem.id}>
                {classItem.name} -{" "}
                {classItem._count.students}/{classItem.capacity} Capacity
              </option>
            ))}
          </select>
        </div>
      </div>

      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}

      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
    
  );
};

export default StudentForm;
