// src/app/api/upload/excel/route.ts
import { NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Log from "@/models/Log";
import * as xlsx from "xlsx";
import { generateAndStoreSnapshot } from "@/lib/snapshotService";
import { apiHandler } from "@/lib/apiHandler";
import { ApiError } from "@/lib/apiError";

export const POST = apiHandler(async (req: Request) => {
  // 1. Authenticate Request
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new ApiError(401, "Unauthorized");
  }
  const userEmail = session.user.email;

  // 2. Extract the file and domain from standard Form Data
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const domain = formData.get("domain") as string; // "health", "finance", or "career"

  if (!file || !domain) {
    throw new ApiError(400, "Missing file or domain");
  }

  if (!["health", "finance", "career"].includes(domain)) {
    throw new ApiError(400, "Invalid domain");
  }

  // 3. Read the uploaded file stream into an ArrayBuffer and Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 4. Parse workbook worksheets via SheetJS
  const workbook = xlsx.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new ApiError(400, "Excel sheet appears empty or invalid");
  }
  
  const worksheet = workbook.Sheets[sheetName];
  const rawRows = xlsx.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: "" });

  if (rawRows.length === 0) {
    throw new ApiError(400, "Excel worksheet is empty");
  }

  // 5. Query user to seed logs
  await connectDB();
  const user = await User.findOne({ email: userEmail });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 6. Define numeric parsing variables and mappings
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

  // 7. Parse and accumulate each spreadsheet row
  for (const row of rawRows) {
    const record: Record<string, any> = {};
    
    for (const [key, rawVal] of Object.entries(row)) {
      // Strip spaces, dashes, and underscores in headers for extreme matching tolerance
      const normalizedKey = key.replace(/[\s_-]+/g, "").toLowerCase().trim();
      const standardHeader = camelCaseMap[normalizedKey] || key.trim();
      const val = String(rawVal).trim();

      if (numericFields.includes(normalizedKey)) {
        const num = Number(val);
        record[standardHeader] = !isNaN(num) && val !== "" ? num : undefined;
      } else {
        // Enforce Formula Injection sanitization for Excel spreadsheets
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
