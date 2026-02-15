import mergedProperties from "../utils/jsonMerger.js";

export const getAllProperties = () => mergedProperties;

export const filterProperties = (filters) => {
  return mergedProperties.filter((property) => {
    const matchLocation = filters.location
      ? property.location.toLowerCase().includes(filters.location.toLowerCase())
      : true;

    const matchPrice = filters.maxPrice
      ? property.price <= filters.maxPrice
      : true;

    const matchBedrooms = filters.bedrooms
      ? property.bedrooms >= filters.bedrooms
      : true;

    const matchBathrooms = filters.bathrooms
      ? property.bathrooms >= filters.bathrooms
      : true;

    const matchSize = filters.minSize
      ? property.size_sqft >= filters.minSize
      : true;

    const matchAmenities =
      filters.amenities?.length > 0
        ? filters.amenities.some((amenity) =>
            property.amenities.some((a) =>
              a.toLowerCase().includes(amenity.toLowerCase()),
            ),
          )
        : true;

    return (
      matchLocation &&
      matchPrice &&
      matchBedrooms &&
      matchBathrooms &&
      matchSize &&
      matchAmenities
    );
  });
};
