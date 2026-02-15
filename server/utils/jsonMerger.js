import basics from "../data/json1.json" with { type: "json" };
import characteristics from "../data/json2.json" with { type: "json" };
import images from "../data/json3.json" with { type: "json" };

const mergedProperties = basics.map((b) => {
  const char = characteristics.find((c) => c.id === b.id);
  const img = images.find((i) => i.id === b.id);

  return {
    ...b,
    ...(char || {}), // safety in case undefined
    image_url: img?.image_url || null,
  };
});

export default mergedProperties;
