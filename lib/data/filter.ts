// export const FilterMenus = [
//     { text: 'ALL', variant: 'default' },
//     { text: 'PSO', variant: 'outline' },
//     { text: 'Region 9', variant: 'outline' },
//     { text: 'Region 10', variant: 'outline' },
//     { text: 'Region 11', variant: 'outline' },
//     { text: 'Region 12', variant: 'outline' },
//     { text: 'Region 13', variant: 'outline' },
//     { text: 'Component 1', variant: 'outline' },
//     { text: 'Component 2', variant: 'outline' },
//     { text: 'Component 3', variant: 'outline' },
//     { text: 'Component 4', variant: 'outline' },
//     { text: 'MEL', variant: 'outline' },
//     { text: 'SES', variant: 'outline' },
//     { text: 'GGU', variant: 'outline' },
//     { text: 'ADMIN', variant: 'outline' },
//     { text: 'FINANCE', variant: 'outline' },
//     { text: 'PROC', variant: 'outline' },
//     { text: 'ODPD', variant: 'outline' }
// ];

export const componentOptions = [
  "Component 1",
  "Component 2",
  "Component 3",
  "Component 4",
];

export const unitOptions = [
  { value: "ODPD", label: "ODPD" },
  { value: "ODPD - Info Links", label: "ODPD - Info Links" },
  { value: "Finance", label: "FINANCE" },
  { value: "Admin", label: "ADMIN" },
  { value: "Procurement", label: "Procurement" },
  { value: "GGU", label: "GGU" },
  { value: "SES", label: "SES" },
  { value: "PMEU", label: "PMEU" },
  { value: "Economics", label: "Economics" },
  { value: "Communication Advocacy", label: "Communication Advocacy" },
  { value: "Legal", label: "Legal" },
  { value: "Secretary", label: "Secretary" },
  { value: " ", label: "Not Applicable" },
];

export const regionOptions = [
  "PSO",
  "RPCO 9",
  "RPCO 10",
  "RPCO 11",
  "RPCO 12",
  "RPCO 13",
  "BARMM",
];

export const PSAMindanaoRegions = [
  { label: "Zamboanga Peninsula", value: "Zamboanga Peninsula", code: "090000000" },
  { label: "Northern Mindanao", value: "Northern Mindanao",code: "100000000" },
  { label: "Davao Region", value: "Davao Region", code: "110000000" },
  { label: "SOCCSKSARGEN",value: "SOCCSKSARGEN", code: "120000000" },
  { label: "Caraga", value: "Caraga", code: "160000000" },
  { label: "Bangsamoro",  value: "Bangsamoro",code: "150000000" },
];

export const mindanaoProvinces = [
  // Zamboanga Peninsula
  { code: "097200000", value: "Zamboanga Del Norte", region: "Zamboanga Peninsula", label: "Zamboanga Del Norte" },
  { code: "097300000", value: "Zamboanga Del Sur", region: "Zamboanga Peninsula", label: "Zamboanga Del Sur" },
  { code: "098300000", value: "Zamboanga Sibugay", region: "Zamboanga Peninsula", label: "Zamboanga Sibugay" },

  // Northern Mindanao
  { code: "101300000", value: "Bukidnon", region: "Northern Mindanao", label: "Bukidnon" },
  { code: "101800000", value: "Camiguin", region: "Northern Mindanao", label: "Camiguin" },
  { code: "103500000", value: "Lanao Del Norte", region: "Northern Mindanao", label: "Lanao Del Norte" },
  { code: "104200000", value: "Misamis Occidental", region: "Northern Mindanao", label: "Misamis Occidental" },
  { code: "104300000", value: "Misamis Oriental", region: "Northern Mindanao", label: "Misamis Oriental" },

  // Davao Region
  { code: "112300000", value: "Davao Del Norte", region: "Davao Region", label: "Davao Del Norte" },
  { code: "112400000", value: "Davao Del Sur", region: "Davao Region", label: "Davao Del Sur" },
  { code: "112500000", value: "Davao Oriental", region: "Davao Region", label: "Davao Oriental" },
  { code: "118200000", value: "Davao De Oro", region: "Davao Region", label: "Davao De Oro" },
  { code: "118600000", value: "Davao Occidental", region: "Davao Region", label: "Davao Occidental" },

  // SOCCSKSARGEN
  { code: "124700000", value: "Cotabato", region: "SOCCSKSARGEN", label: "Cotabato" },
  { code: "126300000", value: "South Cotabato", region: "SOCCSKSARGEN", label: "South Cotabato" },
  { code: "126500000", value: "Sultan Kudarat", region: "SOCCSKSARGEN", label: "Sultan Kudarat" },
  { code: "128000000", value: "Sarangani", region: "SOCCSKSARGEN", label: "Sarangani" },

  // Caraga
  { code: "160200000", value: "Agusan Del Norte", region: "Caraga", label: "Agusan Del Norte" },
  { code: "160300000", value: "Agusan Del Sur", region: "Caraga", label: "Agusan Del Sur" },
  { code: "166700000", value: "Surigao Del Norte", region: "Caraga", label: "Surigao Del Norte" },
  { code: "166800000", value: "Surigao Del Sur", region: "Caraga", label: "Surigao Del Sur" },
  { code: "168500000", value: "Dinagat Islands", region: "Caraga", label: "Dinagat Islands" },

  // BARMM
  { code: "150700000", value: "Basilan", region: "BARMM", label: "Basilan" },
  { code: "153600000", value: "Lanao Del Sur", region: "BARMM", label: "Lanao Del Sur" },
  { code: "153800000", value: "Maguindanao", region: "BARMM", label: "Maguindanao" },
  { code: "156600000", value: "Sulu", region: "BARMM", label: "Sulu" },
  { code: "157000000", value: "Tawi-Tawi", region: "BARMM", label: "Tawi-Tawi" },
];

export const mindanaoCities = [
  // Zamboanga Peninsula
  { value: "Dapitan", region: "Zamboanga Peninsula", province: "Zamboanga Del Norte", label: "Dapitan" },
  { value: "Dipolog", region: "Zamboanga Peninsula", province: "Zamboanga Del Norte", label: "Dipolog" },
  { value: "Pagadian", region: "Zamboanga Peninsula", province: "Zamboanga Del Sur", label: "Pagadian" },
  { value: "Zamboanga", region: "Zamboanga Peninsula", province: "Zamboanga City", label: "Zamboanga" },
  { value: "Isabela", region: "Zamboanga Peninsula", province: "Basilan", label: "Isabela" },

  // Northern Mindanao
  { value: "Malaybalay", region: "Northern Mindanao", province: "Bukidnon", label: "Malaybalay" },
  { value: "Valencia", region: "Northern Mindanao", province: "Bukidnon", label: "Valencia" },
  { value: "Iligan", region: "Northern Mindanao", province: "Lanao Del Norte", label: "Iligan" },
  { value: "Oroquieta", region: "Northern Mindanao", province: "Misamis Occidental", label: "Oroquieta" },
  { value: "Ozamiz", region: "Northern Mindanao", province: "Misamis Occidental", label: "Ozamiz" },
  { value: "Tangub", region: "Northern Mindanao", province: "Misamis Occidental", label: "Tangub" },
  { value: "Cagayan De Oro", region: "Northern Mindanao", province: "Misamis Oriental", label: "Cagayan De Oro" },
  { value: "El Salvador", region: "Northern Mindanao", province: "Misamis Oriental", label: "El Salvador" },
  { value: "Gingoog", region: "Northern Mindanao", province: "Misamis Oriental", label: "Gingoog" },

  // Davao Region
  { value: "Panabo", region: "Davao Region", province: "Davao Del Norte", label: "Panabo" },
  { value: "Island Garden City of Samal", region: "Davao Region", province: "Davao Del Norte", label: "Island Garden City of Samal" }, // Kept full value
  { value: "Tagum", region: "Davao Region", province: "Davao Del Norte", label: "Tagum" },
  { value: "Davao", region: "Davao Region", province: "Davao City", label: "Davao" },
  { value: "Digos", region: "Davao Region", province: "Davao Del Sur", label: "Digos" },
  { value: "Mati", region: "Davao Region", province: "Davao Oriental", label: "Mati" },

  // SOCCSKSARGEN
  { value: "Kidapawan", region: "SOCCSKSARGEN", province: "Cotabato", label: "Kidapawan" },
  { value: "General Santos", region: "SOCCSKSARGEN", province: "South Cotabato", label: "General Santos" },
  { value: "Koronadal", region: "SOCCSKSARGEN", province: "South Cotabato", label: "Koronadal" },
  { value: "Tacurong", region: "SOCCSKSARGEN", province: "Sultan Kudarat", label: "Tacurong" },
  { value: "Cotabato", region: "SOCCSKSARGEN", province: "Cotabato", label: "Cotabato" },

  // Caraga
  { value: "Butuan", region: "Caraga", province: "Agusan Del Norte", label: "Butuan" },
  { value: "Cabadbaran", region: "Caraga", province: "Agusan Del Norte", label: "Cabadbaran" },
  { value: "Bayugan", region: "Caraga", province: "Agusan Del Sur", label: "Bayugan" },
  { value: "Surigao", region: "Caraga", province: "Surigao Del Norte", label: "Surigao" },
  { value: "Bislig", region: "Caraga", province: "Surigao Del Sur", label: "Bislig" },
  { value: "Tandag", region: "Caraga", province: "Surigao Del Sur", label: "Tandag" },

  // BARMM
  { value: "Lamitan", region: "BARMM", province: "Basilan", label: "Lamitan" },
  { value: "Marawi", region: "BARMM", province: "Lanao Del Sur", label: "Marawi" },
];

export const positionOptions = [
  "Administrative Aide",
  "Driver/Mechanic",
  "Cash Clerk",
  "Administrative Assistant",
  "Administrative Officer I",
  "Administrative Officer II",
  "Development Management Officer (NCIP)",
  "Project Development Associate",
  "Infrastructure Development Associate",
  "Social Preparation Associate",
  "Supply and Property Officer II",
  "Administrative Officer III",
  "Finance Analyst I",
  "Associate Procurement Officer",
  "Development Facilitator",
  "Finance Analyst II",
  "Budget Officer",
  "Procurement Officer",
  "Media Production Officer",
  "GIS Officer",
  "Social/Environmental Safeguards Officer",
  "Grievance Redress Officer",
  "Programmer",
  "M&E Officer",
  "Business Development Officer",
  "Planning & Social Preparation Officer",
  "Infrastructure Development Engineer",
  "Economist",
  "Cashier",
  "Finance Analyst III / Finance Specialist",
  "Procurement Specialist",
  "Knowledge Management Specialist",
  "Management Information System Specialist",
  "Enterprise Development Specialist",
  "Business Development Specialist",
  "Infrastructure Development Specialist",
  "Social Preparation Specialist",
  "Planning Specialist",
  "Planning & Social Preparation Specialist",
  "Communications and Advocacy Specialist",
  "Legal Officer",
  "Accountant",
  "Admin Unit Head",
  "Finance Unit Head",
  "M&E Unit Head",
  "Procurement Unit Head",
  "SES Unit Head",
  "Component 4 Head",
  "Component 3 Head",
  "Component 2 Head",
  "Deputy Project Director",
  "Project Director",
];

export const statusOptions = [
  "Upcoming",
  "Ongoing",
  "Completed",
  "Cancelled",
  "Postponed",
];

export const wfpYearOptions = ["2023", "2024", "2025", "2026", "2027", "2028"];

export const monthOptions = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const correspondencePurposeOptions = [
  "For compliance",
  "Give Priority/RUSH/URGENT",
  "For appropriate action pls.",
  "For your information & reference",
  "For your comments/recommendation",
  "For your files",
  "For review",
  "Pls. draft a reply",
];

export const SubprojectType = [
  "ATS",
  "Bridge",
  "Steel Hanging Bridge",
  "Rural Access 1-lane",
  "Rural Access 2-lane",
  "Warehouse",
  "Consolidation",
  "Other Facilities",
  "Irrigation",
  "PWS",
];

export const SubprojectUnitOptions = [
  "sq.m.",
  "km.",
  "ln.m.",
  "HH",
  "Ha.",
  "lot",
];
