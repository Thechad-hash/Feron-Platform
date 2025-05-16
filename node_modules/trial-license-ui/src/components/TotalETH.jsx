import React from "react";

export default function TotalETH({ ethAmount, usdRate = 0 }) {
  const isFree = ethAmount === "0" || ethAmount === "0.00";
  const usdEquivalent = usdRate && !isFree ? (parseFloat(ethAmount) * usdRate).toFixed(2) : null;

  return (
    <div className="p-4 border rounded font-medium">
      {isFree ? (
        "This tier is free (0 ETH)"
      ) : (
        <>
          Total ETH to be sent: {ethAmount}
          {usdEquivalent && (
            <span className="text-sm text-gray-500"> (~${usdEquivalent} USD)</span>
          )}
        </>
      )}
    </div>
  );
}
