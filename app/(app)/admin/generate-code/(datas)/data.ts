export const codeComponent = [
  { label: "Infrastructure", value: "IN" },
  { label: "Enterprise", value: "EN" },
];

export const codeRegion = [
  { label: "RPCO 9", value: "RO09" },
  { label: "RPCO 10", value: "RO10" },
  { label: "RPCO 11", value: "RO11" },
  { label: "RPCO 12", value: "RO12" },
  { label: "RPCO 13", value: "RO13" },
  { label: "BARMM", value: "RBRM" },
];

export const codeProvince = [
  { label: "Agusan del Norte", value: "ADN", region: "RO13" },
  { label: "Agusan del Sur", value: "ADS", region: "RO13" },
  { label: "Basilan", value: "BAS", region: "RBRM" },
  { label: "Bukidnon", value: "BUK", region: "RO10" },
  { label: "Camiguin", value: "CAM", region: "RO10" },
  { label: "Davao de Oro", value: "DOR", region: "RO11" },
  { label: "Davao del Norte", value: "DDN", region: "RO11" },
  { label: "Davao del Sur", value: "DDS", region: "RO11" },
  { label: "Davao Occidental", value: "DVO", region: "RO11" },
  { label: "Davao Oriental", value: "DOC", region: "RO11" },
  { label: "Dinagat Islands", value: "DIN", region: "RO13" },
  { label: "Lanao del Norte", value: "LDN", region: "RO10" },
  { label: "Lanao del Sur", value: "LDS", region: "RBRM" },
  { label: "Maguindanao del Norte", value: "MGN", region: "RBRM" },
  { label: "Maguindanao del Sur", value: "MGS", region: "RBRM" },
  { label: "Misamis Occidental", value: "MOC", region: "RO10" },
  { label: "Misamis Oriental", value: "MOR", region: "RO10" },
  { label: "North Cotabato", value: "COT", region: "RO12" },
  { label: "Sarangani", value: "SAR", region: "RO12" },
  { label: "South Cotabato", value: "SOC", region: "RO12" },
  { label: "Sultan Kudarat", value: "SKU", region: "RO12" },
  { label: "Surigao del Norte", value: "SDN", region: "RO13" },
  { label: "Surigao del Sur", value: "SDS", region: "RO13" },
  { label: "Sulu", value: "SLU", region: "RBRM" },
  { label: "Tawi-Tawi", value: "TTI", region: "RBRM" },
  { label: "Zamboanga del Norte", value: "ZDN", region: "RO09" },
  { label: "Zamboanga del Sur", value: "ZDS", region: "RO09" },
  { label: "Zamboanga Sibugay", value: "ZSI", region: "RO09" },
];

export const codeType = [
  { label: "Farm to Market Road", value: "FRD", type: "IN" },
  { label: "Bridges", value: "BRD", type: "IN" },
  { label: "Tramline", value: "TRL", type: "IN" },
  { label: "Small Scale Irrigation Project", value: "SIR", type: "IN" },
  { label: "Potable Water System", value: "PWS", type: "IN" },
  { label: "Post Harvest Infrastructure", value: "PHF", type: "IN" },
  { label: "Micro", value: "MI", type: "EN" },
  { label: "Small", value: "SM", type: "EN" },
  { label: "Medium", value: "ME", type: "EN" },
];

export const codeAncestralDomain = [
  {
    label: "Subanen",
    value: "DUM",
    region: "RO09",
    municipality: "Dumingag, Mahayag, Siayan",
  },
  {
    label: "Higaonon-Kalanawan",
    value: "KAL",
    region: "RO10",
    municipality: "Malitbog, Manolo Fortrich, Gingoog City",
  },
  {
    label: "Bukidnon-Tagolaonen",
    value: "IMP",
    region: "RO10",
    municipality: "Impasugong",
  },
  {
    label: "Ata-Manobo",
    value: "TAL",
    region: "RO11",
    municipality: "Sto. Tomas, Kapalong, San Isidro, Talaingod",
  },
  {
    label: "Blaan-Tagakaulo",
    value: "MAL",
    region: "RO11",
    municipality: "Malita",
  },
  { label: "Obo-Manovu", value: "MAG", region: "RO12", municipality: "Magpet" },
  {
    label: "Manobo Dulangan",
    value: "SEN",
    region: "RO12",
    municipality: "Senator Ninoy Aquino, Kalamansig, Palimbang",
  },
  { label: "Manobo", value: "ROS", region: "RO13", municipality: "Rosario" },
  { label: "Manobo", value: "BUN", region: "RO13", municipality: "Bunawan" },
  {
    label: "Sama-Bangingi",
    value: "SAM",
    region: "RBRM",
    municipality: "Hadji Muhtamad",
  },
  { label: "Lintangan", value: "LIN", region: "RO09", municipality: "Sibuco" },
  { label: "Anongan", value: "ANO", region: "RO09", municipality: "Sibuco" },
  {
    label: "Daraghuyan",
    value: "DAR",
    region: "RO10",
    municipality: "Malaybalay City, Bukidnon",
  },
  {
    label: "Cebukta",
    value: "CEB",
    region: "RO10",
    municipality: "Valencia City",
  },
  {
    label: "Mansaka",
    value: "PAN",
    region: "RO11",
    municipality: "Maragusan, Nabunturan, Maco, Mabini, Pantukan, Mawab",
  },
  {
    label: "Erumanen Menuvu",
    value: "PIG",
    region: "RO12",
    municipality: "Pigcawayan",
  },
  {
    label: "Blaan-Tagakaulo",
    value: "PAL",
    region: "RO12",
    municipality: "Palimbang",
  },
  {
    label: "Blaan-Tagakaulo",
    value: "MAU",
    region: "RO12",
    municipality: "Malungon",
  },
  {
    label: "Tboli & Blaan",
    value: "TBO",
    region: "RO12",
    municipality:
      "Tboli, Surallah, Polomolok, Tupi, Maasim & Maitum (Sarangani)",
  },
  { label: "Manobo", value: "SNM", region: "RO13", municipality: "San Miguel" },
  {
    label: "Mamanwa",
    value: "MAI",
    region: "RO13",
    municipality: "Mainit, Malimono, San Francisco, Sison, Surigao City",
  },
  {
    label: "Mamanwa",
    value: "REM",
    region: "RO13",
    municipality: "Remedios T. Romualdez",
  },
  {
    label: "Teduray and Lambangian ICC",
    value: "TED",
    region: "RBRM",
    municipality:
      "Talayan, Guindulangan, Datu Unsay, Datu Hofer, Ampatuan & South Upi",
  },
];
