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
    title:
      "Get to know more about the Mindanao Inclusive Agriculture Development Project (MIADP)",
    url: "https://www.youtube.com/embed/ZttRh8tyeD8",
    thumbnail: "https://img.youtube.com/vi/ZttRh8tyeD8/0.jpg",
  },
  {
    id: "4",
    title: "MIADP - RPCO 12 Official Introduction Video",
    url: "https://www.youtube.com/embed/AKiSzAasyQ8",
    thumbnail: "https://img.youtube.com/vi/AKiSzAasyQ8/0.jpg",
  },
  {
    id: "5",
    title: "MIADP Caraga Region Overview",
    url: "https://www.youtube.com/embed/BbUpkpysH8c",
    thumbnail: "https://img.youtube.com/vi/BbUpkpysH8c/0.jpg",
  },
  {
    id: "36",
    title: "MIADP - RPCO X Project Highlights",
    url: "https://www.youtube.com/embed/zSSGBbOkxUM",
    thumbnail: "https://img.youtube.com/vi/zSSGBbOkxUM/0.jpg",
  },
  {
    id: "26",
    title: "MIADP - RPCO X Project Highlights",
    url: "https://www.youtube.com/embed/zSSGBbOkxUM",
    thumbnail: "https://img.youtube.com/vi/zSSGBbOkxUM/0.jpg",
  },
  {
    id: "12",
    title: "MIADP - RPCO X Project Highlights",
    url: "https://www.youtube.com/embed/zSSGBbOkxUM",
    thumbnail: "https://img.youtube.com/vi/zSSGBbOkxUM/0.jpg",
  },
  {
    id: "23",
    title: "MIADP - RPCO X Project Highlights",
    url: "https://www.youtube.com/embed/zSSGBbOkxUM",
    thumbnail: "https://img.youtube.com/vi/zSSGBbOkxUM/0.jpg",
  },
  {
    id: "24",
    title: "MIADP - RPCO X Project Highlights",
    url: "https://www.youtube.com/embed/zSSGBbOkxUM",
    thumbnail: "https://img.youtube.com/vi/zSSGBbOkxUM/0.jpg",
  },
  {
    id: "234",
    title: "MIADP - RPCO X Project Highlights",
    url: "https://www.youtube.com/embed/zSSGBbOkxUM",
    thumbnail: "https://img.youtube.com/vi/zSSGBbOkxUM/0.jpg",
  },
  {
    id: "224",
    title: "MIADP - RPCO X Project Highlights",
    url: "https://www.youtube.com/embed/zSSGBbOkxUM",
    thumbnail: "https://img.youtube.com/vi/zSSGBbOkxUM/0.jpg",
  },
];

const ADAvps = () => {
  const [selectedVideo, setSelectedVideo] = useState(videoData[0]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 p-6 text-white">
      {/* Video Player */}
      <div className="w-full max-w-4xl">
        <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
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
      <div className="w-full max-w-4xl mt-6">
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
