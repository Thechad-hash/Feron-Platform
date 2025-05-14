import React, { useState } from "react";
import { ethers, parseEther } from "ethers";
import feronRegistryAbi from "../contracts/feronRegistryAbi.json";
import { FERON_REGISTRY_ADDRESS } from "../contracts/feronRegistry";

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

  const [uploadType, setUploadType] = useState("file");
  const [file, setFile] = useState(null);

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

      const platformFee = parseEther("0.02");

      const tx = await registry.registerModel(
        modelId,
        modelHash,
        modelURI,
        tierDescriptions,
        tierPrices,
        { value: platformFee }
      );

      setStatus("🚀 Model registration submitted...");
      setTxHash(tx.hash);

      const receipt = await tx.wait();

      if (receipt && receipt.status === 1) {
        console.log("📦 Model registered on-chain:", modelId);
        setStatus("✅ Model successfully registered!");
      } else {
        throw new Error("Transaction reverted.");
      }

    } catch (err) {
      console.error("❌ Error:", err);
      setStatus("❌ Registration failed. See console.");
    }
  };

  const simulateHash = (inputName) => {
    return "Qm" + btoa(inputName).slice(0, 40);
  };

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const fakeHash = simulateHash(selectedFile.name);
      setModelHash(fakeHash);
      setModelURI(`local://${selectedFile.name}`);
    }
  };

  const handleUrlInputChange = (e) => {
    const inputUrl = e.target.value;
    setModelURI(inputUrl);

    if (inputUrl) {
      const fakeHash = simulateHash(inputUrl);
      setModelHash(fakeHash);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-lg font-bold">Register Your AI Model</h2>

      <input
        type="text"
        placeholder="Model ID"
        value={modelId}
        onChange={(e) => setModelId(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <div className="flex gap-4 items-center">
        <label>
          <input
            type="radio"
            value="file"
            checked={uploadType === "file"}
            onChange={() => setUploadType("file")}
            className="mr-1"
          />
          Upload File
        </label>
        <label>
          <input
            type="radio"
            value="url"
            checked={uploadType === "url"}
            onChange={() => setUploadType("url")}
            className="mr-1"
          />
          Use Hosted URL
        </label>
      </div>

      {uploadType === "file" ? (
        <input
          type="file"
          onChange={handleFileInputChange}
          className="w-full p-2 border rounded"
        />
      ) : (
        <input
          type="text"
          placeholder="Paste self-hosted model URL"
          onChange={handleUrlInputChange}
          className="w-full p-2 border rounded"
        />
      )}

      <input
        type="text"
        placeholder="Model Hash (auto-generated)"
        value={modelHash}
        readOnly
        className="w-full p-2 border rounded bg-gray-100"
      />

      <input
        type="text"
        placeholder="Model URI"
        value={modelURI}
        readOnly
        className="w-full p-2 border rounded bg-gray-100"
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
