import React from 'react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <div className="relative bg-slate-900 text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 opacity-90" />
        <div className="relative max-w-5xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3.5 py-1.5 rounded-full border border-amber-400/30">
            Redefining Luxury Living Since 2012
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mt-6 text-white">
            Architects of Exceptional Living Experiences
          </h1>
          <p className="text-slate-300 text-lg max-w-3xl mx-auto mt-6 leading-relaxed">
            EstateHub is India&apos;s premier luxury real estate advisory and marketplace. We unite discerning buyers, verified developers, and elite realtors through institutional-grade transparency and cutting-edge technology.
          </p>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-600">₹4,200+ Cr</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">Transaction Volume</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">12,500+</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">Prime Homes Sold</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-600">98.4%</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">Customer Satisfaction</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">450+</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">Certified Advisors</div>
          </div>
        </div>
      </div>

      {/* Core Mission & Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-amber-400 transition">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-6 font-bold text-xl">
              01
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">100% Legal &amp; RERA Transparency</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Every property and new project on EstateHub undergoes rigorous title verification, encumbrance checks, and RERA compliance audit before listing.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-amber-400 transition">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-6 font-bold text-xl">
              02
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Data-Driven Market Intelligence</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              We empower buyers and investors with actual transaction data, rental yields, price appreciation histories, and micro-market infrastructure updates.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-amber-400 transition">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-6 font-bold text-xl">
              03
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Concierge Acquisition Advisory</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              From private helicopter tours and legal escrow handling to bespoke interior curation, our dedicated relationship managers ensure seamless transactions.
            </p>
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-16 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-10 text-center text-white relative overflow-hidden">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to Discover Your Next Trophy Asset?</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mt-2">
            Schedule an appointment with our private wealth real estate division or browse our curated marketplace.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              to="/properties"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm transition"
            >
              Browse Showcase Properties
            </Link>
            <Link
              to="/contact"
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-xl text-sm transition border border-white/20"
            >
              Speak to an Advisor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
