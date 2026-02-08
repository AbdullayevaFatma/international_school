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
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }
    ],
    apple: "/apple-touch-icon.png"
  },
  manifest: "/site.webmanifest"
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || undefined}
    >
      <html lang="en">
        <body className={`${inter.variable} antialiased`}>
          {children}
          <ToastContainer position="bottom-right"
  theme="colored"
  toastClassName={({ type }) => {
    switch (type) {
      case "success":
        return "bg-primary text-white";
      case "error":
        return "bg-secondary text-white";
      default:
        return "bg-gray-800 text-white";
    }
  }}/>
        </body>
      </html>
    </ClerkProvider>
  );
}