import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import { ArrowDownWideNarrow, Funnel } from "lucide-react";

const ClassListPage = async ({ searchParams }) => {
  const { sessionClaims } = await auth();
  const role =
    sessionClaims?.metadata?.role || sessionClaims?.publicMetadata?.role;

 

  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;
  const query = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "supervisorId":
            query.supervisorId = value;
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
    prisma.class.findMany({
      where: query,
      include: {
        supervisor: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.class.count({ where: query }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Classes</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center cursor-pointer">
              <Funnel className="text-white w-4 h-4" />
            </div>
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center cursor-pointer">
              <ArrowDownWideNarrow className="text-white w-4 h-4" />
            </div>
            {role === "admin" && <FormContainer table="class" type="create" />}
          </div>
        </div>
      </div>
      <Table
        columns={[
          {
            header: "Class Name",
            accessor: "name",
          },
          {
            header: "Capacity",
            accessor: "capacity",
            className: "hidden md:table-cell",
          },
          {
            header: "Grade",
            accessor: "grade",
            className: "hidden md:table-cell",
          },
          {
            header: "Supervisor",
            accessor: "supervisor",
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
            <td className="flex items-center gap-4 p-4">{item.name}</td>
            <td className="hidden md:table-cell">{item.capacity}</td>
            <td className="hidden md:table-cell">{item.name[0]}</td>
            <td className="hidden md:table-cell">
              {item.supervisor ? `${item.supervisor.name} ${item.supervisor.surname}` : "—"}
            </td>
            <td>
              <div className="flex items-center gap-2">
                {role === "admin" && (
                  <>
                    <FormContainer table="class" type="update" data={item} />
                    <FormContainer table="class" type="delete" id={item.id} />
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

export default ClassListPage;
