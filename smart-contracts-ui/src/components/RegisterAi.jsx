import React, { useState } from "react";
import { ethers, parseEther } from "ethers";
import feronRegistryAbi from "../contracts/feronRegistryAbi.json";
import { FERON_REGISTRY_ADDRESS } from "../contracts/feronRegistry";
//import confetti from "canvas-confetti";


export default function RegisterAi() {
  const [status, setStatus] = useState("");
  const [txHash, setTxHash] = useState(null);
  const [modelId, setModelId] = useState("");
  const [modelHash, setModelHash] = useState("");
  const [modelURI, setModelURI] = useState("");
  const [tiers, setTiers] = useState([
    { eth: "", description: "" },
    { eth: "", description: "" },
    { eth: "", description: "" },
    { eth: "", description: "" },
  ]);

  const handleTierChange = (index, field, value) => {
    const updatedTiers = [...tiers];
    updatedTiers[index][field] = value;
    setTiers(updatedTiers);
  };

  const handleRegister = async () => {
    try {
      if (!window.ethereum) throw new Error("MetaMask not found");

      setStatus("🛠 Waiting for MetaMask...");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const registry = new ethers.Contract(
        FERON_REGISTRY_ADDRESS,
        feronRegistryAbi,
        signer
      );

      if (!modelId || !modelHash || !modelURI) {
        setStatus("❌ All model fields are required.");
        return;
      }

      const tierDescriptions = tiers.map((t) => t.description || "");
      const tierPrices = tiers.map((t) => parseEther(t.eth || "0"));
      
      const fee = await registry.getCurrentRegistrationFee();
      //const platformFee = parseEther("0.02");

      const tx = await registry.registerModel(
        modelId,
        modelHash,
        modelURI,
        tierDescriptions,
        tierPrices,
       { value: fee }
      );

      setStatus("🚀 Model registration submitted...");
      setTxHash(tx.hash);

      const receipt = await tx.wait();

      if (receipt && receipt.status === 1) {
        console.log("📦 Model registered on-chain:", modelId);
        setStatus("✅ Model successfully registered!");
        const audio = document.getElementById("success-audio");
        if (audio) {
         audio.currentTime = 0;
         audio.play().catch(err => console.warn("Audio playback failed:", err));
        }
       // confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } else {
        throw new Error("Transaction reverted.");
      }

    } catch (err) {
      console.error("❌ Error:", err);
      setStatus("❌ Registration failed.");
    }
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-lg font-bold">Register Your AI Model</h2>


    <div style={{ display: "flex", gap: "12px", justifyContent: "center", margin: "20px 0" }}>
      <a
        href="https://ferontriallicensebip.vercel.app/"
        style={{
          padding: "10px 20px",
          backgroundColor: "#4F46E5",
          color: "white",
          borderRadius: "6px",
          fontSize: "14px",
          textDecoration: "none"
        }}
      >
        Go to License My Ai Page
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


      <input
        type="text"
        placeholder="Model ID"
        value={modelId}
        onChange={(e) => setModelId(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <input
        type="text"
        placeholder="Paste model IPFS or Satoshi hash link"
        value={modelHash}
        onChange={(e) => setModelHash(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <input
        type="text"
        placeholder="AI Chat Webpage URL(e.g., https://mychatmodel.app)"
        value={modelURI}
        onChange={(e) => setModelURI(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <h3 className="font-semibold">Define Tier Levels (Optional)</h3>
      {tiers.map((tier, idx) => (
        <div key={idx} className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder={`Tier ${idx} ETH/month`}
            value={tier.eth}
            onChange={(e) => handleTierChange(idx, "eth", e.target.value)}
            className="w-1/3 p-2 border rounded"
          />
          <input
            type="text"
            placeholder={`Tier ${idx} Description`}
            value={tier.description}
            onChange={(e) => handleTierChange(idx, "description", e.target.value)}
            className="flex-1 p-2 border rounded"
          />
        </div>
      ))}

      <button
        onClick={handleRegister}
        className="px-4 py-2 bg-blue-600 text-white rounded shadow"
      >
        Register MyAi
      </button>

      <div>Status: {status}</div>

      {txHash && (
        <div className="mt-2 text-sm">
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            View on Etherscan
          </a>
          <div className="mt-1">
            <strong>Model ID:</strong> {modelId}
            <br />
            <strong>Tx Hash:</strong> {txHash}
          </div>
        </div>
      )}
    </div>
  );
}


