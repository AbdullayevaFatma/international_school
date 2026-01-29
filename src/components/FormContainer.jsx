import prisma from "@/lib/prisma";
import FormModal from "./FormModal";
import { auth } from "@clerk/nextjs/server";

const FormContainer = async ({ table, type, data, id }) => {
  let relatedData = {};

  const { userId, sessionClaims } = await auth();
  const role = sessionClaims?.metadata?.role;

  const currentUserId = userId;

  if (type !== "delete") {
    switch (table) {
      case "subject": {
        const subjectTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { teachers: subjectTeachers };
        break;
      }

      case "class": {
        const classGrades = await prisma.grade.findMany({
          select: { id: true, level: true },
        });
        const classTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { teachers: classTeachers, grades: classGrades };
        break;
      }

      case "teacher": {
        const teacherSubjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        });
        relatedData = { subjects: teacherSubjects };
        break;
      }

      case "student": {
        const [studentGrades, studentClasses] = await Promise.all([
          prisma.grade.findMany({
            select: { id: true, level: true },
          }),
          prisma.class.findMany({
            include: { _count: { select: { students: true } } },
          }),
        ]);
        relatedData = { classes: studentClasses, grades: studentGrades };
        break;
      }

      case "exam": {
        const examLessons = await prisma.lesson.findMany({
          where: role === "teacher" ? { teacherId: currentUserId } : {},
          select: { id: true, name: true },
        });
        relatedData = { lessons: examLessons };
        break;
      }

      default:
        break;
    }
  }

  return (
    <div>
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
    </div>
  );
};

export default FormContainer;
