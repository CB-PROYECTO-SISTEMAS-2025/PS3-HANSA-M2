import React from "react";

interface NotificationProps {
  message: string;
  type: "success" | "error";
}

const Notification: React.FC<NotificationProps> = ({ message, type }) => {
  if (!message) return null;

  return (
    <div
      className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-md text-white text-sm transition duration-300 ${
        type === "error" ? "bg-red-600" : "bg-green-600"
      }`}
    >
      {message}
    </div>
  );
};

export default Notification;