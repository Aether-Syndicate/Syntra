//src/app/api/upload/csv/route.ts
import { NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Log from "@/models/Log";
import { generateAndStoreSnapshot } from "@/lib/snapshotService";
import { apiHandler } from "@/lib/apiHandler";
import { ApiError } from "@/lib/apiError";

// A robust, RFC-4180 compliant CSV parser
const parseCSV = (csvText: string): string[][] => {
  const result: string[][] = [];
  let row: string[] = [];
  let value = "";
  let insideQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (insideQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          value += '"';
          i++; // Skip next quote
        } else {
          insideQuotes = false;
        }
      } else {
        value += char;
      }
    } else {
      if (char === '"') {
        insideQuotes = true;
      } else if (char === ',') {
        row.push(value.trim());
        value = "";
      } else if (char === '\r' || char === '\n') {
        row.push(value.trim());
        value = "";
        if (row.length > 0 && row.some(cell => cell !== "")) {
          result.push(row);
        }
        row = [];
        if (char === '\r' && nextChar === '\n') {
          i++; // Skip \n
        }
      } else {
        value += char;
      }
    }
  }

  if (value || row.length > 0) {
    row.push(value.trim());
    if (row.some(cell => cell !== "")) {
      result.push(row);
    }
  }

  return result;
};

export const POST = apiHandler(async (req: Request) => {
  // 1. Authenticate Request
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new ApiError(401, "Unauthorized");
  }
  const userEmail = session.user.email;

  // 2. Extract the file and domain from the form data
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const domain = formData.get("domain") as string; // "health", "finance", or "career"

  if (!file || !domain) {
    throw new ApiError(400, "Missing file or domain");
  }

  // 3. Convert the uploaded file buffer to readable text
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const csvText = buffer.toString("utf-8");

  // 4. Parse the CSV into structured JSON
  const parsedRows = parseCSV(csvText);

  if (parsedRows.length < 2) {
    throw new ApiError(400, "CSV appears empty or invalid");
  }

  const headers = parsedRows[0].map(h => h.toLowerCase().trim());

  await connectDB();
  const user = await User.findOne({ email: userEmail });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const numericFields = [
    "sleephours", "workoutminutes", "stresslevel", "moodscore", "energylevel",
    "caloriesconsumed", "caloriegoal", "amountsaved", "discretionaryspent",
    "spendingtime", "hoursstudied", "productivityrating", "sessionscompleted"
  ];
  
  const camelCaseMap: Record<string, string> = {
    sleephours: "sleepHours",
    workoutminutes: "workoutMinutes",
    stresslevel: "stressLevel",
    moodscore: "moodScore",
    energylevel: "energyLevel",
    caloriesconsumed: "caloriesConsumed",
    caloriegoal: "calorieGoal",
    amountsaved: "amountSaved",
    discretionaryspent: "discretionarySpent",
    spendingtime: "spendingTime",
    hoursstudied: "hoursStudied",
    productivityrating: "productivityRating",
    sessionscompleted: "sessionsCompleted",
    spendingcategory: "spendingCategory",
    coursename: "courseName",
    date: "date"
  };

  const parsedLogs = [];

  for (let i = 1; i < parsedRows.length; i++) {
    const row = parsedRows[i];
    const record: Record<string, any> = {};
    
    for (let j = 0; j < headers.length; j++) {
      const header = headers[j];
      if (!header) continue;
      const val = row[j] || "";
      
      const standardHeader = camelCaseMap[header] || header;

      if (numericFields.includes(header)) {
        const num = Number(val);
        record[standardHeader] = !isNaN(num) && val !== "" ? num : undefined;
      } else {
        // Enforce Formula Injection sanitization for CSV spreadsheets
        record[standardHeader] = typeof val === "string" && /^[=\+\-\@]/.test(val) ? `'${val}` : val;
      }
    }
    
    const logDate = record.date ? new Date(record.date) : new Date();
    delete record.date;

    parsedLogs.push({
      userId: user._id,
      domain: domain,
      domainData: record,
      date: isNaN(logDate.getTime()) ? new Date() : logDate
    });
  }

  // 1. Bulk insert the logs into MongoDB
  await Log.insertMany(parsedLogs);

  // 2. Fire the protected background task
  // Do NOT await this here! We want it to run in the background.
  waitUntil(
    generateAndStoreSnapshot(user._id.toString()).catch(err => {
      console.error("[CRITICAL] Background Snapshot Failed:", err);
    })
  );

  // 3. Return immediately to the user (Lightning fast UX!)
  return NextResponse.json({ 
    success: true, 
    message: `Successfully imported ${parsedLogs.length} logs. Syntra Core is analyzing the data.` 
  }, { status: 201 });
});