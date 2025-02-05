// app/components/RustCalculator.tsx
"use client";

import { useState } from "react";
import init, {calculate as wasm_calculator} from "../wasm/calculator_wasm";

export default function RustCalculator() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const calculate  = async () => {
    await init();
    try {
      setResult(wasm_calculator(expression));
    } catch (error) {
      console.error("Calculation error:", error);
      setResult(error?.toString() ?? "");
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={expression}
        onChange={(e) => setExpression(e.target.value)}
        placeholder="Enter math expression (e.g., 2+2)"
        className="w-full p-2 border rounded"
      />
      <button
        onClick={calculate}
        className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
      >
        Calculate
      </button>
      {result !== null && (
        <div className="text-xl font-bold">Result: {result}</div>
      )}
    </div>
  );
}
