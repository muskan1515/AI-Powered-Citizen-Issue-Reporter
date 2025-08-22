"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchComplaints,
  updateComplaint,
  removeComplaint,
} from "@/store/slices/complaintSlice";
import { Complaint } from "./type";
import { showLoader, hideLoader, showMessage } from "@/store/slices/uiSlice";
import { EyeIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import { Dialog } from "@headlessui/react";
import { AddComplaint } from "./AddComplaint";

export default function ComplaintsDashboard() {
  const dispatch = useAppDispatch();
  const { complaints, loading, error } = useAppSelector((s) => s.complaint);
  const user = useAppSelector((s) => s.auth.user);

  const [viewComplaint, setViewComplaint] = useState<Complaint | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchComplaints());
  }, [dispatch]);

  useEffect(() => {
    if (loading) dispatch(showLoader());
    else dispatch(hideLoader());
  }, [loading, dispatch]);

  useEffect(() => {
    if (error) dispatch(showMessage({ type: "error", text: error }));
  }, [error, dispatch]);

  const handleView = (complaint: Complaint) => {
    setViewComplaint(complaint);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this complaint?")) return;

    try {
      dispatch(showLoader());
      await dispatch(removeComplaint(id)).unwrap();
      dispatch(hideLoader());
      dispatch(
        showMessage({ type: "success", text: "Complaint deleted successfully" })
      );
    } catch (err: any) {
      dispatch(hideLoader());
      dispatch(
        showMessage({
          type: "error",
          text: err?.message || "Failed to delete complaint",
        })
      );
    }
  };

  const handleStatusChange = async (
    id: string,
    status: Complaint["status"]
  ) => {
    try {
      dispatch(showLoader());
      await dispatch(updateComplaint({ id, status })).unwrap();
      dispatch(hideLoader());
      dispatch(
        showMessage({ type: "success", text: "Status updated successfully" })
      );
    } catch (err: any) {
      dispatch(hideLoader());
      dispatch(
        showMessage({
          type: "error",
          text: err?.message || "Failed to update status",
        })
      );
    }
  };

  const urgencyColor = (urgency?: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-500 text-white";
      case "medium":
        return "bg-yellow-400 text-black";
      case "low":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-300 text-black";
    }
  };

  const statusColor = (status: Complaint["status"]) => {
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

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Complaints Dashboard</h1>

      {/* Add Complaint Form */}
      <AddComplaint />

      {/* Complaint Cards */}
      {complaints.length === 0 && <p>No complaints available.</p>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {complaints.map((c: Complaint) => (
          <div
            key={c._id}
            className="relative border rounded shadow-md p-4 flex flex-col justify-between bg-white"
          >
            {/* Status badge top-right */}
            <span
              className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold ${statusColor(
                c.status
              )}`}
            >
              {c.status.replace("_", " ").toUpperCase()}
            </span>

            <div>
              <h2 className="font-semibold text-lg mb-2">{c.text}</h2>
              <p className="text-sm text-gray-500 mb-1">
                Location: {c.location.lat.toFixed(4)},{" "}
                {c.location.lng.toFixed(4)}
              </p>
              <p className="text-sm mb-1">
                Sentiment:{" "}
                <span
                  className={
                    c.ai?.sentiment?.label === "Positive"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {c.ai?.sentiment?.label} (
                  {c.ai?.sentiment?.confidence?.toFixed(2)})
                </span>
              </p>
              <p className="text-sm mb-1">
                Issue: {c.ai?.issue?.label} (
                {c.ai?.issue?.confidence?.toFixed(2)})
              </p>
              <p className="text-sm mb-1">
                Urgency:{" "}
                <span
                  className={`px-2 py-1 rounded ${urgencyColor(
                    String(c.ai?.urgency).toLowerCase()
                  )}`}
                >
                  {c.ai?.urgency}
                </span>
              </p>
              <p className="text-xs text-gray-400">
                Created: {new Date(c.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4 justify-end">
              <button
                onClick={() => handleView(c)}
                className="p-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
                title="View Complaint"
              >
                <EyeIcon className="w-5 h-5" />
              </button>

              {user?.role === "admin" && (
                <>
                  <select
                    value={c.status}
                    onChange={(e) =>
                      handleStatusChange(
                        c._id,
                        e.target.value as Complaint["status"]
                      )
                    }
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>

                  <button
                    onClick={() => handleDelete(c._id)}
                    className="p-2 rounded bg-red-500 hover:bg-red-600 text-white"
                    title="Delete Complaint"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => handleView(c)}
                    className="p-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white"
                    title="Edit Complaint"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Viewing Complaint */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded shadow-lg max-w-lg w-full p-6 space-y-4">
            <Dialog.Title className="text-xl font-bold">
              Complaint Details
            </Dialog.Title>
            {viewComplaint && (
              <>
                <p>
                  <span className="font-semibold">Text:</span>{" "}
                  {viewComplaint.text}
                </p>
                <p>
                  <span className="font-semibold">Location:</span>{" "}
                  {viewComplaint.location.lat.toFixed(4)},{" "}
                  {viewComplaint.location.lng.toFixed(4)}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  {viewComplaint.status}
                </p>
                <p>
                  <span className="font-semibold">Created At:</span>{" "}
                  {new Date(viewComplaint.createdAt).toLocaleString()}
                </p>

                <div className="mt-2 border-t pt-2">
                  <h3 className="font-semibold">AI Insights:</h3>
                  <p>
                    Sentiment: {viewComplaint.ai?.sentiment?.label} (
                    {viewComplaint.ai?.sentiment?.confidence?.toFixed(2)})
                  </p>
                  <p>
                    Issue: {viewComplaint.ai?.issue?.label} (
                    {viewComplaint.ai?.issue?.confidence?.toFixed(2)})
                  </p>
                  <p>
                    Urgency:{" "}
                    <span
                      className={`px-2 py-1 rounded ${urgencyColor(
                        viewComplaint.ai?.urgency
                      )}`}
                    >
                      {viewComplaint.ai?.urgency}
                    </span>
                  </p>
                  <div className="mt-2">
                    <h4 className="font-semibold">NER:</h4>
                    <ul className="list-disc ml-5">
                      {viewComplaint.ai?.ner?.map((n, idx) => (
                        <li key={idx}>
                          <span className="font-semibold">{n.token}:</span>{" "}
                          {n.tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            )}
            <button
              onClick={() => setModalOpen(false)}
              className="mt-4 w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
