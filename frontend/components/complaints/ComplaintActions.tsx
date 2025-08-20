"use client";

import React from "react";
import { Complaint } from "./type";
import { EyeIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/solid";

interface Props {
  complaint: Complaint;
  userRole?: string;
  onView: (c: Complaint) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Complaint["status"]) => void;
}

export const ComplaintActions: React.FC<Props> = ({
  complaint,
  userRole,
  onView,
  onDelete,
  onStatusChange,
}) => {
  return (
    <div className="flex gap-2 mt-4 justify-end">
      <button
        onClick={() => onView(complaint)}
        className="p-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
        title="View Complaint"
      >
        <EyeIcon className="w-5 h-5" />
      </button>

      {userRole === "admin" && (
        <>
          <select
            value={complaint.status}
            onChange={(e) => onStatusChange(complaint._id, e.target.value as Complaint["status"])}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          <button
            onClick={() => onDelete(complaint._id)}
            className="p-2 rounded bg-red-500 hover:bg-red-600 text-white"
            title="Delete Complaint"
          >
            <TrashIcon className="w-5 h-5" />
          </button>

          <button
            onClick={() => onView(complaint)}
            className="p-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white"
            title="Edit Complaint"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );
};
