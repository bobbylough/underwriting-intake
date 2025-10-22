import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // small artificial delay to simulate async work
    await new Promise((r) => setTimeout(r, Math.random() * 200));

    const body = await req.json();
    const clientId =
      typeof body === "object" && body ? (body as any).clientId : undefined;

    if (!clientId || typeof clientId !== "string") {
      return NextResponse.json({ error: "clientId required" }, { status: 400 });
    }

    let models: string[];
    switch (clientId) {
      case "client1":
        models = ["risk-model1"];
        break;
      case "client2":
        models = ["risk-model1", "risk-model2"];
        break;
      default:
        models = [];
    }

    return NextResponse.json({ models });
  } catch (err: any) {
    console.error("license-service POST error", err);
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
