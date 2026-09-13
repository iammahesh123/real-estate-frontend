import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Col 1: Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-white font-serif">
                  Aura<span className="text-brand-500">Estates</span>
                </span>
                <span className="text-[10px] tracking-widest text-slate-400 font-semibold uppercase -mt-1">
                  Premier Real Estate
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Discover verified luxury properties, architecturally designed villas, and high-yield commercial assets across Hyderabad, Bengaluru, and Mumbai.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-brand-400 font-medium">
                <ShieldCheck className="w-4 h-4 text-brand-500" />
                100% RERA Verified Listings
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-serif">
              Marketplace
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/properties" className="hover:text-brand-400 transition-colors">
                  All Properties
                </Link>
              </li>
              <li>
                <Link to="/buy" className="hover:text-brand-400 transition-colors">
                  Buy Residential
                </Link>
              </li>
              <li>
                <Link to="/rent" className="hover:text-brand-400 transition-colors">
                  Rent Luxury Flats
                </Link>
              </li>
              <li>
                <Link to="/commercial" className="hover:text-brand-400 transition-colors">
                  Commercial Offices
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-brand-400 transition-colors">
                  Builder Developments
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-brand-400 transition-colors">
                  Compare Properties
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Cities */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-serif">
              Top Locations
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/properties?city=Hyderabad" className="hover:text-brand-400 transition-colors">
                  Hyderabad Properties
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Bengaluru" className="hover:text-brand-400 transition-colors">
                  Bengaluru Estates
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Mumbai" className="hover:text-brand-400 transition-colors">
                  Mumbai Luxury Homes
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Hyderabad&keyword=Banjara+Hills" className="hover:text-brand-400 transition-colors">
                  Banjara Hills
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Hyderabad&keyword=Jubilee+Hills" className="hover:text-brand-400 transition-colors">
                  Jubilee Hills
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Bengaluru&keyword=Indiranagar" className="hover:text-brand-400 transition-colors">
                  Indiranagar
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Office */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-serif">
              Advisory Office
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                <span>Sky Tower, Level 4, Road No. 12, Banjara Hills, Hyderabad, 500034</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-500 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-500 shrink-0" />
                <span>concierge@auraestates.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AuraEstates Real Estate Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-slate-400">
              About Us
            </Link>
            <Link to="/services" className="hover:text-slate-400">
              Services
            </Link>
            <Link to="/contact" className="hover:text-slate-400">
              Contact
            </Link>
            <Link to="/privacy" className="hover:text-slate-400">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
