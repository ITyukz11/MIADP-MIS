"use client";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import Image from "next/image";

const programSchedule = [
  {
    day: "Day 0",
    time: "1:00 pm - 5:00 pm",
    activity: "Arrival of PSO and RPCOs",
    focalPerson: "PSO and RPCO Coordination Meeting",
  },
  {
    day: "Day 1",
    time: "8:00 am - 8:15 am",
    activity: "Registration",
    focalPerson: "PSO",
  },
  {
    day: "Day 1",
    time: "8:15 am - 8:45 am",
    activity: "Opening Preliminaries",
    focalPerson: "PSO",
  },
  {
    day: "Day 1",
    time: "8:15 am - 8:45 am",
    activity: "Welcome Remarks",
    focalPerson: "Dir. Macario D. Gonzaga",
  },
  {
    day: "Day 1",
    time: "8:45 am - 9:30 am",
    activity: "MIADP Overall Progress Updates",
    focalPerson: "Engr. Cristy Cecilia P. Polido",
  },
  {
    day: "Day 2",
    time: "8:00 am - 8:15 am",
    activity: "Recap and Preliminaries",
    focalPerson: "PSO",
  },
  {
    day: "Day 3",
    time: "8:00 am - 8:15 am",
    activity: "Recap and Preliminaries",
    focalPerson: "PSO",
  },
];

export default function Program() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-5xl mx-auto bg-background rounded-md"
    >
      <div className="flex flex-col justify-center items-center mb-4">
        <Label className="font-semibold text-xl">
          Mindanao Inclusive Agriculture Development Project
        </Label>
        <Label className="font-semibold text-xl">
          INTERIM FOLLOW-ON TECHNICAL SUPPORT MISSION TO
        </Label>
        <Label className="font-semibold text-xl">
          MINDANAO INCLUSIVE AGRICULTURE DEVELOPMENT PROJECT
        </Label>
        <Label className="text-lg italic">April 2-4, 2025</Label>
        <Label className="text-lg italic">
          Bureau of Agriculture and Fisheries Standards, Diliman, Quezon City
        </Label>
      </div>

      <div className="overflow-x-auto border-2 border-white rounded-xl">
        <table className="w-full border-collapse border border-gray-300 shadow-md rounded-lg">
          <thead>
            <tr className="bg-[#185682] text-white">
              <th className="p-3 border border-gray-300">Day</th>
              <th className="p-3 border border-gray-300">Time</th>
              <th className="p-3 border border-gray-300">Activity</th>
              <th className="p-3 border border-gray-300">Focal Person</th>
            </tr>
          </thead>
          <tbody>
            {programSchedule.map((item, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border border-gray-300 text-center"
              >
                <td className="p-3 border border-gray-300">{item.day}</td>
                <td className="p-3 border border-gray-300">{item.time}</td>
                <td className="p-3 border border-gray-300">{item.activity}</td>
                <td className="p-3 border border-gray-300">
                  {item.focalPerson}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
