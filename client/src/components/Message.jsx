// import React, { useEffect } from "react";
// import { assets } from "../assets/assets";
// import moment from "moment";
// import Markdown from "react-markdown";
// import Prism from "prismjs";
// import PropertyCard from "./PropertyCard";
// import { useState } from "react";

// const Message = ({ message, selectedProperties = [], onSelectProperty }) => {
//   // const [selectedProperties, setSelectedProperties] = useState([]);

//   const handleSelect = (property) => {
//     setSelectedProperties((prev) => {
//       if (prev.some((p) => p.id === property.id)) {
//         return prev.filter((p) => p.id !== property.id);
//       } else {
//         return [...prev, property];
//       }
//     });
//   };

//   useEffect(() => {
//     Prism.highlightAll();
//   }, [message.content]);

//   return (
//     <div>
//       {message.role === "user" ? (
//         <div className="flex items-start justify-end my-4 gap-2">
//           <div className="flex flex-col gap-2 p-2 px-4 bg-slate-50 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-md max-w-2xl">
//             <p className="text-sm dark:text-primary">{message.content}</p>
//             <span className="text-xs text-gray-400 dark:text-[#B1A6C0]">
//               {moment(message.timestamp).fromNow()}
//             </span>
//           </div>
//           <img src={assets.user_icon} className="w-8 rounded-full" alt="" />
//         </div>
//       ) : (
//         // <div className="inline-flex flex-col gap-3 p-3 px-4 max-w-5xl bg-primary/20 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-xl my-4">
//         <div className="inline-flex flex-col gap-3 p-3 px-4 w-fit max-w-full bg-primary/20 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-xl my-4">
//           {/* PROPERTY CARDS */}
//           {message.type === "property_cards" ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-fit">
//               {message.properties?.map((property) => (
//                 // <PropertyCard key={property.id} property={property} />
//                 <PropertyCard
//                   key={property.id} // 👈 yeh add karo
//                   property={property}
//                   isSelected={selectedProperties.some(
//                     (p) => p.id === property.id,
//                   )}
//                   onSelect={onSelectProperty}
//                 />
//               ))}
//             </div>
//           ) : message.isImage ? (
//             <img
//               src={message.content}
//               className="w-full max-w-md mt-2 rounded-md"
//               alt=""
//             />
//           ) : (
//             <div className="text-sm dark:text-primary reset-tw">
//               <Markdown>{message.content}</Markdown>
//             </div>
//           )}

//           <span className="text-xs text-gray-400 dark:text-[#B1A6C0]">
//             {moment(message.timestamp).fromNow()}
//           </span>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Message;

import React, { useEffect } from "react";
import { assets } from "../assets/assets";
import moment from "moment";
import Markdown from "react-markdown";
import Prism from "prismjs";
import PropertyCard from "./PropertyCard";

const Message = ({ message, selectedProperties = [], onSelectProperty }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [message.content]);

  return (
    <div>
      {message.role === "user" ? (
        <div className="flex items-start justify-end my-4 gap-2">
          <div className="flex flex-col gap-2 p-2 px-4 bg-slate-50 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-md max-w-2xl">
            <p className="text-sm dark:text-primary">{message.content}</p>
            <span className="text-xs text-gray-400 dark:text-[#B1A6C0]">
              {moment(message.timestamp).fromNow()}
            </span>
          </div>
          <img src={assets.user_icon} className="w-8 rounded-full" alt="" />
        </div>
      ) : (
        <div className="inline-flex flex-col gap-3 p-3 px-4 w-fit max-w-full bg-primary/20 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-xl my-4">
          {/* PROPERTY CARDS */}
          {message.type === "property_cards" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-fit">
              {message.properties?.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  isSelected={selectedProperties.some(
                    (p) => p.id === property.id,
                  )}
                  onSelect={onSelectProperty}
                />
              ))}
            </div>
          )}

          {/* COMPARISON TABLE */}
          {message.type === "comparison_table" && (
            <div className="w-full overflow-x-auto rounded-lg shadow-md border border-gray-300 dark:border-gray-600">
              {/* Inner wrapper ensures min width for table */}
              <div className="inline-block max-w-screen sm:max-w-[300px] md:max-w-[700px] lg:max-w-[1000px] overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-[#57317C]">
                      <th className="border border-gray-300 dark:border-gray-500 p-3 text-left sticky left-0 bg-gray-100 dark:bg-[#57317C] z-10">
                        Feature
                      </th>
                      {message.properties.map((p, index) => (
                        <th
                          key={p.id}
                          className="border border-gray-300 dark:border-gray-500 p-3 text-left"
                        >
                          P{index + 1}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {[
                      {
                        label: "Image",
                        value: (p) => (
                          <img
                            src={p.image_url}
                            alt={p.title}
                            className="w-36 h-20 object-cover rounded-md"
                          />
                        ),
                      },
                      { label: "Title", value: (p) => p.title },
                      { label: "Location", value: (p) => p.location },
                      { label: "Price", value: (p) => `₹ ${p.price}` },
                      { label: "Bedrooms", value: (p) => p.bedrooms },
                      { label: "Bathrooms", value: (p) => p.bathrooms },
                      { label: "Size (sqft)", value: (p) => p.size_sqft },
                    ].map((row) => (
                      <tr
                        key={row.label}
                        className="even:bg-gray-50 dark:even:bg-[#57317C]/20 odd:bg-white dark:odd:bg-[#57317C]/10 
                        transition-colors duration-300
                        hover:bg-gradient-to-r hover:from-[#A456F7]/20 hover:to-[#3D81F6]/20 
                        dark:hover:from-[#A456F7]/10 dark:hover:to-[#3D81F6]/20"
                      >
                        <td className="border border-gray-300 dark:border-gray-500 p-3 font-medium sticky left-0 bg-white dark:bg-[#1e1e2f] z-10">
                          {row.label}
                        </td>
                        {message.properties.map((p) => (
                          <td
                            key={p.id}
                            className="border border-gray-300 dark:border-gray-500 p-3 whitespace-nowrap"
                          >
                            {row.value(p)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* IMAGE */}
          {message.isImage && (
            <img
              src={message.content}
              className="w-full max-w-md mt-2 rounded-md"
              alt=""
            />
          )}

          {/* Markdown Text */}
          {!message.isImage &&
            !["property_cards", "comparison_table"].includes(message.type) && (
              <div className="text-sm dark:text-primary reset-tw">
                <Markdown>{message.content}</Markdown>
              </div>
            )}

          <span className="text-xs text-gray-400 dark:text-[#B1A6C0]">
            {moment(message.timestamp).fromNow()}
          </span>
        </div>
      )}
    </div>
  );
};

export default Message;
