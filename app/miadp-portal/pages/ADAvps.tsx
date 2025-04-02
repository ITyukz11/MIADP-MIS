import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  AncestralDomainData,
  CADTdata,
  LPMIUdata,
  SubprojectData,
  videoHighlights,
} from "../data/avpsData";

const categories = [
  "Video Highlight",
  "Ancestral Domains",
  "CADT",
  "LPMIU",
  "Subprojects",
];

const ADAvps = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  // Filter out empty objects from AncestralDomainData before merging
  const data = useMemo(
    () => [
      ...videoHighlights,
      ...AncestralDomainData.filter((item) => Object.keys(item).length > 0),
      ...CADTdata,
      ...LPMIUdata,
      ...SubprojectData,
    ],
    []
  );
  const [selectedVideo, setSelectedVideo] = useState(data[0]);

  const filteredVideos = useMemo(
    () => data.filter((video) => video.section === selectedCategory),
    [data, selectedCategory]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center text-white space-y-4 w-full"
    >
      {/* Category Tabs */}
      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="flex flex-nowrap justify-start md:justify-center space-x-2 sm:space-x-4 border-b border-gray-600 pb-2 z-10">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => {
                if (category !== selectedCategory) {
                  setSelectedCategory(category);
                  setSelectedVideo(
                    data.find((video) => video.section === category) || data[0]
                  );
                }
              }}
              whileHover={{ scale: 1.05 }}
              className={`px-4 z-50 mt-2 py-2 rounded-md whitespace-nowrap transition ${
                selectedCategory === category ? "bg-[#124365]" : "bg-gray-700"
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Video Player & List */}
      <motion.div
        key={selectedCategory}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row items-center justify-center w-full space-y-4 md:space-y-0 md:space-x-6 h-auto md:h-[70vh] min-h-[400px]"
      >
        {/* Video Player */}
        <div className="w-full md:w-3/4 p-4 bg-gray-900 rounded-2xl shadow-lg border-4 border-gray-800 flex flex-col h-full">
          <div className="w-full flex-1 aspect-video overflow-hidden rounded-xl border-4 border-gray-700 shadow-2xl">
            <iframe
              width="100%"
              height="100%"
              src={selectedVideo?.url}
              title={selectedVideo?.title}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
          <h3 className="mt-4 text-lg md:text-xl font-bold text-center">
            {selectedVideo?.title}
          </h3>
        </div>

        {/* Video List (Scrollable) */}
        <div className="w-full md:w-1/4 max-h-[300px] md:max-h-[500px] overflow-y-auto space-y-2 px-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          {filteredVideos.map((video) => (
            <motion.div
              key={video.title}
              whileHover={{ scale: 1.05 }}
              className={`flex overflow-hidden items-center space-x-3 p-2 rounded-md cursor-pointer transition ${
                selectedVideo.title === video.title
                  ? "bg-[#124365]"
                  : "bg-gray-700"
              }`}
              onClick={() => setSelectedVideo(video)}
            >
              <Image
                src={video.thumbnail}
                alt={video.title}
                width={80}
                height={56}
                className="w-20 h-14 rounded-md object-cover"
                unoptimized
              />
              <p className="text-xs sm:text-sm font-medium">{video.title}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ADAvps;
