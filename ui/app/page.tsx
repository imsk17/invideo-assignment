"use client";

import { useState } from "react";
import RustCalculator from "./components/Calculator";
import TextToShader from "./components/Shader";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"calculator" | "shader">(
    "calculator"
  );

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex space-x-4">
        <button
          onClick={() => setActiveTab("calculator")}
          className={`px-4 py-2 rounded ${
            activeTab === "calculator"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          Rust Calculator
        </button>
        <button
          onClick={() => setActiveTab("shader")}
          className={`px-4 py-2 rounded ${
            activeTab === "shader"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          Text-to-Shader
        </button>
      </div>

      {activeTab === "calculator" && <RustCalculator />}
      {activeTab === "shader" && <TextToShader />}
    </div>
  );
}
