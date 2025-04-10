
import { Service } from "@/model";

export const services: Service[] = [
  {
    id: "1",
    title: "Complaint Submission",
    description: "Submit complaints about infrastructure, sanitation, and other issues in your area.",
    icon: "FileWarning",
    link: "/complaints",
  },
  {
    id: "2",
    title: "Document Request",
    description: "Apply for birth, death, marriage and other certificates online.",
    icon: "FileText",
    link: "/documents",
  },
  {
    id: "3",
    title: "Track Application",
    description: "Track status of your complaints and certificate applications.",
    icon: "Search",
    link: "/track",
  },
  {
    id: "4",
    title: "Gram Panchayat Staff",
    description: "Staff portal for handling citizen requests and document verification.",
    icon: "Users",
    link: "/dashboard",
  },
  {
    id: "5",
    title: "Public Notices",
    description: "Important announcements and notifications from Gram Panchayat Kon.",
    icon: "Bell",
    link: "/notices",
  },
  {
    id: "6",
    title: "About Gram Panchayat",
    description: "Learn about our village administration, history and governance.",
    icon: "Building",
    link: "/about",
  },
];

export const announcements = [
  {
    id: "1",
    title: "COVID-19 Vaccination Camp",
    content: "A vaccination camp will be organized on 25th June 2023 at the Gram Panchayat office from 9:00 AM to 4:00 PM. All residents above 18 years of age are encouraged to get vaccinated.",
    date: new Date("2023-06-15"),
    category: "Health",
    important: true,
    link: "/notices"
  },
  {
    id: "2",
    title: "Water Supply Interruption",
    content: "Water supply will be interrupted on 18th June 2023 from 10:00 AM to 4:00 PM due to maintenance work on the main pipeline. Please store water in advance.",
    date: new Date("2023-06-16"),
    category: "Infrastructure",
    important: true,
  },
  {
    id: "3",
    title: "Gram Sabha Meeting",
    content: "The next Gram Sabha meeting will be held on 30th June 2023 at 10:00 AM in the village hall. All residents are requested to attend and participate in the discussions.",
    date: new Date("2023-06-20"),
    category: "Governance",
    important: false,
  },
  {
    id: "4",
    title: "New Scholarship Scheme",
    content: "A new scholarship scheme for students from economically weaker sections has been launched. Eligible students can apply at the Gram Panchayat office by 15th July 2023.",
    date: new Date("2023-06-12"),
    category: "Education",
    important: false,
    link: "/notices"
  },
  {
    id: "5",
    title: "Road Repair Work",
    content: "Road repair work will begin from 21st June 2023 on the main village road. The work is expected to be completed within a week. Please use alternative routes during this period.",
    date: new Date("2023-06-18"),
    category: "Infrastructure",
    important: false,
  },
  {
    id: "6",
    title: "Agricultural Training Program",
    content: "A training program on modern farming techniques will be conducted by agricultural experts on 5th July 2023 at the community center. Farmers are encouraged to attend.",
    date: new Date("2023-06-22"),
    category: "Agriculture",
    important: false,
    link: "/notices"
  },
];

export const complaintCategories = [
  "Water Supply",
  "Electricity",
  "Roads & Transportation",
  "Sanitation",
  "Public Health",
  "Education",
  "Agriculture",
  "Environment",
  "Public Property",
  "Other",
];

export const documentRequirements = {
  birth: [
    "Hospital birth certificate or letter from midwife/doctor",
    "Parent's identity proof (Aadhaar card/Voter ID/Passport)",
    "Parent's address proof (Electricity bill/Rent agreement)",
    "Passport size photograph of the child (if available)",
  ],
  death: [
    "Medical certificate of cause of death from hospital/doctor",
    "Identity proof of deceased (Aadhaar card/Voter ID/Passport)",
    "Applicant's identity proof (Aadhaar card/Voter ID/Passport)",
    "Applicant's address proof (Electricity bill/Rent agreement)",
    "Proof of relationship with deceased",
  ],
  marriage: [
    "Marriage invitation card",
    "Photographs of marriage ceremony",
    "Identity proof of bride and groom (Aadhaar card/Voter ID/Passport)",
    "Address proof of both parties",
    "Age proof of bride and groom (Birth certificate/School leaving certificate)",
    "Joint photograph of bride and groom",
  ],
  income: [
    "Identity proof (Aadhaar card/Voter ID/Passport)",
    "Address proof (Electricity bill/Water bill/Rent agreement)",
    "Bank statements (last 6 months)",
    "Salary slips or income tax returns (for employed persons)",
    "Business ownership proof (for self-employed persons)",
    "Agriculture land documents (for farmers)",
  ],
  residence: [
    "Identity proof (Aadhaar card/Voter ID/Passport)",
    "Electricity bill / Water bill in the applicant's name",
    "Property tax receipt or house ownership documents",
    "Rent agreement (for tenants)",
    "Passport size photographs (2 copies)",
  ],
  other: [
    "Identity proof (Aadhaar card/Voter ID/Passport)",
    "Address proof (Electricity bill/Water bill/Rent agreement)",
    "Supporting documents related to certificate request",
    "Passport size photographs (2 copies)",
  ],
};
