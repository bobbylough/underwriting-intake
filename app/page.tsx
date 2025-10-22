"use client";

import { useState } from "react";

export default function UploadPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const res = await fetch("/api/group-score", {
      method: "POST",
      body: formData,
    });

    const json = await res.json();
    setResult(json);
    setLoading(false);
  }

  return (
    <div className="p-8 max-w-xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Group Risk Scoring</h1>
        <p className="text-sm text-gray-600">
          Client 1 is licensed for Risk Model 1.
        </p>
        <p className="text-sm text-gray-600">
          Client 2 is licensed for Risk Model 1 and Risk Model 2.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <fieldset className="border rounded p-3">
          <legend className="font-medium">Select Client</legend>
          <div className="mt-2 space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="clientId"
                value="client1"
                defaultChecked
              />
              <span>Client 1</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="clientId" value="client2" />
              <span>Client 2</span>
            </label>
          </div>
        </fieldset>

        <input
          type="file"
          name="file"
          accept=".csv"
          required
          className="border p-2 w-full"
        />

        <button
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
        >
          {loading ? "Scoring..." : "Upload and Score"}
        </button>
      </form>

      {result && (
        <div className="mt-6 border-t pt-4">
          {result.valid ? (
            <>
              <p>
                <strong>Models:</strong> {result.models.join(", ")}
              </p>
              <p>
                <strong>Risk Score:</strong> {result.riskScore}
              </p>
            </>
          ) : (
            <div>
              <h2 className="font-semibold text-red-600">Validation Errors</h2>
              <pre className="text-sm bg-gray-100 p-2 rounded mt-2 overflow-auto">
                {JSON.stringify(result.errors, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
