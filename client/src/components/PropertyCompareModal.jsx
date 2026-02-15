import React from "react";

const PropertyCompareModal = ({ properties, onClose }) => {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-[#1e1e2f] w-full max-w-6xl rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-5">
            <h2 className="text-2xl font-semibold">Compare Properties</h2>

            <button
              onClick={onClose}
              className="text-gray-500 hover:text-black dark:hover:text-white text-xl"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div
                key={property.id}
                className="border rounded-xl p-4 shadow-sm bg-gray-50 dark:bg-[#2a2a3d]"
              >
                <img
                  src={property.images?.[0]}
                  alt={property.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />

                <h3 className="text-lg font-semibold mb-2">{property.title}</h3>

                <p className="text-sm text-gray-600 dark:text-gray-300">
                  📍 {property.location}
                </p>

                <p className="text-sm mt-1">💰 ₹ {property.price}</p>

                <p className="text-sm mt-1">
                  🛏 {property.bedrooms} Beds | 🛁 {property.bathrooms} Baths
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyCompareModal;
