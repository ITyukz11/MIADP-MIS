export const codeComponent = [
    { label: 'Infrastructure', value: 'IN' },
    { label: 'Enterprise', value: 'EN' }
]

export const codeRegion = [
    { label: 'RPCO 9', value: 'R009' },
    { label: 'RPCO 10', value: 'R010' },
    { label: 'RPCO 11', value: 'R011' },
    { label: 'RPCO 12', value: 'R012' },
    { label: 'RPCO 13', value: 'R013' },
    { label: 'BARMM', value: 'RBRM' },
]

export const codeProvince = [
    { label: 'Agusan del Norte', value: 'ADN', region: 'R013' },
    { label: 'Agusan del Sur', value: 'ADS', region: 'R013' },
    { label: 'Basilan', value: 'BAS', region: 'RBRM' },
    { label: 'Bukidnon', value: 'BUK', region: 'R010' },
    { label: 'Camiguin', value: 'CAM', region: 'R010' },
    { label: 'Davao de Oro', value: 'DOR', region: 'R011' },
    { label: 'Davao del Norte', value: 'DDN', region: 'R011' },
    { label: 'Davao del Sur', value: 'DDS', region: 'R011' },
    { label: 'Davao Occidental', value: 'DVO', region: 'R011' },
    { label: 'Davao Oriental', value: 'DOC', region: 'R011' },
    { label: 'Dinagat Islands', value: 'DIN', region: 'R013' },
    { label: 'Lanao del Norte', value: 'LDN', region: 'R010' },
    { label: 'Lanao del Sur', value: 'LDS', region: 'RBRM' },
    { label: 'Maguindanao del Norte', value: 'MGN', region: 'RBRM' },
    { label: 'Maguindanao del Sur', value: 'MGS', region: 'RBRM' },
    { label: 'Misamis Occidental', value: 'MOC', region: 'R010' },
    { label: 'Misamis Oriental', value: 'MOR', region: 'R010' },
    { label: 'North Cotabato', value: 'COT', region: 'R012' },
    { label: 'Sarangani', value: 'SAR', region: 'R012' },
    { label: 'South Cotabato', value: 'SOC', region: 'R012' },
    { label: 'Sultan Kudarat', value: 'SKU', region: 'R012' },
    { label: 'Surigao del Norte', value: 'SDN', region: 'R013' },
    { label: 'Surigao del Sur', value: 'SDS', region: 'R013' },
    { label: 'Sulu', value: 'SLU', region: 'RBRM' },
    { label: 'Tawi-Tawi', value: 'TTI', region: 'RBRM' },
    { label: 'Zamboanga del Norte', value: 'ZDN', region: 'R009' },
    { label: 'Zamboanga del Sur', value: 'ZDS', region: 'R009' },
    { label: 'Zamboanga Sibugay', value: 'ZSI', region: 'R009' }
  ];
  
  export const codeType = [
    { label: 'Farm to Market Road', value: 'FRD', type:'IN' },
    { label: 'Bridges', value: 'BRD', type:'IN' },
    { label: 'Tramline', value: 'TRL', type:'IN' },
    { label: 'Small Scale Irrigation Project', value: 'SIR', type:'IN' },
    { label: 'Potable Water System', value: 'PWS', type:'IN' },
    { label: 'Post Harvest Infrastructure', value: 'PHF', type:'IN' },
    { label: 'Micro', value: 'MI', type:'EN' },
    { label: 'Small', value: 'SM', type:'EN' },
    { label: 'Medium', value: 'ME', type:'EN' }
  ];
  

  export const codeAncestralDomain = [
    { label: 'Subanen', value: 'DUM', region: 'R009', municipality: 'Dumingag, Mahayag, Siayan' },
    { label: 'Higaonon-Kalanawan', value: 'KAL', region: 'R010', municipality: 'Malitbog, Manolo Fortrich, Gingoog City' },
    { label: 'Bukidnon-Tagolaonen', value: 'IMP', region: 'R010', municipality: 'Impasugong' },
    { label: 'Ata-Manobo', value: 'TAL', region: 'R011', municipality: 'Sto. Tomas, Kapalong, San Isidro, Talaingod' },
    { label: 'Blaan-Tagakaulo', value: 'MAL', region: 'R011', municipality: 'Malita' },
    { label: 'Obo-Manovu', value: 'MAG', region: 'R012', municipality: 'Magpet' },
    { label: 'Manobo Dulangan', value: 'SEN', region: 'R012', municipality: 'Senator Ninoy Aquino, Kalamansig, Palimbang' },
    { label: 'Manobo', value: 'ROS', region: 'R013', municipality: 'Rosario' },
    { label: 'Manobo', value: 'BUN', region: 'R013', municipality: 'Bunawan' },
    { label: 'Sama-Bangingi', value: 'SAM', region: 'BARMM', municipality: 'Hadji Muhtamad' },
    { label: 'Lintangan', value: 'LIN', region: 'R009', municipality: 'Sibuco' },
    { label: 'Anongan', value: 'ANO', region: 'R009', municipality: 'Sibuco' },
    { label: 'Daraghuyan', value: 'DAR', region: 'R010', municipality: 'Malaybalay City, Bukidnon' },
    { label: 'Cebukta', value: 'CEB', region: 'R010', municipality: 'Valencia City' },
    { label: 'Mansaka', value: 'PAN', region: 'R011', municipality: 'Maragusan, Nabunturan, Maco, Mabini, Pantukan, Mawab' },
    { label: 'Erumanen Menuvu', value: 'PIG', region: 'R012', municipality: 'Pigcawayan' },
    { label: 'Blaan-Tagakaulo', value: 'PAL', region: 'R012', municipality: 'Palimbang' },
    { label: 'Blaan-Tagakaulo', value: 'MAU', region: 'R012', municipality: 'Malungon' },
    { label: 'Tboli & Blaan', value: 'TBO', region: 'R012', municipality: 'Tboli, Surallah, Polomolok, Tupi, Maasim & Maitum (Sarangani)' },
    { label: 'Manobo', value: 'SNM', region: 'R013', municipality: 'San Miguel' },
    { label: 'Mamanwa', value: 'MAI', region: 'R013', municipality: 'Mainit, Malimono, San Francisco, Sison, Surigao City' },
    { label: 'Mamanwa', value: 'REM', region: 'R013', municipality: 'Remedios T. Romualdez' },
    { label: 'Teduray and Lambangian ICC', value: 'TED', region: 'BARMM', municipality: 'Talayan, Guindulangan, Datu Unsay, Datu Hofer, Ampatuan & South Upi' },
  ];
  