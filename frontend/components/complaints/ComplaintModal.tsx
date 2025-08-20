"use client";

import React from "react";
import { Dialog } from "@headlessui/react";
import { Complaint } from "./type";
import { urgencyColor } from "./utils";

interface Props {
  complaint: Complaint | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ComplaintModal: React.FC<Props> = ({ complaint, isOpen, onClose }) => {
  if (!complaint) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded shadow-lg max-w-lg w-full p-6 space-y-4">
          <Dialog.Title className="text-xl font-bold">Complaint Details</Dialog.Title>

          <p><span className="font-semibold">Text:</span> {complaint.text}</p>
          <p>
            <span className="font-semibold">Location:</span> {complaint.location.lat.toFixed(4)}, {complaint.location.lng.toFixed(4)}
          </p>
          <p><span className="font-semibold">Status:</span> {complaint.status}</p>
          <p><span className="font-semibold">Created At:</span> {new Date(complaint.createdAt).toLocaleString()}</p>

          <div className="mt-2 border-t pt-2">
            <h3 className="font-semibold">AI Insights:</h3>
            <p>Sentiment: {complaint.ai?.sentiment?.label} ({complaint.ai?.sentiment?.confidence?.toFixed(2)})</p>
            <p>Issue: {complaint.ai?.issue?.label} ({complaint.ai?.issue?.confidence?.toFixed(2)})</p>
            <p>
              Urgency:{" "}
              <span className={`px-2 py-1 rounded ${urgencyColor(complaint.ai?.urgency)}`}>
                {complaint.ai?.urgency}
              </span>
            </p>
            <div className="mt-2">
              <h4 className="font-semibold">NER:</h4>
              <ul className="list-disc ml-5">
                {complaint.ai?.ner?.map((n, idx) => (
                  <li key={idx}><span className="font-semibold">{n.token}:</span> {n.tag}</li>
                ))}
              </ul>
            </div>
          </div>

          <button
            onClick={onClose}
            className="mt-4 w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
