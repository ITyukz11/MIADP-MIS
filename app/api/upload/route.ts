import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parse } from "csv-parse/sync";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Read CSV content
    const text = await file.text();
    const records = parse(text, { columns: true, skip_empty_lines: true });

    // Convert string booleans to actual boolean values and add timestamps
    const formattedRecords = records.map((row: any) => ({
      region: row.Region,
      lgu: row.LGU,
      ancestralDomain: row.AncestralDomain,
      commodities: row.Commodities,
      infraEntrep: row.InfraEntrep,
      subproject: row.Subproject,
      typeOfSP: row.TypeOfSP,
      location: row.Location,
      validated: row.Validated.toLowerCase() === "true",
      conceptNote: row.ConceptNote.toLowerCase() === "true",
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    // Insert data into the database
    await prisma.table8Tracker.createMany({
      data: formattedRecords,
      skipDuplicates: true,
    });

    return NextResponse.json({ message: "CSV Data Uploaded Successfully!" });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
