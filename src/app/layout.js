import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "International School",
  description: "A role-based school management platform designed for International school. The system provides separate dashboards and secure access for administrators, teachers, parents, and students, enabling efficient management of academic data, schedules, exams, assignments.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
        <ToastContainer position="bottom-right" theme="dark"/>
      </body>
    </html>
    </ClerkProvider>
  );
}
