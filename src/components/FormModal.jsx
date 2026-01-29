"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useActionState } from "react";
import { toast } from "react-toastify";
import { Plus, Trash, Edit } from "lucide-react";

import {
  deleteSubject,
  deleteClass,
  deleteTeacher,
  deleteStudent,
  deleteExam,
  deleteParent,
  deleteLesson,
  deleteAssignment,
  deleteResult,
  deleteAttendance,
  deleteEvent,
  deleteAnnouncement,
} from "@/lib/actions";

const deleteActionMap = {
  subject: deleteSubject,
  class: deleteClass,
  teacher: deleteTeacher,
  student: deleteStudent,
  exam: deleteExam,
  parent: deleteParent,
  lesson: deleteLesson,
  assignment: deleteAssignment,
  result: deleteResult,
  attendance: deleteAttendance,
  event: deleteEvent,
  announcement: deleteAnnouncement,
};

const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const SubjectForm = dynamic(() => import("./forms/SubjectForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ExamForm = dynamic(() => import("./forms/ExamForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ClassForm = dynamic(() => import("./forms/ClassForm"), {
  loading: () => <h1>Loading...</h1>,
});

const forms = {
  teacher: (setOpen, type, data, relatedData) => (
    <TeacherForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  student: (setOpen, type, data, relatedData) => (
    <StudentForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  subject: (setOpen, type, data, relatedData) => (
    <SubjectForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  exam: (setOpen, type, data, relatedData) => (
    <ExamForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  class: (setOpen, type, data, relatedData) => (
    <ClassForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
};

const FormModal = ({ table, type, data, id, relatedData }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        router.refresh();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open, router]);

  const handleClose = () => {
    setOpen(false);
  };

  const Form = () => {
    const [state, formAction] = useActionState(deleteActionMap[table], {
      success: false,
      error: false,
    });

    useEffect(() => {
      if (state.success) {
        toast(`${table} has been deleted!`);
        setOpen(false);

        setTimeout(() => {
          router.refresh();
        }, 300);
      }
    }, [state.success]);

    return type === "delete" && id ? (
      <form action={formAction} className="p-4 flex flex-col gap-4">
        <input type="text" name="id" value={id} hidden readOnly />
        <span className="text-center font-medium">
          All data will be lost. Are you sure you want to delete this {table}?
        </span>
        <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center hover:bg-red-800">
          Delete
        </button>
      </form>
    ) : type === "create" || type === "update" ? (
      forms[table] ? (
        forms[table](handleClose, type, data, relatedData)
      ) : (
        <div className="p-4 text-center">Form not found for {table}!</div>
      )
    ) : (
      <div className="p-4 text-center">Invalid form type!</div>
    );
  };

  return (
    <>
      {type === "delete" && (
        <div
          className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center cursor-pointer"
          onClick={() => {
            setOpen(true);
          }}
        >
          <Trash className="text-white w-4 h-4" />
        </div>
      )}

      {type === "create" && (
        <div
          className="w-8 h-8 rounded-full bg-primary flex items-center justify-center cursor-pointer"
          onClick={() => {
            setOpen(true);
          }}
        >
          <Plus className="text-white w-4 h-4" />
        </div>
      )}

      {type === "update" && (
        <div
          className="w-8 h-8 rounded-full bg-accent flex items-center justify-center cursor-pointer"
          onClick={() => {
            setOpen(true);
          }}
        >
          <Edit className="text-white w-4 h-4" />
        </div>
      )}

      {open && (
        <div
          className="w-screen h-screen fixed left-0 top-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={handleClose}
        >
          <div
            className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Form />
            <button
              className="absolute top-4 right-4 cursor-pointer bg-gray-200 rounded-full p-2 hover:bg-gray-300 transition"
              onClick={handleClose}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
