
import React, { useState, useEffect } from 'react';
import { ethers, parseEther } from "ethers";
import { FERON_LICENSE_ADDRESS } from '../contracts/feronLicense';
import feronLicenseAbi from "../contracts/feronLicenseAbi.json";
import feronRegistryAbi from "../contracts/feronRegistryAbi.json";
import { FERON_REGISTRY_ADDRESS } from "../contracts/feronRegistry";

export default function LicenseAction({ modelId, modelOwner, ethAmount, selectedTier }) {
  const [status, setStatus] = useState("");
  const [txHash, setTxHash] = useState(null);
  const [tokenId, setTokenId] = useState(null);
  const [licenseHistory, setLicenseHistory] = useState([]);

  const handleMint = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask to continue.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const licenseContract = new ethers.Contract(FERON_LICENSE_ADDRESS, feronLicenseAbi, signer);

      const fullPayment = ethers.parseEther(ethAmount || "0");

      const registryContract = new ethers.Contract(FERON_REGISTRY_ADDRESS, feronRegistryAbi, signer);
      const modelData = await registryContract.getModel(modelId);
      const modelHash = modelData[0];
      const metadataURI = modelData[1];
      const tierDescription = modelData[2][selectedTier];
      const selectedTierIndex = selectedTier;
            
      const tx = await licenseContract.createLicense(
        modelId,
        modelHash,
        metadataURI,
        tierDescription,
        selectedTier,
        modelOwner,
        { value: fullPayment }
      );

      setStatus("⏳ Transaction submitted...");
      setTxHash(tx.hash);
      const receipt = await tx.wait();
      setStatus("✅ License successfully minted!");

      const event = receipt.logs.find(log => log.eventName === "LicenseMinted");
      if (event && event.args) {
        setTokenId(event.args.tokenId.toString());
      }

      await fetchLicenseHistory();
    } catch (err) {
      console.error("Minting error:", err);
      setStatus("❌ Mint failed. See console.");
    }
  };

  const fetchLicenseHistory = async () => {
    try {
      if (!window.ethereum) return;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const licenseContract = new ethers.Contract(FERON_LICENSE_ADDRESS, feronLicenseAbi, provider);

      const userAddress = await signer.getAddress();
      const [
        modelIds,
        modelHashes,
        metadataURIs,
        tierDescriptions,
        tiers,
        tokenIds,
        expirations
      ] = await licenseContract.getLicensesByAddress(userAddress);

      const history = modelIds.map((id, index) => ({
        modelId: id,
        modelHash: modelHashes[index],
        metadataURI: metadataURIs[index],
        tierDescription: tierDescriptions[index],
        tier: tiers[index].toString(),
        tokenId: tokenIds[index].toString(),
        expiration: expirations[index].toString()
      }));

      setLicenseHistory(history);
    } catch (err) {
      console.error("History fetch error:", err);
    }
  };

  useEffect(() => {
    fetchLicenseHistory();
  }, []);

  return (
    <div className="mt-4 space-y-4">
      <button onClick={handleMint} className="bg-black text-white px-4 py-2 rounded shadow">
        Create License
      </button>
      <div>Status: {status}</div>
      {txHash && (
        <div>
          <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer" className="underline text-blue-600">
            View Transaction
          </a>
        </div>
      )}
      {tokenId && (
        <p>
          You now own <a href={`https://sepolia.etherscan.io/token/${FERON_LICENSE_ADDRESS}?a=${tokenId}`} target="_blank" rel="noreferrer" className="underline text-blue-600">token ID #{tokenId}</a>
        </p>
      )}
      <div className="mt-6 border-t pt-4">
        <h2 className="text-lg font-bold mb-2">License History (from blockchain)</h2>
        <div className="space-y-4">
          {licenseHistory.map((entry, index) => (
            <div key={index} className="border p-4 bg-white shadow-sm">
              <p><strong>Model ID:</strong> {entry.modelId}</p>
              <p><strong>Model Hash:</strong> {entry.modelHash || "N/A"}</p>
              <p><strong>Launch Link:</strong> {entry.metadataURI ? <a href={entry.metadataURI} target="_blank" rel="noreferrer" className="underline text-blue-600">{entry.metadataURI}</a> : "N/A"}</p>
              <p><strong>Tier Description:</strong> {entry.tierDescription || "N/A"}</p>
              <p><strong>Tier:</strong> {entry.tier}</p>
              <p><strong>Token ID:</strong> {entry.tokenId}</p>
              <p><strong>Expires:</strong> {new Date(Number(entry.expiration) * 1000).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
