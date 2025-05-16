import React from 'react';
import RegisterAi from "./components/RegisterAi";


export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Register MyAi</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
        </div>
        <div className="space-y-4">
          <RegisterAi />
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
