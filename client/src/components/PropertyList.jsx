import React, { useState } from "react";
import PropertyCard from "./PropertyCard";
import PropertyCompareModal from "./PropertyCompareModal";

const PropertyList = ({ properties }) => {
  const [selected, setSelected] = useState([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const toggleSelect = (property) => {
    setSelected((prev) =>
      prev.find((p) => p.id === property.id)
        ? prev.filter((p) => p.id !== property.id)
        : [...prev, property],
    );
  };

  const resetSelection = () => setSelected([]);

  return (
    <div className="space-y-6 fixed inset-0 bg-black/40 backdrop-blur-sm z-40">
      {/* Compare Bar */}
      {selected.length > 1 && (
        <div className="flex items-center justify-between bg-black text-white p-4 rounded-xl">
          <p>{selected.length} Properties Selected</p>
          <div className="flex gap-3">
            <button
              onClick={() => setCompareOpen(true)}
              className="bg-white text-black px-4 py-2 rounded-lg"
            >
              Compare
            </button>
            <button
              onClick={resetSelection}
              className="border border-white px-4 py-2 rounded-lg"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            isSelected={selected.find((p) => p.id === property.id)}
            onSelect={toggleSelect}
          />
        ))}
      </div>

      {/* Compare Modal */}
      {compareOpen && (
        <PropertyCompareModal
          properties={selected}
          onClose={() => setCompareOpen(false)}
        />
      )}
    </div>
  );
};

export default PropertyList;
