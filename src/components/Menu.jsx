import Link from "next/link";
import {
  Home,
  UserCog,
  Users,
  User,
  BookOpen,
  School,
  NotebookPen,
  ClipboardCheck,
  ClipboardList,
  BarChart3,
  Calendar,
  Megaphone,
  UserCircle,
  Settings,
} from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import LogoutButton from "./LogoutButton";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        label: "Home",
        href: "/",
        icon: Home,
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        label: "Teachers",
        href: "/list/teachers",
        icon: UserCog,
        visible: ["admin", "teacher"],
      },
      {
        label: "Students",
        href: "/list/students",
        icon: Users,
        visible: ["admin", "teacher"],
      },
      {
        label: "Parents",
        href: "/list/parents",
        icon: User,
        visible: ["admin", "teacher"],
      },
      {
        label: "Subjects",
        href: "/list/subjects",
        icon: BookOpen,
        visible: ["admin"],
      },
      {
        label: "Classes",
        href: "/list/classes",
        icon: School,
        visible: ["admin", "teacher"],
      },
      {
        label: "Lessons",
        href: "/list/lessons",
        icon: NotebookPen,
        visible: ["admin", "teacher"],
      },
      {
        label: "Exams",
        href: "/list/exams",
        icon: ClipboardCheck,
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        label: "Assignments",
        href: "/list/assignments",
        icon: ClipboardList,
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        label: "Results",
        href: "/list/results",
        icon: BarChart3,
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        label: "Events",
        href: "/list/events",
        icon: Calendar,
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        label: "Announcements",
        href: "/list/announcements",
        icon: Megaphone,
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        label: "Logout",
        href: "/logout",
        icon: null,
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];

const Menu = async () => {
  const user = await currentUser();
  const role = user?.publicMetadata?.role;
  return (
    <div className="mt-4 text-sm">
      {menuItems.map((group) => (
        <div key={group.title} className="flex flex-col gap-2">
          <span className="hidden lg:block text-accent font-light my-4">
            {group.title}
          </span>

          {group.items.map((item) => {
            if (!item.visible.includes(role)) return null;
            if (item.label === "Logout") {
              return <LogoutButton key="logout" />;
            }
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-sky-100"
              >
                <Icon size={20} />
                <span className="hidden lg:block">{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
