export const TypeOfActivity = [
  { value: "Training", label: "Training" },
  { value: "Workshop", label: "Workshop" },
  { value: "Orientation", label: "Orientation" },
  { value: "Consultation", label: "Consultation" },
  { value: "Training/Workshop", label: "Training/Workshop" },
];

export const ActivityOption = [
  { value: "WFP Activities", label: "WFP Activities" },
  { value: "Individual Activities", label: "Individual Activities" },
];

export const OperatingUnit = [
  { value: "PSO", label: "PSO" },
  { value: "RPCO9", label: "RPCO9" },
  { value: "RPCO10", label: "RPCO10" },
  { value: "RPCO11", label: "RPCO11" },
  { value: "RPCO12", label: "RPCO12" },
  { value: "RPCO13", label: "RPCO13" },
  { value: "BARMM", label: "BARMM" },
];

export const ComponentsUnits = [
  "AD PLAN",
  "AD INFRA",
  "AD ENTREP",
  "PMEU",
  "SES",
  "Procurement",
  "Admin",
  "InfoAce",
  "GGU",
  "ECON",
  "Finance",
];

export const BudgetYear = [
  { value: "CY2023-Current", label: "CY2023-Current" },
  { value: "CY2023-Continuing", label: "CY2023-Continuing" },
  { value: "CY2024-Current", label: "CY2024-Current" },
  { value: "CY2024-Continuing", label: "CY2024-Continuing" },
  { value: "CY2025", label: "CY2025" },
  { value: "CY2026", label: "CY2026" },
];

interface CostTabMajorActivityData {
  costTabMajorActivity: { [key: string]: string[] };
}

export const CostTabMajorActivity: CostTabMajorActivityData = {
  costTabMajorActivity: {
    "AD PLAN": [
      "Major Activity 1: Consultation & Mobilization of ICC/IPs*",
      "Major Activity 2: Participatory Formulation of ADAIF",
      "Major Activity 3: Capacity Building for Subproject Planning for both Components 2 & 3",
      "Major Activity 4: IPO/ADMO with the IPMR to present ADAIF at the LGUs for solicitation of support in the subproject implementation",
      "Major Activity 5: Utilize ADAIF and subproject concept proposals as inputs to enhance local development and/or annual investment plans",
    ],
    "AD INFRA": [
      "Engineering Design and Supervision",
      "Infrastructure Training for IPOs",
    ],
    "AD ENTREP": [
      "Capability Building for IPOs and Project Implementers (inc. Program Contract with Business Development Support Providers)",
    ],
    OTHERS: [
      "c4.1a. Environmental and Social Assessment and Impact Management",
      "c4.1b.Cultural Sensitivity Training, IKSP and IPRA (for MIADP and LGUs)",
      "c4.1c.Grievance Redress Mechanism",
      "c4.1d.Subproject Supervision: Environmental and Social Impacts Management of Construction",
      "c4.1e.Safeguards Supervision for Enterprise Operations",
      "c4.1f.Occupational Health and Safety in Construction and Enterprise Operations",
      "c4.1g.Gender and Development-related training",
      "c4.1h.Training Needs Assessment",
      "c4.1i.Financial Management Orientation (RPCOs and LGUs/IPOs)",
      "c4.1j.Financial Capability Building for IPOs/beneficiaries",
      "c4.1k.Procurement related trainings and activities",
      "c4.1l.M&E Training and Workshop",
      "c4.1m.Process / Progress Monitoring",
      "c4.1n.Citizen Monitoring Training",
      "c4.1o.Rapid Appraisal of Emerging Benefits",
      "c4.1p.Quarterly Assessment",
      "c4.1q.Proponent Group Profiling",
      "c4.1r.GGU related trainings",
    ],
  },
};

interface CostTabSubActivityData {
  costTabSubActivity: { [key: string]: string[] };
}

export const CostTabSubActivity: CostTabSubActivityData = {
  costTabSubActivity: {
    "Major Activity 1: Consultation & Mobilization of ICC/IPs*": [
      "c1.1.a. Consultation with ICC/IPs and NCIP in target ADs conducted",
      "c1.1.b. Counterpart team for ICC/IPS in ADs mobilized; partner IPO/IPO-ADMO selected by the IPS to assist in data gathering an validation",
      "c1.1.c. Engagement Plan prepared by the IPS and concurred by NCIP",
    ],
    "Major Activity 2: Participatory Formulation of ADAIF": [
      "c1.2.a. Series of meetings/consultations in ICC/IPS conducted",
      "c1.2.b. ADAIF formulated through a participatory process with ICC/IPS resolution  and endorsement to NCIP",
      "c1.2.c. Issuance of Certificate of Validation for the formulated ADAIF secured from Regional/Nation NCIP Office",
    ],
    "Major Activity 3: Capacity Building for Subproject Planning for both Components 2 & 3":
      [
        "c1.3.a. Organizational development, IPO identification, and clustering",
        "c1.3.b  Capacity building on Componets 2& 3 prioritization planning  and concept proposal preparation conducted",
        "c1.3.c. Concept proposals for the infrastructure and enterprise subprojects prepared and endorsed by the IPO/IPO-ADMO to the IPS and for concurrence bof NCIP",
        "c1.3.d. Issuance of Certificate of Validation for each concept proposal of infrastructure and enterprise subproject secured from Regional/National NCIP Office",
      ],
    "Major Activity 4: IPO/ADMO with the IPMR to present ADAIF at the LGUs for solicitation of support in the subproject implementation":
      [
        "c1.4.a  Solicited commitment arrangement by the LGU through Sangguniang Resolution in support to the project implementation for budget allocation as counterpart/share in the approved subprojects by both parties, the ICC/Ips and the LGU",
      ],
    "Major Activity 5: Utilize ADAIF and subproject concept proposals as inputs to enhance local development and/or annual investment plans":
      [
        "c1.5.a  Updating  the LGU plans through integration of ICC/Ips concerns ( for updating of PCIP, if commodity not included)",
      ],
    "Engineering Design and Supervision": [
      "c2.7a. Field Validation",
      "c2.7b.Coordination Meetings",
    ],
    "Infrastructure Training for IPOs": [
      "General orientation, capacitation and planning for development of PMO, RPSCO, LPMIU and  IPOs  and identification of infra requirements",
      "Training on preparation of SPs  DED, POW, O&M and Plan  and other technical documents requirements",
      "Training on preparation of IMA, Bid documents and other requirements",
      "Training on procurement process and documentation",
      "ICC/IP Community Preparation (CNC or ECC consolidator) for infra project",
      "Training on applied geotagging activities and KOBO info collection tool box",
      "Training on contract management",
      "Training on Social and Environmental Safeguards",
      "Training on O&M process and agreement",
    ],
    "Capability Building for IPOs and Project Implementers (inc. Program Contract with Business Development Support Providers)":
      [
        "Capability Building for IPOs and Project Implementers (inc. Program Contract with Business Development Support Providers)",
      ],
    OTHERS: [
      "c4.1a. Environmental and Social Assessment and Impact Management",
      "c4.1b.Cultural Sensitivity Training, IKSP and IPRA (for MIADP and LGUs)",
      "c4.1c.Grievance Redress Mechanism",
      "c4.1d.Subproject Supervision: Environmental and Social Impacts Management of Construction",
      "c4.1e.Safeguards Supervision for Enterprise Operations",
      "c4.1f.Occupational Health and Safety in Construction and Enterprise Operations",
      "c4.1g.Gender and Development-related training",
      "c4.1h.Training Needs Assessment",
      "c4.1i.Financial Management Orientation (RPCOs and LGUs/IPOs)",
      "c4.1j.Financial Capability Building for IPOs/beneficiaries",
      "c4.1k.Procurement related trainings and activities",
      "c4.1l.M&E Training and Workshop",
      "c4.1m.Process / Progress Monitoring",
      "c4.1n.Citizen Monitoring Training",
      "c4.1o.Rapid Appraisal of Emerging Benefits",
      "c4.1p.Quarterly Assessment",
      "c4.1q.Proponent Group Profiling",
      "c4.1r.GGU related trainings",
    ],
  },
};

export const UnitOfMeasures = [
  "No. of Trainings",
  "No. of Meetings",
  "No. of Workshops",
  "No. of Consultations",
  "No. of Staff",
  "No. of Man-days",
  "No. of Man-months",
];

export const BudgetLine = [
  "Training and Scholarship expenses",
  "Travelling expenses",
  "Supplies and materials",
  "MOOE",
  "PROFESSIONAL EXPENSES",
];

interface UACSCodeData {
  uacsCode: { [key: string]: string[] };
}

export const UACSCode: UACSCodeData = {
  uacsCode: {
    "Training and Scholarship expenses": [
      "Training Expenses -  50202010-02",
      "ICT Training Expenses -  50202010-00",
    ],
    "Travelling expenses": [
      "Travelling Expenses - Foreign - 50201020-00",
      "Travelling Expenses - Local - 50201010-00",
    ],
    "Supplies and materials": [
      "Other Supplies and Materials Expenses - 50203990-00",
      "Semi-Expendable Furniture, Fixtures and Book Expenses - 50203220-00",
      "Semi-Expendable Machineries and Equipment Expenses - 50203210-00",
      "Fuel, Oil and Lubricants Expenses - 50203090-00",
      "Medical, Dental and Laboratory Supplies Expenses - 50203080-00",
      "Office Supplies Expenses - 50203010-02",
    ],
    MOOE: [
      "Transportation and Delivery Expenses 50299040-00",
      "Representation Expenses 50299030-00",
      "Printing and Publication Expenses 50299020-00",
      "Advertising Expenses 50299010-00",
      "Labor and Wages 50216010-00",
    ],
    "PROFESSIONAL EXPENSES": [
      "Other Professional Services 50211990-00",
      "Consultancy Services 50211030-02",
      "Auditing Services 50211020-00",
      "Legal Services 50211010-00",
    ],
  },
};

export const statusPriority: { [key: string]: number } = {
  Ongoing: 1,
  Upcoming: 2,
  Postponed: 3,
  Completed: 4,
  Cancelled: 5,
};
