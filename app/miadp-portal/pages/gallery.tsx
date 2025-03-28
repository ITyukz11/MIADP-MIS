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
import Image from "next/image";
import { Label } from "@/components/ui/label";

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
      className="w-full mx-auto p-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Category Tabs */}
      <div className="flex items-center justify-start md:justify-center overflow-x-auto space-x-2 sm:space-x-4 border-b border-gray-600 pb-2 mb-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className="flex z-50 mt-2 cursor-pointer flex-row brightness-150 dark:brightness-100 group hover:shadow-lg hover:shadow-blue-700/60 transition ease-in-out hover:scale-105 p-1 rounded-xl bg-gradient-to-br from-blue-900 via-blue-700 to-blue-900 hover:from-blue-800 hover:via-blue-900 hover:to-blue-700"
          >
            <div className="px-6 flex flex-nowrap flex-row py-2 backdrop-blur-xl bg-black/80 rounded-lg font-bold w-full h-full">
              <div className="group-hover:scale-100 flex group-hover:text-blue-400 text-blue-500 gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                  className="w-6 h-6 stroke-blue-500 group-hover:stroke-blue-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                  ></path>
                </svg>
                <Label className="cursor-pointer flex flex-row items-center flex-nowrap whitespace-nowrap text-sm sm:text-base md:text-lg lg:text-xl">
                  {category}
                </Label>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* <div className="flex items-center justify-center overflow-x-auto space-x-2 sm:space-x-4 border-b border-gray-600 pb-2 mb-2 scrollbar-hide">
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
      </div> */}

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
              key={index}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer overflow-hidden rounded-lg break-inside-avoid"
            >
              {/* Open Dialog on Click */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="relative w-full h-64">
                    {/* Ensuring parent is relative */}
                    <Image
                      src={image.src}
                      alt={`Gallery ${index}`}
                      fill
                      className="object-cover rounded-lg cursor-pointer"
                      loading="lazy"
                      // placeholder="blur"
                      // blurDataURL="/MIADP-Assistant.png"
                      onClick={() => setSelectedImage(image.src)}
                    />
                  </div>
                </DialogTrigger>

                {/* Full-Screen Lightbox */}
                <DialogContent className="max-h-[95vh] h-fit max-w-5xl overflow-x-auto">
                  {selectedImage && (
                    <div className="relative w-full h-[80vh]">
                      {/* Ensuring parent is relative */}
                      <Image
                        fill
                        src={selectedImage}
                        alt="Selected"
                        style={{ objectFit: "contain" }}
                        priority
                        // placeholder="blur"
                        // blurDataURL="/MIADP-Assistant.png"
                        quality={75}
                        loading="eager"
                      />
                    </div>
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
