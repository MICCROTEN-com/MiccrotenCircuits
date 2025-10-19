import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import logo from '../logo.png';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "PCB Quotation", href: "/pcb-quotation" },
    { name: "Assembly Quotation", href: "/assembly-quotation" },
    { name: "Contact", href: "/contact" },
  ];

  const services = [
    { name: "PCB Fabrication", href: "/pcb-quotation" },
    { name: "Circuit Assembly", href: "/assembly-quotation" },
  ];

  return (
    <footer className="bg-navy-900 text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center mb-4">
              <img src={logo} alt="Miccroten Circuits Logo" className="w-24" />
              <span className="text-xl font-bold text-white">
                Miccroten<span className="text-orange-500">Circuits</span>
              </span>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">
              PCB distributer delivering precision, quality, and innovation for
              over a decade.
            </p>
            <div className="flex gap-4"></div>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-slate-400 hover:text-orange-500 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">Services</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.href}
                    className="text-slate-400 hover:text-orange-500 transition-colors duration-200"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-400">
                  New BEL Rd, Venkatachari Nagar R.M.V. Extension 2nd Stage,
                  North Bengaluru Bengaluru-560094 Karnataka,India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <a
                  href="tel:+917795155237"
                  className="text-slate-400 hover:text-orange-500 transition-colors duration-200"
                >
                  +91 7795155237
                </a>
              </li>
              
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <a
                  href="mailto:miccrotencircuits@gmail.com"
                  className="text-slate-400 hover:text-orange-500 transition-colors duration-200"
                >
                  miccrotencircuits@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              {currentYear} MiccrotenCircuits. All rights reserved.
            </p>
            <div className="flex gap-6">
              <p className="text-slate-400 text-sm transition-colors duration-200">
                Privacy Policy
              </p>
              <p className="text-slate-400 text-sm transition-colors duration-200">
                Terms of Service
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
