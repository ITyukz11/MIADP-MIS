import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const videoData = [
  {
    id: "1",
    title:
      "Get to know more about the Mindanao Inclusive Agriculture Development Project (MIADP)",
    url: "https://www.youtube.com/embed/ZttRh8tyeD8",
    thumbnail: "https://img.youtube.com/vi/ZttRh8tyeD8/0.jpg",
    section: "Video Highlight",
  },
  {
    id: "2",
    title: "MIADP RPCO BARMM 3rd World Bank ISM Presentation AD Profile",
    url: "https://www.youtube.com/embed/cMLCR9JMfyk",
    thumbnail: "https://img.youtube.com/vi/cMLCR9JMfyk/0.jpg",
    section: "Video Highlight",
  },
  {
    id: "3",
    title: "MIADP RPCO 9 3rd World Bank ISM PRESENTATION",
    url: "https://www.youtube.com/embed/YPwNOo8Q51s",
    thumbnail: "https://img.youtube.com/vi/YPwNOo8Q51s/0.jpg",
    section: "Video Highlight",
  },
  {
    id: "4",
    title: "MIADP RPCO 10 3rd World Bank ISM PRESENTATION",
    url: "https://www.youtube.com/embed/Cbw-dl-xbUw",
    thumbnail: "https://img.youtube.com/vi/Cbw-dl-xbUw/0.jpg",
    section: "Video Highlight",
  },
  {
    id: "5",
    title: "LPMIU Indigenous People of Region 12",
    url: "https://www.youtube.com/embed/SX_NB2qwOY0",
    thumbnail: "https://img.youtube.com/vi/SX_NB2qwOY0/0.jpg",
    section: "LPMIU",
  },
  {
    id: "6",
    title: "Specialists MIADP talks RPCO 12",
    url: "https://www.youtube.com/embed/DHHuw6O9VsU",
    thumbnail: "https://img.youtube.com/vi/DHHuw6O9VsU/0.jpg",
    section: "Video Highlight",
  },
  {
    id: "7",
    title: "The Mamanwa IPs/ICCs of CADT 256 Agusan del Norte",
    url: "https://www.youtube.com/embed/oPJEjp1N_7U",
    thumbnail: "https://img.youtube.com/vi/oPJEjp1N_7U/0.jpg",
    section: "CADT",
  },
  {
    id: "8",
    title: "The Manobo IPs/ICCs of CADT 116 Surigao del Sur",
    url: "https://www.youtube.com/embed/_dZW9cU2P2g",
    thumbnail: "https://img.youtube.com/vi/_dZW9cU2P2g/0.jpg",
    section: "CADT",
  },
  {
    id: "9",
    title: "The Mamanwa IPs/ICCsof CADT 254 Surigao del Norte",
    url: "https://www.youtube.com/embed/bgli7pFkCkg",
    thumbnail: "https://img.youtube.com/vi/bgli7pFkCkg/0.jpg",
    section: "CADT",
  },
  {
    id: "10",
    title: "The Manobo Tribe of CADT 078 Rosario, Agusan del Sur",
    url: "https://www.youtube.com/embed/tOVOpIdZe9E",
    thumbnail: "https://img.youtube.com/vi/tOVOpIdZe9E/0.jpg",
    section: "CADT",
  },
  {
    id: "11",
    title: "The Manobo Tribe of CADT 136 Bunawan, Agusan del Sur",
    url: "https://www.youtube.com/embed/ZmW0Vi-qQ2Q",
    thumbnail: "https://img.youtube.com/vi/ZmW0Vi-qQ2Q/0.jpg",
    section: "CADT",
  },
  {
    id: "12",
    title:
      "Department of Agriculture Region 12: Mindanao Inclusive Agriculture Development Project launching",
    url: "https://www.youtube.com/embed/Knr90XyTKSs",
    thumbnail: "https://img.youtube.com/vi/Knr90XyTKSs/0.jpg",
    section: "Video Highlight",
  },
  {
    id: "13",
    title: "MIADP RPCO 11 World Bank ISM Presentation",
    url: "https://www.youtube.com/embed/Pr1Ng3n_Qmg",
    thumbnail: "https://img.youtube.com/vi/Pr1Ng3n_Qmg/0.jpg",
    section: "Video Highlight",
  },
  {
    id: "14",
    title:
      "Department of Agriculture Region 12: Mindanao Inclusive Agriculture Development Project launching",
    url: "https://www.youtube.com/embed/Knr90XyTKSs",
    thumbnail: "https://img.youtube.com/vi/Knr90XyTKSs/0.jpg",
    section: "Video Highlight",
  },
  {
    id: "15",
    title:
      "MIADP First Aid, Basic Life Support (BLS) and Emergency Preparedness Training",
    url: "https://www.youtube.com/embed/wHaaFbIbkdA",
    thumbnail: "https://img.youtube.com/vi/wHaaFbIbkdA/0.jpg",
    section: "Video Highlight",
  },
];

const categories = [
  "Video Highlight",
  "Ancestral Domains",
  "CADT",
  "LPMIU",
  "Subprojects",
];

const ADAvps = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedVideo, setSelectedVideo] = useState(videoData[0]);

  // 🏎️ UseMemo to optimize filtering
  const filteredVideos = useMemo(
    () => videoData.filter((video) => video.section === selectedCategory),
    [selectedCategory]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center text-white p-4 space-y-4"
    >
      {/* Category Tabs */}
      <div className="flex space-x-4 border-b border-gray-600 pb-2">
        {categories.map((category) => (
          <motion.button
            key={category}
            onClick={() => {
              if (category !== selectedCategory) {
                setSelectedCategory(category);
                setSelectedVideo(
                  videoData.find((video) => video.section === category) ||
                    videoData[0]
                );
              }
            }}
            whileHover={{ scale: 1.05 }}
            className={`px-4 py-2 rounded-md ${
              selectedCategory === category ? "bg-[#124365]" : "bg-gray-700"
            }`}
          >
            {category}
          </motion.button>
        ))}
      </div>

      {/* Video Player */}
      <motion.div
        key={selectedCategory}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-row items-start justify-center w-full space-x-6"
      >
        <div className="flex flex-col w-3/4 p-4 bg-gray-900 rounded-2xl shadow-lg border-4 border-gray-800">
          <div className="w-full aspect-video overflow-hidden rounded-xl border-4 border-gray-700 shadow-2xl">
            <iframe
              width="100%"
              height="100%"
              src={selectedVideo?.url}
              title={selectedVideo?.title}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
          <h3 className="mt-4 text-xl font-bold text-center">
            {selectedVideo?.title}
          </h3>
        </div>

        {/* Video List */}
        <div className="w-1/4 flex flex-col space-y-4 overflow-y-auto max-h-[500px] scrollbar-hide">
          <h2 className="text-lg font-semibold">📌 Video List</h2>
          {filteredVideos.map((video) => (
            <motion.div
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              whileHover={{ scale: 0.95 }}
              className={`flex flex-col items-center cursor-pointer transition-transform rounded-lg shadow-md p-2 border ${
                selectedVideo?.id === video.id
                  ? "border-blue-500"
                  : "border-gray-700"
              }`}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-24 object-cover rounded-lg"
              />
              <span className="text-xs mt-2 text-center p-1">
                {video.title}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ADAvps;
