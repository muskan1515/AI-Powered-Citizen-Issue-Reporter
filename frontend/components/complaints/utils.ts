import { Complaint } from "./type";

export const urgencyColor = (urgency?: string) => {
  switch (urgency) {
    case "High":
      return "bg-red-500 text-white";
    case "Medium":
      return "bg-yellow-400 text-black";
    case "Low":
      return "bg-green-500 text-white";
    default:
      return "bg-gray-300 text-black";
  }
};

export const statusColor = (status: Complaint["status"]) => {
  switch (status) {
    case "open":
      return "bg-blue-500 text-white";
    case "in_progress":
      return "bg-yellow-400 text-black";
    case "resolved":
      return "bg-green-500 text-white";
    default:
      return "bg-gray-300 text-black";
  }
};
