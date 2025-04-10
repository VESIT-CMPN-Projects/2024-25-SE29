
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gov-blue-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-heading font-bold border-b border-gov-gold-500 pb-2 inline-block">
              About Us
            </h3>
            <div className="flex items-start space-x-2 mt-4">
              <div className="w-12 h-12 relative flex-shrink-0 mt-1">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                  alt="Emblem of India"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h4 className="font-heading font-bold text-lg">Gram Panchayat Kon</h4>
                <p className="text-sm text-gray-300">
                  Serving the citizens of Kon village with dedication and transparency.
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-300">
              Gram Panchayat Kon is committed to the development and welfare of all villagers
              through participatory governance and efficient delivery of services.
            </p>
          </div>

          {/* Important Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-heading font-bold border-b border-gov-gold-500 pb-2 inline-block">
              Important Links
            </h3>
            <ul className="space-y-2 mt-4">
              <li>
                <Link to="/complaints" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <span className="bg-gov-gold-500 w-1.5 h-1.5 rounded-full mr-2"></span>
                  Submit Complaint
                </Link>
              </li>
              <li>
                <Link to="/documents" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <span className="bg-gov-gold-500 w-1.5 h-1.5 rounded-full mr-2"></span>
                  Request Documents
                </Link>
              </li>
              <li>
                <Link to="/track" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <span className="bg-gov-gold-500 w-1.5 h-1.5 rounded-full mr-2"></span>
                  Track Applications
                </Link>
              </li>
              <li>
                <Link to="/notices" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <span className="bg-gov-gold-500 w-1.5 h-1.5 rounded-full mr-2"></span>
                  Public Notices
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <span className="bg-gov-gold-500 w-1.5 h-1.5 rounded-full mr-2"></span>
                  Staff Login
                </Link>
              </li>
            </ul>
          </div>

          {/* External Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-heading font-bold border-b border-gov-gold-500 pb-2 inline-block">
              Government Links
            </h3>
            <ul className="space-y-2 mt-4">
              <li>
                <a 
                  href="https://www.india.gov.in/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <span className="bg-gov-gold-500 w-1.5 h-1.5 rounded-full mr-2"></span>
                  National Portal of India
                </a>
              </li>
              <li>
                <a 
                  href="https://www.maharashtra.gov.in/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <span className="bg-gov-gold-500 w-1.5 h-1.5 rounded-full mr-2"></span>
                  Government of Maharashtra
                </a>
              </li>
              <li>
                <a 
                  href="https://panchayat.gov.in/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <span className="bg-gov-gold-500 w-1.5 h-1.5 rounded-full mr-2"></span>
                  Ministry of Panchayati Raj
                </a>
              </li>
              <li>
                <a 
                  href="https://uidai.gov.in/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <span className="bg-gov-gold-500 w-1.5 h-1.5 rounded-full mr-2"></span>
                  Aadhaar - UIDAI
                </a>
              </li>
              <li>
                <a 
                  href="https://digitalindia.gov.in/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <span className="bg-gov-gold-500 w-1.5 h-1.5 rounded-full mr-2"></span>
                  Digital India
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-heading font-bold border-b border-gov-gold-500 pb-2 inline-block">
              Contact Us
            </h3>
            <div className="space-y-3 mt-4">
              <div className="flex items-start space-x-3">
                <MapPin className="text-gov-gold-500 flex-shrink-0 mt-1" size={18} />
                <p className="text-sm text-gray-300">
                  Gram Panchayat Office, Kon Village, Maharashtra - 400710, India
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-gov-gold-500 flex-shrink-0" size={18} />
                <p className="text-sm text-gray-300">
                  +91 1234567890
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-gov-gold-500 flex-shrink-0" size={18} />
                <p className="text-sm text-gray-300">
                  info@grampanchayatkon.gov.in
                </p>
              </div>
            </div>
            
            {/* Social Media */}
            <div className="mt-4">
              <h4 className="font-semibold text-white mb-2">Connect With Us</h4>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="w-9 h-9 rounded-full bg-gov-blue-700 flex items-center justify-center hover:bg-gov-gold-500 transition-colors"
                >
                  <Facebook size={18} />
                </a>
                <a 
                  href="#" 
                  className="w-9 h-9 rounded-full bg-gov-blue-700 flex items-center justify-center hover:bg-gov-gold-500 transition-colors"
                >
                  <Twitter size={18} />
                </a>
                <a 
                  href="#" 
                  className="w-9 h-9 rounded-full bg-gov-blue-700 flex items-center justify-center hover:bg-gov-gold-500 transition-colors"
                >
                  <Instagram size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gov-blue-700 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Gram Panchayat Kon, Government of Maharashtra. All Rights Reserved.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            <Link to="/privacy-policy" className="hover:text-white mr-4">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-white mr-4">Terms of Service</Link>
            <Link to="/accessibility" className="hover:text-white">Accessibility</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
