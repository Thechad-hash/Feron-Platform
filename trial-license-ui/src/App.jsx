import React, { useState } from 'react';
import GPTSelect from "./components/GPTSelect";
import TierSelector from "./components/TierSelector";
import LicenseAction from "./components/LicenseAction";
import TotalETH from "./components/TotalETH";

export default function App() {
  const [ethAmount, setEthAmount] = useState("0.00");
  const [selectedModelId, setSelectedModelId] = useState("");
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedTier, setSelectedTier] = useState("");


  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Trial License Portal</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">

    <div style={{ display: "flex", gap: "12px", justifyContent: "center", margin: "20px 0" }}>
      <a
        href="https://feron-platform-smart-contracts-ui.vercel.app/"
        style={{
          padding: "10px 20px",
          backgroundColor: "#4F46E5",
          color: "white",
          borderRadius: "6px",
          fontSize: "14px",
          textDecoration: "none"
        }}
      >
        Go to Register My Ai Page
      </a>
      <a
        href="https://feron.vercel.app/"
        style={{
          padding: "10px 20px",
          backgroundColor: "#10B981",
          color: "white",
          borderRadius: "6px",
          fontSize: "14px",
          textDecoration: "none"
        }}
      >
        Chat With Feron
      </a>
    </div>
          <GPTSelect onModelSelect={(model) => {
            setSelectedModel(model);
            setSelectedModelId(model?.modelId || "");
          }} />
          
          <TierSelector
            selectedTier={selectedTier}
            setSelectedTier={setSelectedTier}
            setEthAmount={setEthAmount}
            tierOptions={selectedModel?.tiers || []}
           
          />
          <TotalETH ethAmount={ethAmount} />
        </div>
        <div className="space-y-4">
          <LicenseAction
            modelId={selectedModelId}
            ethAmount={ethAmount}
            selectedTier={selectedTier}
            modelOwner={selectedModel?.owner}
            modelURI={selectedModel?.modelURI}
            selectedDescription={selectedModel?.tiers?.[selectedTier]?.description}
         /> 
        </div>
      </div>
      {/* Infographic footer */}
      <div className="mt-10 border-t pt-6 text-center">
        <h2 className="text-xl font-semibold mb-4">How Blockchain Licensing Works</h2>
        <img
          src="/infographic-flowchart.png"
          alt="Blockchain Licensing Flowchart"
          className="mx-auto max-w-full rounded-lg shadow-md"
        />
      </div>
    </div>
  );
}
