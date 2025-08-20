"use client";

import React from "react";
import { Complaint } from "./type";
import { urgencyColor, statusColor } from "./utils";
import { ComplaintActions } from "./ComplaintActions";

interface Props {
  complaint: Complaint;
  userRole?: string;
  onView: (c: Complaint) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Complaint["status"]) => void;
}

export const ComplaintCard: React.FC<Props> = ({
  complaint,
  userRole,
  onView,
  onDelete,
  onStatusChange,
}) => {
  return (
    <div className="relative border rounded shadow-md p-4 flex flex-col justify-between bg-white z-20" style={{ zIndex: 200 }}>
      {/* Status badge top-right */}
      <span
        className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold ${statusColor(
          complaint.status
        )}`}
      >
        {complaint.status.replace("_", " ").toUpperCase()}
      </span>

      <div>
        <h2 className="font-semibold text-lg mb-2">{complaint.text}</h2>
        <p className="text-sm text-gray-500 mb-1">
          Location: {complaint.location.lat.toFixed(4)}, {complaint.location.lng.toFixed(4)}
        </p>
        <p className="text-sm mb-1">
          Sentiment:{" "}
          <span
            className={
              complaint.ai?.sentiment?.label === "Positive"
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {complaint.ai?.sentiment?.label} ({complaint.ai?.sentiment?.confidence?.toFixed(2)})
          </span>
        </p>
        <p className="text-sm mb-1">
          Issue: {complaint.ai?.issue?.label} ({complaint.ai?.issue?.confidence?.toFixed(2)})
        </p>
        <p className="text-sm mb-1">
          Urgency:{" "}
          <span className={`px-2 py-1 rounded ${urgencyColor(complaint.ai?.urgency)}`}>
            {complaint.ai?.urgency}
          </span>
        </p>
        <p className="text-xs text-gray-400">
          Created: {new Date(complaint.createdAt).toLocaleString()}
        </p>
      </div>

      <ComplaintActions
        complaint={complaint}
        userRole={userRole}
        onView={onView}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
      />
    </div>
  );
};
