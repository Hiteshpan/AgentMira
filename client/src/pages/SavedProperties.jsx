import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import PropertyCard from "../components/PropertyCard";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";

const SavedProperties = () => {
  const { axios, token } = useAppContext();

  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchSavedProperties = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(`/api/property/saved?search=${search}`, {
        headers: { Authorization: token },
      });

      if (data.success) {
        setProperties(data.properties);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (id) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  // useEffect(() => {
  //   fetchSavedProperties();
  // }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchSavedProperties();
    }, 400);

    return () => clearTimeout(delay);
  }, [search, token]);

  // useEffect(() => {
  //   const delay = setTimeout(() => {
  //     fetchSavedProperties();
  //   }, 500);

  //   return () => clearTimeout(delay);
  // }, [search]);

  return (
    <div className="min-h-screen w-full px-6 md:px-16 py-10">
      {/* Title */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate("/")} className="cursor-pointer">
          <ArrowLeft size={26} />
        </button>

        <h1 className="text-3xl font-bold">Saved Properties</h1>
      </div>

      {/* Search Bar */}
      <div className="mb-8 max-w-xl relative">
        <Search
          size={18}
          className="absolute left-4 top-[48%] -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search by location, price, amenities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-black transition"
        />
      </div>

      {/* Loading */}
      {loading && <p>Loading...</p>}

      {/* Grid */}
      {!loading && properties.length === 0 && (
        <p className="text-gray-500">No saved properties found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((property) => (
          <PropertyCard
            key={property._id}
            property={property}
            onRemove={handleRemove}
          />
        ))}
      </div>
    </div>
  );
};

export default SavedProperties;
