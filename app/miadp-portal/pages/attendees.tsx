import React from "react";
import { motion } from "framer-motion";
import { UserCircle } from "lucide-react";

const attendees = [
  {
    id: 1,
    name: "Engr. Cristy P. Polido",
    position: "Deputy Project Director",
    region: "Project Support Office",
  },
  {
    id: 2,
    name: "Engr. Julius J. Oliveros",
    position: "Infrastructure Development Head",
    region: "Project Support Office",
  },
  {
    id: 3,
    name: "Larry C. Agpalo",
    position: "AD Enterprise Head",
    region: "Project Support Office",
  },
  {
    id: 4,
    name: "Nelson C. Faustino",
    position: "PMEU Head",
    region: "Project Support Office",
  },
  {
    id: 5,
    name: "Alfred Adrian O. Basino",
    position: "E&S Unit Head",
    region: "Project Support Office",
  },
  {
    id: 6,
    name: "Engr. Arniel A. Sosa",
    position: "Procurement Unit Head",
    region: "Project Support Office",
  },
  {
    id: 7,
    name: "Marieane E. Nasibog",
    position: "Finance Unit Head",
    region: "Project Support Office",
  },
  {
    id: 8,
    name: "Nelda R. Cacuyog",
    position: "Administrative Unit Head",
    region: "Project Support Office",
  },
  {
    id: 9,
    name: "Errol Robyn M. Abella",
    position: "Programmer",
    region: "Project Support Office",
  },
];

const Attendees = () => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 shadow-xl rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center dark:text-white">
        📋 Attendees List
      </h2>

      {/* Animated Attendees List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        {attendees.map((attendee) => (
          <motion.div
            key={attendee.id}
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: attendee.id * 0.1 }}
            className="flex items-center bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md"
          >
            <UserCircle className="text-blue-500 dark:text-gray-300 w-10 h-10 mr-4" />
            <div>
              <h3 className="text-lg font-semibold dark:text-white">
                {attendee.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {attendee.position}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                📍 {attendee.region}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Attendees;
