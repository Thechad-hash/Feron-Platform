import React from "react";

export default function TierSelector({ selectedTier, setSelectedTier, setEthAmount, tierOptions = [] }) {
  const validTiers = tierOptions.filter(t => t.description || t.price);

  return (
    <div className="p-4 border rounded space-y-2">
      <span className="font-semibold">Choose Access Tier:</span>
      {validTiers.length > 0 ? (
        validTiers.map((tier, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedTier(index);
              setEthAmount(tier.price);
            }}
            className={`block px-3 py-2 border rounded w-full text-left ${
              selectedTier === index ? "bg-gray-200" : ""
            }`}
          >
            {tier.description || `Tier ${index}`} — {tier.price === "0" ? "Free" : `${tier.price} ETH/month`}
          </button>
        ))
      ) : (
        <div>No tiers available for this model.</div>
      )}
    </div>
  );
}
