import { NextApiRequest, NextApiResponse } from "next";

// Mock doctor data (replace with actual database)
const doctors: Record<string, any> = {
  "1": { id: "1", name: "Dr. John Smith", role: "doctor", isActive: true },
  "2": { id: "2", name: "Dr. Jane Doe", role: "doctor", isActive: true },
  "3": { id: "3", name: "Dr. Mike Johnson", role: "doctor", isActive: false },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { doctorId, isActive } = req.body;

  console.log("Received request to update status:", { doctorId, isActive });

  if (!doctorId || typeof isActive !== "boolean") {
    return res.status(400).json({ error: "Doctor ID and isActive status are required" });
  }

  // Update the doctor's status (in a real app, update the database)
  if (doctors[doctorId]) {
    doctors[doctorId].isActive = isActive;
    return res.status(200).json({ message: "Status updated" });
  } else {
    return res.status(404).json({ error: "Doctor not found" });
  }
}
