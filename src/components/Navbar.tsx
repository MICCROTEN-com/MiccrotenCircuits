import { useState } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../logo.png';
import { useAuth } from '../AuthContext';
import { supabase } from '../supabaseClient';

export default function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { session } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', href: '/', type: 'route' },
    { name: 'PCB Quotation', href: '/pcb-quotation', type: 'route' },
    { name: 'Assembly Quotation', href: '/assembly-quotation', type: 'route' },
    { name: 'Contact', href: '/contact', type: 'route' },
  ];

  const homePageSections = [
    { name: 'Capabilities', href: '#capabilities' },
    { name: 'Process', href: '#process' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Customers', href: '#customers' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const isHomePage = location.pathname === '/';

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-navy-900 shadow-lg backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Miccroten Circuits Logo" className="w-24" />
            <span className="text-2xl font-bold text-white">
              Miccroten<span className="text-orange-500">Circuits</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-slate-200 hover:text-orange-500 transition-colors duration-200 font-medium"
              >
                {link.name}
              </Link>
            ))}
            {session ? (
              <>
                <Link to="/profile" className="text-slate-200 hover:text-orange-500 transition-colors duration-200 font-medium">Profile</Link>
                {session.user.email === 'miccrotencircuits@gmail.com' && (
                  <Link to="/admin" className="text-slate-200 hover:text-orange-500 transition-colors duration-200 font-medium">Admin</Link>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-200 hover:text-orange-500 transition-colors duration-200 font-medium">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-navy-900 border-t border-navy-700">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="block text-slate-200 hover:text-orange-500 py-2 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {isHomePage && homePageSections.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block text-slate-200 hover:text-orange-500 py-2 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <Link
              to="/pcb-quotation"
              className="block text-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 mt-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Get a Quote
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
