import { NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
//import { getLicensedModels, callRiskModel } from "@/lib/riskModels";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const clientId = formData.get("clientId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Parse CSV
    const text = await file.text();
    let data: any[];

    try {
      data = parse(text, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });
    } catch (err) {
      return NextResponse.json({ valid: false, errors: ["CSV parse error"] });
    }

    // Validate rows
    const validationErrors: any[] = [];
    for (const [i, row] of data.entries()) {
      const errs = validateRow(row);
      if (errs.length) validationErrors.push({ row: i + 1, errors: errs });
    }
    if (validationErrors.length) {
      console.error(validationErrors);
      return NextResponse.json({
        valid: false,
        errors: validationErrors,
      });
    }

    // Fetch licensed risk models for the client
    const licensedModels = await getLicensedModels(clientId);

    // Call each risk model service (mocked for MVP)
    const riskScores = await Promise.all(
      licensedModels.map((model) => callRiskModel(model, data))
    );

    // Take the highest score
    const riskScore = Math.max(...riskScores);

    return NextResponse.json({
      valid: true,
      models: licensedModels,
      riskScore,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

function validateRow(row: any): string[] {
  const errors: string[] = [];

  if (!row.FirstName || row.FirstName.trim() === "")
    errors.push("FirstName required");
  if (!row.LastName || row.LastName.trim() === "")
    errors.push("LastName required");

  if (!/^\d{4}-\d{2}-\d{2}$/.test(row.DOB)) {
    errors.push("DOB must be YYYY-MM-DD format");
  } else {
    const dob = new Date(row.DOB);
    if (isNaN(dob.getTime()) || dob >= new Date()) {
      errors.push("DOB must be a valid past date");
    }
  }

  if (!/^\d{5}(-\d{4})?$/.test(row.ZipCode))
    errors.push("Invalid ZipCode format");
  if (!["M", "F"].includes(row.Gender))
    errors.push("Gender must be 'M' or 'F'");

  return errors;
}

async function callRiskModel(model: string, data: any[]): Promise<number> {
  //todo: replace with an enviroment variable
  const baseUrl =
    process.env.RISK_MODEL_BASE_URL ||
    "https://mock-underwriting-intake.vercel.app/api";
  const url = `${baseUrl}/${encodeURIComponent(model)}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }),
    });

    if (!res.ok) {
      throw new Error(`Model endpoint returned ${res.status}`);
    }

    const json = await res.json();
    // Expect the model service to return { score: number }
    if (typeof json.score === "number") return json.score;
    throw new Error("Invalid response from model service");
  } catch (err) {
    console.error(`callRiskModel failed for ${model}:`, err);
    return 0;
  }
}

async function getLicensedModels(clientId: string) {
  const baseUrl =
    process.env.RISK_MODEL_BASE_URL ||
    "https://mock-underwriting-intake.vercel.app/api";
  const url = `${baseUrl}/license-service`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId }),
    });

    if (!res.ok) throw new Error(`License service returned ${res.status}`);
    const json = await res.json();
    if (Array.isArray(json.models)) return json.models as string[];
    throw new Error("Invalid response from license service");
  } catch (err) {
    console.error("getLicensedModels failed", err);

    return [];
  }
}
