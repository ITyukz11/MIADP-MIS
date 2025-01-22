"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { RepositoryCard } from "./RepositoryCard";

export function RepositoryList({
  repositories,
}: {
  repositories: Array<{
    title: string;
    description: string;
    link: string;
    childLinks: {};
  }>;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const filteredRepositories = repositories.filter(
    (repo) =>
      repo.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      repo.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const fadeInOutVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  };

  return (
    <div className="py-8 flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-6">
        MIADP E-Library Repository Links
      </h2>

      {/* Search Bar */}
      <Input
        placeholder="Search repositories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full sm:w-1/2 mb-6 bg-white dark:bg-black"
      />

      {/* Repository List */}
      <div className="flex flex-row flex-wrap gap-2">
        <AnimatePresence>
          {filteredRepositories.map((repo, index) => (
            <motion.div
              key={index} // Ensure unique keys
              initial="initial"
              animate="animate"
              exit="exit"
              variants={fadeInOutVariants}
              transition={{
                duration: 0.3,
                staggerChildren: 0.1,
                type: "spring",
              }}
              layout
            >
              <RepositoryCard
                title={repo.title}
                description={repo.description}
                link={repo.link}
                childLinks={repo.childLinks}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* No Results Found */}
      {filteredRepositories.length === 0 && (
        <p className="text-gray-500 mt-4">No repositories found.</p>
      )}
    </div>
  );
}
