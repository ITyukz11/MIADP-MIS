import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  pso,
  rpco10,
  rpco11,
  rpco12,
  rpco13,
  rpco9,
  rpcobarmm,
} from "../data/links";

const categories = [
  "ALL",
  "PSO",
  "RPCO IX",
  "RPCO X",
  "RPCO XI",
  "RPCO XII",
  "RPCO XIII",
  "RPCO BARMM",
];

const images = [
  ...pso,
  ...rpco9,
  ...rpco10,
  ...rpco11,
  ...rpco12,
  ...rpco13,
  ...rpcobarmm,
];

const MIADPPortalGallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("ALL");

  // 🔹 Memoized image filtering to prevent unnecessary re-renders
  const filteredImages = useMemo(() => {
    return activeCategory === "ALL"
      ? images
      : images.filter((img) => img.category === activeCategory);
  }, [activeCategory]);

  return (
    <motion.div
      className="w-full max-w-6xl mx-auto p-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Category Tabs */}
      <div className="flex items-center justify-center overflow-x-auto space-x-2 sm:space-x-4 border-b border-gray-600 pb-2 mb-2 scrollbar-hide">
        {categories.map((category) => (
          <motion.button
            key={category}
            onClick={() => setActiveCategory(category)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-2 text-sm sm:text-base font-medium rounded-full transition-all duration-300
              ${
                activeCategory === category
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
              }`}
          >
            {category}
          </motion.button>
        ))}
      </div>

      {/* Masonry Grid with Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4"
      >
        <AnimatePresence>
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.src} // Unique key for smooth animations
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer overflow-hidden rounded-lg shadow-md break-inside-avoid"
            >
              {/* Open Dialog on Click */}
              <Dialog>
                <DialogTrigger asChild>
                  {/* Lazy Load & Preload Images for Performance */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.src}
                    alt={`Gallery ${index}`}
                    className="w-full object-cover rounded-lg cursor-pointer"
                    loading="lazy"
                    onClick={() => setSelectedImage(image.src)}
                  />
                </DialogTrigger>

                {/* Full-Screen Lightbox */}
                <DialogContent className="max-h-[95vh] h-fit max-w-7xl overflow-x-auto">
                  {selectedImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selectedImage}
                      alt="Selected"
                      className="w-full h-fit rounded-lg shadow-xl"
                    />
                  )}
                </DialogContent>
              </Dialog>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default MIADPPortalGallery;
