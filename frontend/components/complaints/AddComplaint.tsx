"use client";

import React, { useState, useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { addComplaint } from "@/store/slices/complaintSlice";
import { showLoader, hideLoader, showMessage } from "@/store/slices/uiSlice";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";

const DefaultIcon = L.icon({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export const AddComplaint: React.FC = () => {
  const dispatch = useAppDispatch();
  const [text, setText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [address, setAddress] = useState({ lat: 0, lng: 0, formatted: "" });
  const [locationError, setLocationError] = useState(false);

  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(true);
      dispatch(
        showMessage({ type: "error", text: "Geolocation not supported" })
      );
      return;
    }

    dispatch(showLoader());
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setAddress({ lat: latitude, lng: longitude, formatted: "" });
        setLocationError(false);
        dispatch(hideLoader());
      },
      () => {
        setLocationError(true);
        dispatch(hideLoader());
        dispatch(
          showMessage({ type: "error", text: "Unable to fetch location" })
        );
      }
    );
  };

  const handleSearch = async () => {
    if (!searchQuery) return;
    dispatch(showLoader());
    try {
      const provider = new OpenStreetMapProvider();
      const results = await provider.search({ query: searchQuery });
      if (results.length > 0) {
        const { x: lng, y: lat, label } = results[0];
        setAddress({ lat, lng, formatted: label });
        setSearchQuery(label);
      } else {
        dispatch(showMessage({ type: "error", text: "Address not found" }));
      }
    } catch (err) {
      dispatch(showMessage({ type: "error", text: "Search failed" }));
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  // Helper to recenter map when address changes
  const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
    const map = useMap();
    useEffect(() => {
      if (lat && lng) {
        map.flyTo([lat, lng], 15, { animate: true, duration: 1.5 });
      }
    }, [lat, lng]);
    return null;
  };

  const DraggableMarker = () => {
    const [position, setPosition] = useState<[number, number]>([
      address.lat,
      address.lng,
    ]);

    useEffect(() => {
      if (address.lat && address.lng) {
        setPosition([address.lat, address.lng]);
      }
    }, [address]);

    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        setAddress({ lat: e.latlng.lat, lng: e.latlng.lng, formatted: "" });
      },
    });

    return (
      <Marker
        draggable
        position={position}
        eventHandlers={{
          dragend: (e) => {
            const latlng = e.target.getLatLng();
            setPosition([latlng.lat, latlng.lng]);
            setAddress({ lat: latlng.lat, lng: latlng.lng, formatted: "" });
          },
        }}
      />
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text)
      return dispatch(
        showMessage({ type: "error", text: "Complaint text is required" })
      );
    if (!address.lat || !address.lng)
      return dispatch(
        showMessage({
          type: "error",
          text: "Please select location or search address",
        })
      );

    dispatch(
      addComplaint({ text, address: { lat: address.lat, lng: address.lng } })
    );
    setText("");
    setAddress({ lat: 0, lng: 0, formatted: "" });
    setSearchQuery("");
    setLocationError(false);
    dispatch(
      showMessage({ type: "success", text: "Complaint submitted successfully" })
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded shadow-md flex flex-col gap-3 w-full max-w-md mb-4"
    >
      <h2 className="text-lg font-semibold">Add Complaint</h2>
      <textarea
        placeholder="Enter complaint..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="text"
        placeholder="Search or enter address"
        value={searchQuery || address.formatted || ""}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border p-2 rounded"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleSearch}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Search Address
        </button>
        <button
          type="button"
          onClick={fetchCurrentLocation}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Use Current Location
        </button>
      </div>
      {locationError && (
        <p className="text-sm text-red-600">Unable to fetch location</p>
      )}
      {address.lat !== 0 && address.lng !== 0 && (
        <div className="h-64 w-full mt-2">
          <MapContainer
            center={[address.lat, address.lng]}
            zoom={15}
            style={{ height: "100%", width: "100%", zIndex: 0 }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <RecenterMap lat={address.lat} lng={address.lng} />
            <DraggableMarker />
          </MapContainer>
        </div>
      )}
      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Submit
      </button>
    </form>
  );
};
