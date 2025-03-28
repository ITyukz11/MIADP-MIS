import React from "react";
import { motion } from "framer-motion";
import { UserCircle } from "lucide-react";

const attendees = [
  // 🌟 World Bank (VIP) 🌟
  {
    name: "Maria Theresa G. Quinones",
    gender: "Female",
    position: "Senior Rural Development Specialist and Task Team Leader",
    category: "World Bank",
  },
  {
    name: "Paula Beatrice M. Macandog",
    gender: "Female",
    position: "Agriculture Economist and Co-Task Team Leader",
    category: "World Bank",
  },
  {
    name: "Son Van Nguyen",
    gender: "Male",
    position: "Senior Environmental Specialist",
    category: "World Bank",
  },
  {
    name: "Anabelle Vitti C. Valenzuela",
    gender: "Female",
    position: "Social Development Specialist",
    category: "World Bank",
  },
  {
    name: "Dominic R. Aumentado",
    gender: "Male",
    position: "Senior Procurement Specialist",
    category: "World Bank",
  },
  {
    name: "Tomas A. Sta. Maria",
    gender: "Male",
    position: "Senior Financial Management Specialist",
    category: "World Bank",
  },
  {
    name: "Mildred H.Penales",
    gender: "Female",
    position: "Program Assistant",
    category: "World Bank",
  },
  {
    name: "Maria Loreto N. Padua",
    gender: "Female",
    position: "Senior Social Development Specialist (Consultant)",
    category: "World Bank",
  },
  {
    name: "Raoul J. Azanza",
    gender: "Male",
    position: "Rural Infrastructure Engineer (Consultant)",
    category: "World Bank",
  },
  {
    name: "Gomer Tumbali",
    gender: "Male",
    position: "Rural Enterprise Specialist (Consultant)",
    category: "World Bank",
  },
  {
    name: "Luningning J. Bondoc",
    gender: "Female",
    position: "Economist (Consultant)",
    category: "World Bank",
  },
  {
    name: "Mario M Orilla",
    gender: "Male",
    position: "Procurement (Consultant)",
    category: "World Bank",
  },
  {
    name: "Cessar Umali, Jr",
    gender: "Male",
    position: "M&E Specialist (Consultant)",
    category: "World Bank",
  },
  // PSO Attendees
  {
    name: "Cristy Cecilia P. Polido",
    gender: "Female",
    position: "Deputy Project Director",
    category: "PSO",
  },
  {
    name: "Errol Robyn M. Abella",
    gender: "Male",
    position: "Programmer",
    category: "PSO",
  },
  {
    name: "Joy Grecia",
    gender: "Female",
    position: "Social Preparation Head",
    category: "PSO",
  },
  {
    name: "Engr. Julius Oliveros",
    gender: "Male",
    position: "Infrastructure Development Head",
    category: "PSO",
  },
  {
    name: "Larry Agpalo",
    gender: "Male",
    position: "AD Enterprise Head",
    category: "PSO",
  },
  {
    name: "Nelson Faustino",
    gender: "Male",
    position: "PMEU Head",
    category: "PSO",
  },
  {
    name: "Alfred Adrian Basino",
    gender: "Male",
    position: "E&S Unit Head",
    category: "PSO",
  },
  {
    name: "Arniel Sosa",
    gender: "Male",
    position: "Procurement Head",
    category: "PSO",
  },
  {
    name: "Crispy Patawaran",
    gender: "Male",
    position: "SES Officer",
    category: "PSO",
  },
  {
    name: "Nelda Cacuyog",
    gender: "Female",
    position: "Admin Unit Head",
    category: "PSO",
  },

  // RPCO IX
  {
    name: "Engr. Marcos C. Aves, SR.",
    gender: "Male",
    position: "Project Director",
    category: "RPCO IX",
  },
  {
    name: "Engr. JESRIEL P. DIAZ",
    gender: "Male",
    position: "Infra Dev’t Specialist",
    category: "RPCO IX",
  },

  // RPCO X
  {
    name: "Lana May S. Racines",
    gender: "Female",
    position: "Deputy Project Director",
    category: "RPCO X",
  },
  {
    name: "Jose Apollo Y. Pacamalan",
    gender: "Male",
    position: "Project Director",
    category: "RPCO X",
  },

  // RPCO XI
  {
    name: "Zabdiel L. Zacarias",
    gender: "Male",
    position: "Deputy Project Director",
    category: "RPCO XI",
  },
  {
    name: "Aime S. Tumbaga",
    gender: "Female",
    position: "AO II / Budget Analyst",
    category: "RPCO XI",
  },

  // RPCO XII
  {
    name: "Maria Cecilia Frando",
    gender: "Female",
    position: "Deputy Project Director",
    category: "RPCO XII",
  },
  {
    name: "Lyman Dalipe",
    gender: "Male",
    position: "M&E Officer",
    category: "RPCO XII",
  },

  // RPCO XIII
  {
    name: "Arlan Mangelen",
    gender: "Male",
    position: "Project Director",
    category: "RPCO XIII",
  },
  {
    name: "Roberto Hipolao Jr",
    gender: "Male",
    position: "Component 1 Head",
    category: "RPCO XIII",
  },
  {
    name: "Kathleen Lorraine R Sabaldan",
    gender: "Female",
    position: "M&E Unit Head",
    category: "RPCO XIII",
  },
  {
    name: "Ronald Galano",
    gender: "Male",
    position: "IDS",
    category: "RPCO XIII",
  },

  // BARMM
  {
    name: "Datu Hamsur Zaid",
    gender: "Male",
    position: "Component 3 Head",
    category: "BARMM",
  },
  {
    name: "Jahan Panugo",
    gender: "Female",
    position: "Social Preparation Specialist",
    category: "BARMM",
  },

  // SPCMAD
  {
    name: "Roger V. Navarro",
    gender: "Male",
    position: "USEC for Ops",
    category: "SPCMAD",
  },
  {
    name: "Angelita D. Martir",
    gender: "Female",
    position: "Chief, SPCMAD",
    category: "SPCMAD",
  },
  {
    name: "Batsheba Aparilla",
    gender: "Female",
    position: "DMO IV, SPCMAD",
    category: "SPCMAD",
  },
  {
    name: "Evelyn Valeriano",
    gender: "Female",
    position: "DMO III, SPCMAD",
    category: "SPCMAD",
  },
  {
    name: "Jan Pauline Albat",
    gender: "Female",
    position: "DMO II, SPCMAD",
    category: "SPCMAD",
  },
];

const categoryColors: Record<string, string> = {
  PSO: "bg-blue-100 dark:bg-blue-900 border-blue-400 dark:border-blue-600",
  "RPCO IX":
    "bg-green-100 dark:bg-green-900 border-green-400 dark:border-green-600",
  "RPCO X":
    "bg-purple-100 dark:bg-purple-900 border-purple-400 dark:border-purple-600",
  "RPCO XI":
    "bg-yellow-100 dark:bg-yellow-900 border-yellow-400 dark:border-yellow-600",
  "RPCO XII":
    "bg-orange-100 dark:bg-orange-900 border-orange-400 dark:border-orange-600",
  "RPCO XIII":
    "bg-teal-100 dark:bg-teal-900 border-teal-400 dark:border-teal-600",
  BARMM: "bg-red-100 dark:bg-red-900 border-red-400 dark:border-red-600",
  SPCMAD: "bg-pink-100 dark:bg-pink-900 border-pink-400 dark:border-pink-600",

  // ✨ VIP Styling for World Bank
  "World Bank":
    "bg-gradient-to-r from-gray-300 to-gray-100 dark:from-gray-700 dark:to-gray-900 border-gray-500 dark:border-gray-400 text-black dark:text-white shadow-xl",
};

const groupedAttendees = attendees.reduce((acc, attendee) => {
  if (!acc[attendee.category]) {
    acc[attendee.category] = [];
  }
  acc[attendee.category].push(attendee);
  return acc;
}, {} as Record<string, typeof attendees>);

const Attendees = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 shadow-xl rounded-lg">
      {/* Auto-fit columns dynamically */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-cols-fr">
        {Object.entries(groupedAttendees).map(([category, attendees]) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4 w-full"
          >
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold dark:text-white">
              {category}
            </h3>

            {attendees.map((attendee) => (
              <motion.div
                key={attendee.name}
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.1 }}
                className={`flex items-center p-4 rounded-lg shadow-md border-2 hover:border-blue-950 ${
                  categoryColors[attendee.category] ||
                  "bg-gray-100 dark:bg-gray-800"
                }`}
              >
                <UserCircle className="text-blue-500 dark:text-gray-300 w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 mr-4" />
                <div>
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold dark:text-white">
                    {attendee.name}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">
                    {attendee.position}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
export default Attendees;
