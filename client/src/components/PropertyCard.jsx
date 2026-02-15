import React, { useState } from "react";
import { MapPin, BedDouble, Bath, Maximize, Bookmark } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const PropertyCard = ({ property, isSelected, onSelect }) => {
  const { axios, token, savedIds, fetchSavedProperties, setSavedIds } =
    useAppContext();

  const propertyId = property.id || property.propertyId;
  const propertyIdStr = String(propertyId);

  const isSaved = savedIds.includes(String(propertyId));

  const handleSave = async () => {
    console.log("property:", property);
    try {
      const { data } = await axios.post(
        `/api/property/save`,
        {
          id: propertyId, // important for toggle
          title: property.title,
          price: property.price,
          location: property.location,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          size_sqft: property.size_sqft,
          amenities: property.amenities,
          image_url: property.image_url,
        },
        { headers: { Authorization: token } },
      );
      console.log("data:", data);

      if (data.success) {
        if (data.saved) {
          setSavedIds((prev) => [...prev, propertyIdStr]);
          toast.success("Bookmark Added.");
        } else {
          setSavedIds((prev) => prev.filter((id) => id !== propertyIdStr));
          toast.success("Bookmark Removed.");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-md overflow-hidden transition duration-300 border-2 flex flex-col h-full ${
        isSelected ? "border-black" : "border-transparent"
      }`}
    >
      {/* Image */}
      <div className="relative h-60 overflow-hidden">
        <img
          src={property.image_url}
          alt={property.title}
          className="w-full h-full object-cover transition duration-500 hover:scale-105 cursor-pointer"
        />

        {/* Price Badge */}
        <div className="absolute top-4 left-4 bg-black/70 text-white px-4 py-1 rounded-full text-sm font-semibold">
          ${property.price.toLocaleString()}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {/* Bookmark */}
          <button
            onClick={handleSave}
            className="bg-white/80 backdrop-blur p-2 rounded-full cursor-pointer hover:bg-white transition"
          >
            <Bookmark
              size={18}
              className={isSaved ? "fill-black text-black" : "text-gray-700"}
            />
          </button>

          {/* Checkbox */}
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect && onSelect(property)}
            className="w-5 h-5 accent-black cursor-pointer"
          />
        </div>
      </div>

      {/* Content */}
      {/* <div className="p-5 space-y-3"> */}
      <div className="p-5 space-y-3 flex flex-col flex-grow">
        <h2 className="text-lg font-semibold text-gray-800">
          {property.title}
        </h2>

        <div className="flex items-center text-gray-500 text-sm">
          <MapPin size={16} className="mr-1" />
          {property.location}
        </div>

        <div className="flex flex-wrap gap-2 pt-3">
          {property.amenities?.map((amenity, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full"
            >
              {amenity}
            </span>
          ))}
        </div>

        <div className="flex justify-between text-gray-600 text-sm pt-4 border-t mt-auto">
          <div className="flex items-center gap-1">
            <BedDouble size={16} />
            {property.bedrooms}
          </div>
          <div className="flex items-center gap-1">
            <Bath size={16} />
            {property.bathrooms}
          </div>
          <div className="flex items-center gap-1">
            <Maximize size={16} />
            {property.size_sqft}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
