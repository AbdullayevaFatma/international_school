"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastProvider() {
  return (
    <ToastContainer
      position="bottom-right"
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
      }}
    />
  );
}