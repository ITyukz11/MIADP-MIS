"use client";
import { useCallback, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Video,
  Image as ImageIcon,
  Users,
  ArrowLeft,
  File,
  Cloud,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Program from "./pages/program";
import { Label } from "@/components/ui/label";
import ADAvps from "./pages/ADAvps";
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";
import { Engine } from "tsparticles-engine";
import { useTheme } from "next-themes";
import { ModeToggle } from "@/components/mode-toggle";
import { FaMoon, FaSun } from "react-icons/fa";
import Attendees from "./pages/attendees";

const resources = [
  {
    type: "video",
    title: "Video Highlights",
    description: "Watch the key moments from our latest event.",
  },
  {
    type: "presentation",
    title: "Presentations",
    description: "View the slides from the keynote presentation.",
  },
  {
    type: "image",
    title: "Photo Gallery",
    description: "Browse high-quality images from the event.",
  },
  {
    type: "program",
    title: "Program Schedule",
    description: "Download the full event program and schedule.",
  },
  {
    type: "attendees",
    title: "List of Attendees",
    description: "See the names of people who attended the event.",
  },
  {
    type: "gdrive",
    title: "Google Drive",
    description: "Access all event files in Google Drive.",
  },
];

const iconMap: Record<string, JSX.Element> = {
  video: <Video size={24} className="text-blue-500" />,
  presentation: <FileText size={24} className="text-orange-500" />,
  image: <ImageIcon size={24} className="text-green-500" />,
  program: <File size={24} className="text-red-500" />,
  attendees: <Users size={24} className="text-purple-500" />,
  gdrive: <Cloud size={24} className="text-yellow-500" />,
};

// Component templates
const ResourceComponent = ({
  type,
  title,
  description,
  icon,
}: {
  type: string;
  title: string;
  description: string;
  icon: JSX.Element;
}) => {
  if (type === "program") return <Program />;

  if (type === "video") return <ADAvps />;

  if (type === "attendees") return <Attendees />;
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-white shadow-lg rounded-md"
    >
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="text-center text-3xl">✨🎉✨</div>
    </motion.div>
  );
};

// Main Component
export default function OneStopShop() {
  const [search, setSearch] = useState("");
  const [activeResource, setActiveResource] = useState<{
    type: string;
    title: string;
    description: string;
  } | null>(null);

  const filteredResources = resources.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );
  const images = [
    {
      src: "/miadp-pso.jpg",
      alt: "miadp-pso logo",
    },
    {
      src: "/miadp-region-ix.jpg",
      alt: "miadp-region-ix logo",
    },
    {
      src: "/miadp-region-x.jpg",
      alt: "miadp-region-x logo",
    },
    {
      src: "/miadp-region-xi.jpg",
      alt: "miadp-region-xi logo",
    },
    {
      src: "/miadp-region-xii.jpg",
      alt: "miadp-region-xii logo",
    },
    {
      src: "/miadp-region-xiii.jpg",
      alt: "miadp-region-xiii logo",
    },
    {
      src: "/miadp-barmm.jpg",
      alt: "miadp-barmm logo",
    },
  ];

  const particlesInit = useCallback(async (engine: Engine) => {
    console.log(engine);
    await loadSlim(engine); // Initialize the slim version
  }, []);

  const particlesLoaded = useCallback(async (container: any) => {
    console.log(container);
  }, []);

  const { resolvedTheme, setTheme } = useTheme();
  return (
    <div className="h-full w-full flex flex-col items-center">
      <div className="z-0">
        <Particles
          id="tsparticles"
          style={{
            zIndex: "-1",
            position: "fixed",
            width: "100%",
            height: "100%",
          }}
          init={particlesInit}
          loaded={particlesLoaded}
          options={{
            fpsLimit: 120,
            interactivity: {
              events: {
                onHover: { enable: true, mode: "grab" },
                resize: true,
              },
              modes: {
                grab: {
                  distance: 150,
                  links: { opacity: 1 },
                },
              },
            },
            particles: {
              color: {
                value: resolvedTheme == "light" ? "#000000" : "#ffffff",
              },
              links: {
                color: resolvedTheme == "light" ? "#000000" : "#ffffff",
                distance: 150,
                enable: true,
                opacity: 0.3,
                width: 1,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: { default: "bounce" },
                random: false,
                speed: 0.5,
                straight: false,
              },
              number: {
                density: { enable: true, area: 1500 },
                value: 100,
              },
              opacity: { value: 0.5 },
              size: { value: 2 },
            },
            detectRetina: true,
          }}
        />
      </div>
      <div className="flex flex-row justify-center min-h-[182px] w-full gap-4 p-4">
        {images.map((image, index) => (
          <Image
            className="rounded-xl shrink-0"
            key={index}
            src={image.src}
            alt={image.alt}
            width={150}
            height={150}
            priority
          />
        ))}
      </div>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="p-6 mb-2 w-[1150px] relative inset-0 bg-black bg-opacity-60 backdrop-blur-lg rounded-2xl shadow-2xl overflow-y-auto 
  before:absolute before:inset-0 before:bg-gradient-to-br before:from-blue-500 before:to-purple-700 before:opacity-30 before:blur-xl before:-z-10"
        >
          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`w-full flex flex-row justify-between items-start ${
              activeResource ? "hidden" : ""
            }`}
          >
            {/* Sun Icon (Light Mode) */}
            <motion.div
              whileHover={{ scale: 1.2, rotate: 15 }}
              whileTap={{ scale: 0.9, rotate: -15 }}
              className="cursor-pointer"
              onClick={() => setTheme("light")}
            >
              <FaSun className="text-yellow-400 text-2xl" />
            </motion.div>

            {/* Title */}
            <Label className="text-3xl flex flex-row font-bold text-center mb-6 text-white shadow-lg tracking-wider">
              🌟 MIADP 1-Stop Shop Links 🔗
            </Label>

            {/* Moon Icon (Dark Mode) */}
            <motion.div
              whileHover={{ scale: 1.2, rotate: -15 }}
              whileTap={{ scale: 0.9, rotate: 15 }}
              className="cursor-pointer"
              onClick={() => setTheme("dark")}
            >
              <FaMoon className="text-gray-400 text-2xl" />
            </motion.div>
          </motion.div>

          {activeResource ? (
            <motion.div key={activeResource.type} className="relative">
              <Button
                onClick={() => setActiveResource(null)}
                className="mb-4 flex items-center gap-2 text-white"
                variant={"link"}
              >
                <ArrowLeft size={18} /> Back
              </Button>
              <ResourceComponent
                {...activeResource}
                icon={iconMap[activeResource.type]}
              />
            </motion.div>
          ) : (
            <>
              <Input
                placeholder="🔎 Search resources..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-4 border-2 rounded-lg p-2 shadow-sm focus:ring-2 pl-4 bg-white"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredResources.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="shadow-lg rounded-lg border transition hover:shadow-xl">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          {iconMap[item.type]}
                          {item.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-2">
                          {item.description}
                        </p>
                        <Button
                          onClick={() => setActiveResource(item)}
                          className="w-full"
                        >
                          View 🚀
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
