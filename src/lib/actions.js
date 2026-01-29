"use server";


import { revalidatePath } from "next/cache";
import prisma from "./prisma";
import { clerkClient } from "@clerk/nextjs/server";



export const createSubject = async (currentState, data) => {
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
        teachers: {
          connect: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateSubject = async (currentState, data) => {
  try {
    await prisma.subject.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        teachers: {
          set: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteSubject = async (currentState, data) => {
  const id = data.get("id");

  try {
    await prisma.subject.delete({
      where: {
        id: parseInt(id),
      },
    });

    revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};



export const createClass = async (currentState, data) => {
  try {
    await prisma.class.create({
      data,
    });

    revalidatePath("/list/classes");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateClass = async (currentState, data) => {
  try {
    await prisma.class.update({
      where: {
        id: data.id,
      },
      data,
    });

    revalidatePath("/list/classes");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteClass = async (currentState, data) => {
  const id = data.get("id");

  try {
    await prisma.class.delete({
      where: {
        id: parseInt(id),
      },
    });

    revalidatePath("/list/classes");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};



export const createTeacher = async (currentState, data) => {
  try {
    const client = await clerkClient();
    
    console.log("Creating teacher with data:", data);
    
    const user = await client.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "teacher" },
    });

    await prisma.teacher.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        subjects: {
          connect: data.subjects?.map((subjectId) => ({
            id: parseInt(subjectId),
          })),
        },
      },
    });

    revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log("Full error:", err);
    console.log("Clerk errors:", err.errors);
    
 
    let errorMessage = "Something went wrong!";
    
    if (err.errors && err.errors.length > 0) {
      const firstError = err.errors[0];
      
      if (firstError.code === 'form_password_pwned') {
        errorMessage = "This password has been found in a data breach. Please use a stronger password.";
      } else if (firstError.code === 'form_identifier_exists') {
        errorMessage = "This username or email already exists.";
      } else if (firstError.code === 'form_param_format_invalid') {
        errorMessage = `Invalid ${firstError.meta?.paramName}: ${firstError.message}`;
      } else {
        errorMessage = firstError.message || errorMessage;
      }
    }
    
    return { 
      success: false, 
      error: true,
      message: errorMessage 
    };
  }
};

export const updateTeacher = async (currentState, data) => {
  if (!data.id) {
    return { success: false, error: true };
  }

  try {
     const client = await clerkClient();
     client.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.teacher.update({
      where: {
        id: data.id,
      },
      data: {
       ...(data.password !== "" && { password: data.password }),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        subjects: {
          set: data.subjects?.map((subjectId) => ({
            id: parseInt(subjectId),
          })),
        },
      },
    });

    revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteTeacher = async (currentState, data) => {
  const id = data.get("id");

  try {
    const client = await clerkClient();
    await client.users.deleteUser(id);

    await prisma.teacher.delete({
      where: {
        id,
      },
    });

    revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};



export const createStudent = async (currentState, data) => {
  try {
    const classItem = await prisma.class.findUnique({
      where: { id: data.classId },
      include: { _count: { select: { students: true } } },
    });

    if (classItem && classItem.capacity === classItem._count.students) {
      return { success: false, error: true };
    }
     const client = await clerkClient();

    const user = await client.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "student" },
    });

    await prisma.student.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: data.parentId,
      },
    });

    revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateStudent = async (currentState, data) => {
  if (!data.id) {
    return { success: false, error: true };
  }

  try {
      const client = await clerkClient();
    await client.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.student.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== "" && {password:data.password}),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: data.parentId,
      },
    });

    revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteStudent = async (currentState, data) => {
  const id = data.get("id");

  try {
      const client = await clerkClient();
    await client.users.deleteUser(id);

    await prisma.student.delete({
      where: {
        id,
      },
    });

    revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};



export const createExam = async (currentState, data) => {
  try {
    await prisma.exam.create({
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      },
    });

    revalidatePath("/list/exams");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateExam = async (currentState, data) => {
  try {
    await prisma.exam.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      },
    });

    revalidatePath("/list/exams");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteExam = async (currentState, data) => {
  const id = data.get("id");

  try {
    await prisma.exam.delete({
      where: {
        id: parseInt(id),
      },
    });

    revalidatePath("/list/exams");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};



export const deleteParent = async (currentState, data) => {
  const id = data.get("id");

  try {
    await prisma.parent.delete({
      where: {
        id,
      },
    });

    revalidatePath("/list/parents");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};



export const deleteLesson = async (currentState, data) => {
  const id = data.get("id");

  try {
    await prisma.lesson.delete({
      where: {
        id: parseInt(id),
      },
    });

    revalidatePath("/list/lessons");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};



export const deleteAssignment = async (currentState, data) => {
  const id = data.get("id");

  try {
    await prisma.assignment.delete({
      where: {
        id: parseInt(id),
      },
    });

    revalidatePath("/list/assignments");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};



export const deleteResult = async (currentState, data) => {
  const id = data.get("id");

  try {
    await prisma.result.delete({
      where: {
        id: parseInt(id),
      },
    });

    revalidatePath("/list/results");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};



export const deleteAttendance = async (currentState, data) => {
  const id = data.get("id");

  try {
    await prisma.attendance.delete({
      where: {
        id: parseInt(id),
      },
    });

    revalidatePath("/list/attendances");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};



export const deleteEvent = async (currentState, data) => {
  const id = data.get("id");

  try {
    await prisma.event.delete({
      where: {
        id: parseInt(id),
      },
    });

    revalidatePath("/admin");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};



export const deleteAnnouncement = async (currentState, data) => {
  const id = data.get("id");

  try {
    await prisma.announcement.delete({
      where: {
        id: parseInt(id),
      },
    });

    revalidatePath("/list/announcements");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};