
import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'english' | 'marathi';

interface Translations {
  [key: string]: {
    english: string;
    marathi: string;
  };
}

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Translations;
  t: (key: string) => string;
}

const defaultTranslations: Translations = {
  welcome: {
    english: 'Welcome to Gram Panchayat Kon',
    marathi: 'ग्राम पंचायत कोन मध्ये आपले स्वागत आहे'
  },
  login: {
    english: 'Login',
    marathi: 'लॉगिन'
  },
  dashboard: {
    english: 'Dashboard',
    marathi: 'डॅशबोर्ड'
  },
  complaints: {
    english: 'Complaints',
    marathi: 'तक्रारी'
  },
  documents: {
    english: 'Documents',
    marathi: 'दस्तऐवज'
  },
  about: {
    english: 'About',
    marathi: 'आमच्याबद्दल'
  },
  services: {
    english: 'Services',
    marathi: 'सेवा'
  },
  citizen: {
    english: 'Citizen',
    marathi: 'नागरिक'
  },
  staff: {
    english: 'Staff',
    marathi: 'कर्मचारी'
  },
  admin: {
    english: 'Admin',
    marathi: 'प्रशासक'
  },
  birth: {
    english: 'Birth Certificate',
    marathi: 'जन्म प्रमाणपत्र'
  },
  death: {
    english: 'Death Certificate',
    marathi: 'मृत्यू प्रमाणपत्र'
  },
  marriage: {
    english: 'Marriage Certificate',
    marathi: 'विवाह प्रमाणपत्र'
  },
  income: {
    english: 'Income Certificate',
    marathi: 'उत्पन्न प्रमाणपत्र'
  },
  residence: {
    english: 'Residence Certificate',
    marathi: 'निवास प्रमाणपत्र'
  },
  pending: {
    english: 'Pending',
    marathi: 'प्रलंबित'
  },
  approved: {
    english: 'Approved',
    marathi: 'मंजूर'
  },
  rejected: {
    english: 'Rejected',
    marathi: 'नाकारले'
  },
  verified: {
    english: 'Verified',
    marathi: 'सत्यापित'
  },
  inProgress: {
    english: 'In Progress',
    marathi: 'प्रगतीपथावर'
  },
  resolved: {
    english: 'Resolved',
    marathi: 'निराकरण केले'
  },
  home: {
    english: 'Home',
    marathi: 'मुख्यपृष्ठ'
  },
  track: {
    english: 'Track Applications',
    marathi: 'अर्ज ट्रॅक करा'
  },
  notices: {
    english: 'Notices',
    marathi: 'सूचना'
  },
  governmentTitle: {
    english: 'Gram Panchayat Kon',
    marathi: 'ग्राम पंचायत कोन'
  },
  governmentSubtitle: {
    english: 'District Thane, Maharashtra',
    marathi: 'जिल्हा ठाणे, महाराष्ट्र'
  },
  complaintTitle: {
    english: 'Submit Complaint',
    marathi: 'तक्रार दाखल करा'
  },
  complaintDesc: {
    english: 'Fill in the details of your complaint',
    marathi: 'आपल्या तक्रारीचे तपशील भरा'
  },
  complaintCategory: {
    english: 'Category',
    marathi: 'श्रेणी'
  },
  complaintLocation: {
    english: 'Location',
    marathi: 'स्थान'
  },
  complaintDescription: {
    english: 'Description',
    marathi: 'वर्णन'
  },
  submit: {
    english: 'Submit',
    marathi: 'सबमिट करा'
  },
  waterSupply: {
    english: 'Water Supply',
    marathi: 'पाणी पुरवठा'
  },
  roads: {
    english: 'Road Issues',
    marathi: 'रस्ते समस्या'
  },
  sanitation: {
    english: 'Sanitation',
    marathi: 'स्वच्छता'
  },
  electricity: {
    english: 'Electricity',
    marathi: 'वीज'
  },
  others: {
    english: 'Others',
    marathi: 'इतर'
  },
  profile: {
    english: 'Profile',
    marathi: 'प्रोफाइल'
  },
  logout: {
    english: 'Logout',
    marathi: 'लॉगआउट'
  },
  manageStaff: {
    english: 'Manage Staff',
    marathi: 'कर्मचारी व्यवस्थापन'
  },
  manageAnnouncements: {
    english: 'Manage Announcements',
    marathi: 'घोषणा व्यवस्थापन'
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'english',
  setLanguage: () => {},
  translations: defaultTranslations,
  t: () => ''
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('english');

  // Function to get translation
  const t = (key: string): string => {
    if (defaultTranslations[key]) {
      return defaultTranslations[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations: defaultTranslations, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
