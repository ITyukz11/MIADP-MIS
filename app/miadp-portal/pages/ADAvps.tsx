import React, { useState } from "react";

const videoData = [
  {
    id: "1",
    title: "MIADP RPCO 11 World Bank ISM Presentation",
    url: "https://www.youtube.com/embed/Pr1Ng3n_Qmg",
    thumbnail: "https://img.youtube.com/vi/Pr1Ng3n_Qmg/0.jpg",
  },
  {
    id: "2",
    title: "MIADP RPCO BARMM 3rd World Bank ISM Presentation AD Profile",
    url: "https://www.youtube.com/embed/cMLCR9JMfyk",
    thumbnail: "https://img.youtube.com/vi/cMLCR9JMfyk/0.jpg",
  },
  {
    id: "3",
    title: "MIADP RPCO 9 3rd World Bank ISM PRESENTATION",
    url: "https://www.youtube.com/embed/YPwNOo8Q51s",
    thumbnail: "https://img.youtube.com/vi/YPwNOo8Q51s/0.jpg",
  },
  {
    id: "4",
    title: "MIADP RPCO 10 3rd World Bank ISM PRESENTATION",
    url: "https://www.youtube.com/embed/Cbw-dl-xbUw",
    thumbnail: "https://img.youtube.com/vi/Cbw-dl-xbUw/0.jpg",
  },
  {
    id: "5",
    title:
      "Local Project Management and Implementation Unit (LPMIU) Indigenous People of Region 12",
    url: "https://www.youtube.com/embed/SX_NB2qwOY0",
    thumbnail: "https://img.youtube.com/vi/SX_NB2qwOY0/0.jpg",
  },
  {
    id: "6",
    title: "Specialists MIADP talks RPCO 12",
    url: "https://www.youtube.com/embed/DHHuw6O9VsU",
    thumbnail: "https://img.youtube.com/vi/DHHuw6O9VsU/0.jpg",
  },
];

const ADAvps = () => {
  const [selectedVideo, setSelectedVideo] = useState(videoData[0]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-white">
      {/* Video Player */}
      <div className="w-full">
        <div className="w-full aspect-video overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            src={selectedVideo.url}
            title={selectedVideo.title}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
        <h3 className="mt-4 text-xl font-bold text-center">
          {selectedVideo.title}
        </h3>
      </div>

      {/* Horizontal Scrollable Video List */}
      <div className="w-full mt-6">
        <h2 className="text-lg font-semibold mb-3">📌 Video List</h2>
        <div className="flex overflow-x-auto space-x-4 p-2 scrollbar-hide snap-x">
          {videoData.map((video) => (
            <div
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className={`flex flex-col w-56 shrink-0 items-center cursor-pointer transition-transform hover:scale-105 snap-start rounded-lg shadow-md 
          ${selectedVideo.id === video.id ? "border-blue-500 p-2" : ""}`}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-32 object-cover rounded-t-lg"
              />
              <span className="text-sm mt-2 text-center p-2">
                {video.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ADAvps;
