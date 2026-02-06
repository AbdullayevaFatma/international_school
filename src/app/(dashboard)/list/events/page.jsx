export const dynamic = "force-dynamic";

import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import { ArrowDownWideNarrow, Funnel } from "lucide-react";

const EventListPage = async ({ searchParams }) => {
  const { userId, sessionClaims } = await auth();
  const role =
    sessionClaims?.metadata?.role || sessionClaims?.publicMetadata?.role;
  const currentUserId = userId;

 

  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;
  const query = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.title = { contains: value, mode: "insensitive" };
            break;
          default:
            break;
        }
      }
    }
  }

  if (role !== "admin") {
    const roleConditions = {
      teacher: { lessons: { some: { teacherId: currentUserId } } },
      student: { students: { some: { id: currentUserId } } },
      parent: { students: { some: { parentId: currentUserId } } },
    };

    query.OR = [{ classId: null }, { class: roleConditions[role] || {} }];
  }

 

  const [data, count] = await prisma.$transaction([
    prisma.event.findMany({
      where: query,
      include: {
        class: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.event.count({ where: query }),
  ]);



  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Events</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center cursor-pointer">
              <Funnel className="text-white w-4 h-4" />
            </div>
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center cursor-pointer">
              <ArrowDownWideNarrow className="text-white w-4 h-4" />
            </div>
            {role === "admin" && <FormModal table="event" type="create" />}
          </div>
        </div>
      </div>
      <Table
        columns={[
          {
            header: "Title",
            accessor: "title",
          },
          {
            header: "Class",
            accessor: "class",
          },
          {
            header: "Date",
            accessor: "date",
            className: "hidden md:table-cell",
          },
          {
            header: "Start Time",
            accessor: "startTime",
            className: "hidden md:table-cell",
          },
          {
            header: "End Time",
            accessor: "endTime",
            className: "hidden md:table-cell",
          },
          ...(role === "admin"
            ? [
                {
                  header: "Actions",
                  accessor: "action",
                },
              ]
            : []),
        ]}
        renderRow={(item) => (
          <tr
            key={item.id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-sky-100"
          >
            <td className="flex items-center gap-4 p-4">{item.title}</td>
            <td>{item.class?.name || "-"}</td>
            <td className="hidden md:table-cell">
              {new Intl.DateTimeFormat("en-US").format(item.startTime)}
            </td>
            <td className="hidden md:table-cell">
              {item.startTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </td>
            <td className="hidden md:table-cell">
              {item.endTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </td>
            <td>
              <div className="flex items-center gap-2">
                {role === "admin" && (
                  <>
                    <FormModal table="event" type="update" data={item} />
                    <FormModal table="event" type="delete" id={item.id} />
                  </>
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

export default EventListPage;
