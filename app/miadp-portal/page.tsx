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
import MIADPPortalGallery from "./pages/gallery";

const resources = [
  {
    type: "video",
    title: "Video Highlights",
    description: "Watch the key moments from our latest event.",
  },

  {
    type: "image",
    title: "Photo Gallery",
    description: "Browse high-quality images from the event.",
  },
  {
    type: "presentation",
    title: "Presentations",
    description: "View the slides from the keynote presentation.",
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

  if (type === "image") return <MIADPPortalGallery />;
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-background shadow-lg rounded-md"
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
    // {
    //   src: "/miadp-pso.jpg",
    //   alt: "miadp-pso logo",
    // },
    {
      src: "/miadp-region-ix.jpg",
      alt: "miadp-region-ix logo",
      href: "https://www.facebook.com/da.miadp9",
    },
    {
      src: "/miadp-region-x.jpg",
      alt: "miadp-region-x logo",
      href: "https://www.facebook.com/miadprpco10",
    },
    {
      src: "/miadp-region-xi.jpg",
      alt: "miadp-region-xi logo",
      href: "https://www.facebook.com/miadp11",
    },
    {
      src: "/miadp-region-xii.jpg",
      alt: "miadp-region-xii logo",
      href: "https://www.facebook.com/miadp.rpco12",
    },
    {
      src: "/miadp-region-xiii.jpg",
      alt: "miadp-region-xiii logo",
      href: "https://www.facebook.com/miadprpco13",
    },
    {
      src: "/miadp-barmm.jpg",
      alt: "miadp-barmm logo",
      href: "https://www.facebook.com/miadpbarmm",
    },
  ];

  const images2 = [
    {
      src: "/logos/bagong-pilipinas.png",
      alt: "bagong pilipinas.png",
      href: "https://www.bagongpilipinastayo.com/",
    },
    {
      src: "/logos/dept-agri.png",
      alt: "department of agriculture logo",
      href: "https://www.da.gov.ph/",
    },
    {
      src: "/logos/world-bank.png",
      alt: "world bank logo",
      href: "https://www.worldbank.org/ext/en/home",
    },
    {
      src: "/logos/ncip-logo.png",
      alt: "ncip logo",
      href: "https://ncip.gov.ph/",
    },
    {
      src: "/MIADP-Assistant.png",
      alt: "miadp official logo",
      href: "https://chatgpt.com/g/g-X44lhvrfy-miadp-assistant",
    },
    {
      src: "/logos/yuki-logo.png",
      alt: "Yukz D. Programmer Logo",
      href: "https://www.facebook.com/imbayuki/",
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
    <div className="h-full w-full flex flex-col items-center min-w-[320px]">
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

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="p-6 mb-2 w-full relative overflow-y-auto min-w-[320px]"
        >
          <motion.div
            whileHover={{ scale: 1.2, rotate: -25 }}
            whileTap={{ scale: 0.9, rotate: 70 }}
            className="cursor-pointer absolute right-5 top-5 z-10"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
          >
            {resolvedTheme === "dark" ? (
              <FaSun className="text-yellow-400 text-2xl" />
            ) : (
              <FaMoon className="text-gray-400 text-2xl" />
            )}
          </motion.div>
          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`w-full flex flex-col md:flex-row justify-center items-center gap-4 p-4 ${
              activeResource ? "hidden" : ""
            }`}
          >
            {/* Left Icons (Hidden in Mobile) */}
            <div className="hidden md:flex flex-row justify-center items-center gap-2">
              {images.map((image, index) => (
                <a
                  key={index}
                  href={image.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <motion.div
                    whileHover={{
                      scale: 1.15,
                      boxShadow: "0px 4px 15px rgba(0, 123, 255, 0.6)", // Blue glow effect
                      borderRadius: "12px",
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="rounded-xl"
                  >
                    <Image
                      className="rounded-xl shrink-0"
                      src={image.src}
                      alt={image.alt}
                      width={50}
                      height={50}
                      priority
                    />
                  </motion.div>
                </a>
              ))}
            </div>
            {/* Title */}
            <div className="text-center">
              <Label className="text-2xl md:text-3xl font-bold text-center tracking-wider ">
                MIADP PORTAL
              </Label>
              <div className="w-32 mx-auto h-1 bg-blue-800 rounded-full my-2"></div>
            </div>
            {/* Right Icons (Hidden in Mobile) */}
            <div className="hidden md:flex flex-row justify-center items-center gap-2">
              {images2.map((image, index) => (
                <a
                  key={index}
                  href={image.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <motion.div
                    whileHover={{
                      scale: 1.15,
                      boxShadow: "0px 4px 15px rgba(0, 123, 255, 0.6)", // Blue glow effect
                      borderRadius: "12px",
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="rounded-xl"
                  >
                    <Image
                      className="rounded-xl shrink-0"
                      src={image.src}
                      alt={image.alt}
                      width={50}
                      height={50}
                      priority
                    />
                  </motion.div>
                </a>
              ))}
            </div>
          </motion.div>

          {activeResource ? (
            <motion.div
              key={activeResource.type}
              className="relative w-full pt-14 md:pt-0"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {/* Title Section */}
              <div className="text-center">
                <Label className="text-2xl md:text-3xl font-bold text-center tracking-wider">
                  {activeResource.title}
                </Label>
                <div className="w-20 mx-auto h-1 bg-blue-500 rounded-full my-2"></div>
              </div>

              {/* Back Button */}
              <div className="absolute left-0 -top-5">
                <button
                  className="bg-transparent text-center w-48 rounded-2xl h-14 relative text-white text-xl 
                  font-semibold group flex items-center justify-center mx-auto mt-4 hover:bg-blue-500 
                  dark:hover:bg-gray-800/50 transition-all duration-300"
                  type="button"
                  onClick={() => setActiveResource(null)}
                >
                  <div
                    className="bg-blue-950 dark:bg-blue-700 rounded-xl h-12 w-1/4 flex items-center justify-center 
                  absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 1024 1024"
                      height="25px"
                      width="25px"
                    >
                      <path
                        d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>
                  <p className="translate-x-2">Go Back</p>
                </button>
              </div>

              {/* Resource Component */}
              <div className="pt-6">
                <ResourceComponent
                  {...activeResource}
                  icon={iconMap[activeResource.type]}
                />
              </div>
            </motion.div>
          ) : (
            <>
              <Input
                placeholder="🔎 Search resources..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-4 border-2 rounded-lg h-12 text-lg p-4 shadow-sm focus:ring-2 pl-5 bg-background"
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
                          className="bg-blue-950 dark:bg-blue-950 text-blue-400 border border-blue-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
                        >
                          <span className="bg-blue-400 shadow-blue-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                          View
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
