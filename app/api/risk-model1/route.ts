import { NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
//import { getLicensedModels, callRiskModel } from "@/lib/riskModels";

export async function POST(req: Request) {
  await new Promise((r) => setTimeout(r, Math.random() * 300)); // fake delay
  // return some aggregate risk score based on number of rows
  const score = Math.round(Math.random() * 100);
  return NextResponse.json({
    valid: true,
    score,
  });
}
