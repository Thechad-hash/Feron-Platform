import React, { useEffect, useState } from "react";
import { FERON_REGISTRY_ADDRESS } from "../contracts/feronRegistry";
import feronRegistryAbi from "../contracts/feronRegistryAbi.json";
import { ethers } from "ethers";

export default function GPTSelect({ onModelSelect }) {
  const [modelList, setModelList] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(FERON_REGISTRY_ADDRESS, feronRegistryAbi, signer);

        const modelIds = await contract.getAllModelIds();
        setModelList(modelIds);
      } catch (error) {
        console.error("Error fetching model list:", error);
      }
    };

    fetchModels();
  }, []);

  const handleChange = async (e) => {
    const modelId = e.target.value;
    setSelectedModel(modelId);

    if (!modelId) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(FERON_REGISTRY_ADDRESS, feronRegistryAbi, signer);

      const [modelHash, metadataURI, tierDescriptions, tierPrices, owner] = await contract.getModel(modelId);
      const tiers = tierDescriptions.map((desc, index) => ({
        description: desc,
        price: ethers.formatEther(tierPrices[index].toString())
      }));

      const fullModel = {
        modelId,
        modelHash,
        modelURI: metadataURI,
        tiers,
        owner
      };

      onModelSelect && onModelSelect(fullModel);
    } catch (err) {
      console.error("Failed to load model metadata:", err);
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor="model-select">Select Registered AI Model:</label>
      <select
        id="model-select"
        value={selectedModel}
        onChange={handleChange}
        className="border px-4 py-2 rounded"
      >
        <option value="">-- Select a model --</option>
        {modelList.map((id, index) => (
          <option key={index} value={id}>
            {id}
          </option>
        ))}
      </select>
    </div>
  );
}
