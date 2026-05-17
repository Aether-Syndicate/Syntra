//src/app/api/upload/csv/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Log from "@/models/Log";

// A fast, native CSV-to-JSON parser
const parseCSV = (csvText: string) => {
  const lines = csvText.split('\n').filter(line => line.trim() !== '');
  if (lines.length < 2) return []; // Needs at least a header and one data row

  const headers = lines[0].split(',').map(header => header.trim());
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(',');
    const obj: any = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentLine[j] ? currentLine[j].trim() : "";
    }
    result.push(obj);
  }
  return result;
};

export async function POST(req: Request) {
  try {
    // 1. Authenticate Request
    const session = await getServerSession(authOptions);
    // Temporary Hackathon Bypass:
    const userEmail = session?.user?.email || "test@syntra.com";

    // 2. Extract the file and domain from the form data
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const domain = formData.get("domain") as string; // "health", "finance", or "career"

    if (!file || !domain) {
      return NextResponse.json({ error: "Missing file or domain" }, { status: 400 });
    }

    // 3. Convert the uploaded file buffer to readable text
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const csvText = buffer.toString("utf-8");

    // 4. Parse the CSV into structured JSON
    const parsedData = parseCSV(csvText);

    if (parsedData.length === 0) {
      return NextResponse.json({ error: "CSV appears empty or invalid" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email: userEmail });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    await Log.create({
      userId: user._id,
      domain: domain,
      domainData: {
        source: `CSV Upload: ${file.name}`,
        records: parsedData,
        uploadedAt: new Date(),
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: `Parsed and saved ${parsedData.length} records.` 
    }, { status: 200 });

  } catch (error: any) {
    console.error("CSV UPLOAD ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}