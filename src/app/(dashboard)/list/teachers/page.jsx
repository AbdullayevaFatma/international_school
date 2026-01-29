import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import { ArrowDownWideNarrow, Eye, Funnel } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const TeacherListPage = async ({ searchParams }) => {
  const { sessionClaims } = await auth();
  const role = sessionClaims?.metadata?.role || sessionClaims?.publicMetadata?.role;
  


  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const query = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "classId":
            query.lessons = {
              some: {
                classId: parseInt(value),
              },
            };
            break;
          case "search":
            query.name = { contains: value, mode: "insensitive" };
            break;
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.teacher.findMany({
      where: query,
      include: {
        subjects: true,
        classes: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.teacher.count({ where: query })
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Teachers</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center cursor-pointer">
              <Funnel className="text-white w-4 h-4" />
            </div>
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center cursor-pointer">
              <ArrowDownWideNarrow className="text-white w-4 h-4" />
            </div>
            {role === "admin" && (
              <FormContainer table="teacher" type="create" />
            )}
          </div>
        </div>
      </div>
      <Table 
        columns={[
          {
            header: "Info",
            accessor: "info",
          },
          {
            header: "Teacher ID",
            accessor: "teacherId",
            className: "hidden md:table-cell",
          },
          {
            header: "Subjects",
            accessor: "subjects",
            className: "hidden md:table-cell",
          },
          {
            header: "Classes",
            accessor: "classes",
            className: "hidden md:table-cell",
          },
          {
            header: "Phone",
            accessor: "phone",
            className: "hidden lg:table-cell",
          },
          {
            header: "Address",
            accessor: "address",
            className: "hidden lg:table-cell",
          },
          ...(role === "admin" ? [{
            header: "Actions",
            accessor: "action",
          }] : []),
        ]}
        renderRow={(item) => (
          <tr
            key={item.id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-sky-100"
          >
            <td className="flex items-center gap-4 p-4">
              <Image
                src={item.img || "/avatar.png"}
                alt=""
                width={40}
                height={40}
                className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-xs text-gray-500">{item?.email}</p>
              </div>
            </td>
            <td className="hidden md:table-cell">{item.username}</td>
            <td className="hidden md:table-cell">
              {item.subjects.map((subject) => subject.name).join(",")}
            </td>
            <td className="hidden md:table-cell">
              {item.classes.map((classItem) => classItem.name).join(",")}
            </td>
            <td className="hidden md:table-cell">{item.phone}</td>
            <td className="hidden md:table-cell">{item.address}</td>
            <td>
              <div className="flex items-center gap-2">
                <Link href={`/list/teachers/${item.id}`}>
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center cursor-pointer">
                    <Eye className="text-white w-4 h-4" />
                  </div>
                </Link>
                {role === "admin" && (
                  <FormContainer table="teacher" type="delete" id={item.id} />
                )}
              </div>
            </td>
          </tr>
        )}
        data={data}
      />
      <Pagination page={p} count={count} />
    </div>
  );
};

export default TeacherListPage;