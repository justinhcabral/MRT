"use server";

import { connectToDB } from "@/lib/mongodb";
import Station from "@/models/Station";
import { revalidatePath } from "next/cache"; //refreshes ui data

// Create a new station from FormData (server action)
export async function addStation(formData: FormData) {
  try {
    await connectToDB();

    const name = String(formData.get("name") || "").trim();
    const line = String(formData.get("line") || "").trim();
    const lat = parseFloat(String(formData.get("lat") || ""));
    const lng = parseFloat(String(formData.get("lng") || ""));

    if (!name || !line || Number.isNaN(lat) || Number.isNaN(lng)) {
      throw new Error(
        "Missing or invalid required fields: name, line, lat, lng"
      );
    }

    const qrCode = `${line}_${name
      .toUpperCase()
      .replace(/\s/g, "_")}_${Date.now()}`;

    const newStation = await Station.create({
      name,
      line,
      location: { type: "Point", coordinates: [lng, lat] }, // GeoJSON expects [lng, lat]
      qrCode,
      status: "active",
    });

    // Revalidate root (adjust path if your station list lives elsewhere)
    revalidatePath("/");

    return newStation;
  } catch (error) {
    const err = error as { code?: number; message?: string };
    // Duplicate key error
    if (err?.code === 11000) {
      throw new Error("Station with the same name or qrCode already exists.");
    }
    throw new Error(err?.message || "Failed to create station");
  }
}

// Fetch all stations
export async function getStations() {
  await connectToDB();
  const stations = await Station.find({}).sort({ createdAt: -1 });
  return stations;
}

// Fetch a single station by id
export async function getStationById(id: string) {
  await connectToDB();
  const station = await Station.findById(id);
  if (!station) throw new Error("Station not found");
  return station;
}

// Update station fields (data can include { name, line, lat, lng, status })
export async function updateStation(
  id: string,
  data: Partial<{
    name: string;
    line: string;
    lat: number;
    lng: number;
    status: string;
  }>
) {
  try {
    await connectToDB();

    const update: Partial<{
      name: string;
      line: string;
      status: string;
      location: { type: string; coordinates: number[] };
    }> = {};

    if (data.name) update.name = data.name.trim();
    if (data.line) update.line = data.line.trim();
    if (typeof data.status === "string") update.status = data.status;

    if (typeof data.lat === "number" && typeof data.lng === "number") {
      update.location = { type: "Point", coordinates: [data.lng, data.lat] };
    }

    const updated = await Station.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
    if (!updated) throw new Error("Station not found");

    revalidatePath("/");

    return updated;
  } catch (error) {
    const err = error as { code?: number; message?: string };
    if (err?.code === 11000) {
      throw new Error("Duplicate value provided");
    }
    throw new Error(err?.message || "Failed to update station");
  }
}

// Delete station by id
export async function deleteStation(id: string) {
  await connectToDB();
  const deleted = await Station.findByIdAndDelete(id);
  if (!deleted) throw new Error("Station not found");

  revalidatePath("/");

  return deleted;
}
