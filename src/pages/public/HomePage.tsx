import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  Building2,
  Home,
  Crown,
  Briefcase,
  Layers,
  MapPin,
  ShieldCheck,
  Award,
  Users,
  ArrowRight,
  Sparkles,
  PhoneCall,
  CheckCircle2,
} from 'lucide-react';
import { propertyApi } from '../../api/properties';
import { masterApi } from '../../api/master';
import { agentApi } from '../../api/dashboard';
import { PropertyCard } from '../../components/property/PropertyCard';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Search State
  const [activeTab, setActiveTab] = useState<'SALE' | 'RENT' | 'COMMERCIAL'>('SALE');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedBudget, setSelectedBudget] = useState<string>('');
  const [keyword, setKeyword] = useState<string>('');

  // Fetch Cities and Types for filter dropdowns
  const { data: cities = [] } = useQuery({
    queryKey: ['cities'],
    queryFn: () => masterApi.getCities(),
  });

  const { data: propertyTypes = [] } = useQuery({
    queryKey: ['propertyTypes'],
    queryFn: () => masterApi.getPropertyTypes(),
  });

  // Fetch Featured Properties
  const { data: featuredProperties = [], isLoading: isFeaturedLoading } = useQuery({
    queryKey: ['featuredProperties'],
    queryFn: () => propertyApi.getFeatured(),
  });

  // Fetch Top Agents
  const { data: agents = [], isLoading: isAgentsLoading } = useQuery({
    queryKey: ['agents'],
    queryFn: () => agentApi.getAll(),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (activeTab === 'COMMERCIAL') {
      params.set('propertyType', 'Commercial Office');
    } else {
      params.set('listingType', activeTab);
    }

    if (selectedCity) params.set('city', selectedCity);
    if (selectedType) params.set('propertyType', selectedType);
    if (keyword.trim()) params.set('keyword', keyword.trim());

    if (selectedBudget) {
      if (selectedBudget === 'under50l') {
        params.set('maxPrice', '5000000');
      } else if (selectedBudget === '50l-1cr') {
        params.set('minPrice', '5000000');
        params.set('maxPrice', '10000000');
      } else if (selectedBudget === '1cr-3cr') {
        params.set('minPrice', '10000000');
        params.set('maxPrice', '30000000');
      } else if (selectedBudget === 'above3cr') {
        params.set('minPrice', '30000000');
      }
    }

    navigate(`/properties?${params.toString()}`);
  };

  const categories = [
    { label: 'Apartments', type: 'Apartment / Flat', icon: Building2, count: '45+ Units' },
    { label: 'Luxury Villas', type: 'Luxury Villa', icon: Home, count: '18+ Estates' },
    { label: 'Penthouses', type: 'Penthouse', icon: Crown, count: '12+ Suites' },
    { label: 'Commercial', type: 'Commercial Office', icon: Briefcase, count: '24+ Offices' },
    { label: 'Residential Plots', type: 'Residential Plot', icon: Layers, count: '15+ Land' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[640px] lg:min-h-[720px] flex items-center justify-center bg-navy-950 overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
            alt="Luxury architecture hero background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-navy-950/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-brand-300 text-xs font-semibold mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            Curated Architectural Residences & Estates
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white tracking-tight font-serif max-w-4xl mx-auto leading-tight mb-6">
            Find Your Sanctuary of <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-400 to-amber-200">Timeless Elegance</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 font-light">
            Verified luxury apartments, private designer villas, and high-yield commercial assets in prime metro corridors.
          </p>

          {/* Search Box */}
          <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-xl rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/40 text-left">
            {/* Tabs */}
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
              <button
                type="button"
                onClick={() => setActiveTab('SALE')}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'SALE'
                    ? 'bg-navy-900 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Buy
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('RENT')}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'RENT'
                    ? 'bg-navy-900 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Rent
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('COMMERCIAL')}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'COMMERCIAL'
                    ? 'bg-navy-900 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Commercial
              </button>
            </div>

            {/* Inputs Form */}
            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* City Select */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Location
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="">All Cities</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Property Type */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Property Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="">All Types</option>
                  {propertyTypes.map((type) => (
                    <option key={type.id} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget Range */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Budget
                </label>
                <select
                  value={selectedBudget}
                  onChange={(e) => setSelectedBudget(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="">Any Budget</option>
                  <option value="under50l">Under ₹ 50 Lakhs</option>
                  <option value="50l-1cr">₹ 50 Lakhs - ₹ 1 Cr</option>
                  <option value="1cr-3cr">₹ 1 Cr - ₹ 3 Cr</option>
                  <option value="above3cr">₹ 3 Cr & Above</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="flex items-end">
                <Button
                  type="submit"
                  variant="gold"
                  size="md"
                  className="w-full h-[42px] font-bold shadow-md"
                  icon={<Search className="w-4 h-4" />}
                >
                  Search Properties
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Highlights Bar */}
      <section className="bg-white border-b border-slate-200/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-extrabold text-navy-900 font-serif">100%</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">RERA Verified Titles</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-navy-900 font-serif">₹ 500+ Cr</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Portfolio Value</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-navy-900 font-serif">4.9 / 5.0</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Client Satisfaction</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-navy-900 font-serif">24 Hours</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Assisted Site Visits</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-widest mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Featured Portfolio
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 font-serif tracking-tight">
                Architectural Masterpieces
              </h2>
            </div>
            <Link to="/properties">
              <Button variant="outline" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                Browse All 10+ Properties
              </Button>
            </Link>
          </div>

          {isFeaturedLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="space-y-3">
                  <Skeleton className="aspect-[16/10] rounded-2xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.slice(0, 6).map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Property Categories */}
      <section className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 font-serif mb-3">
              Explore by Asset Category
            </h2>
            <p className="text-slate-500 text-sm">
              Discover residential flats, private villas, corporate towers, and plotted communities tailored to your requirements.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.label}
                  to={`/properties?propertyType=${encodeURIComponent(cat.type)}`}
                  className="group p-6 rounded-2xl bg-slate-50 hover:bg-navy-900 border border-slate-200/80 hover:border-navy-900 transition-all duration-300 text-center flex flex-col items-center hover:-translate-y-1 shadow-sm"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white group-hover:bg-brand-600/20 border border-slate-200 group-hover:border-brand-500/30 flex items-center justify-center text-brand-600 group-hover:text-brand-400 mb-4 transition-colors">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-white text-sm mb-1 transition-colors">
                    {cat.label}
                  </h3>
                  <span className="text-xs text-slate-400 group-hover:text-slate-300 font-medium">
                    {cat.count}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Top Locations Showcase */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 font-serif mb-3">
              Prime Metro Destinations
            </h2>
            <p className="text-slate-500 text-sm">
              Explore coveted residential and commercial real estate hubs in India’s highest-growth cities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cities.map((city) => (
              <Link
                key={city.id}
                to={`/properties?city=${encodeURIComponent(city.name)}`}
                className="group relative h-80 rounded-2xl overflow-hidden shadow-md hover:shadow-premium transition-all duration-500"
              >
                <img
                  src={city.imageUrl || 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80'}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
                  <div>
                    <span className="text-xs font-semibold text-brand-300 uppercase tracking-widest">
                      {city.stateName}
                    </span>
                    <h3 className="text-2xl font-bold font-serif">{city.name}</h3>
                  </div>
                  <span className="p-2.5 rounded-full bg-white/20 backdrop-blur-md text-white group-hover:bg-brand-600 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" />
                The AuraEstates Advantage
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 font-serif leading-tight">
                Transparent Advisory. Legally Vetted Titles. Zero Hassle.
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Whether you are seeking a primary residence in Banjara Hills, an executive rental in Powai, or a commercial floor plate in Gachibowli, our platform delivers an uncompromising standard of service.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Direct Verification & RERA Compliance</h4>
                    <p className="text-xs text-slate-500">Every property listing undergo strict legal documentation scrutiny.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Direct WhatsApp & Assisted Visits</h4>
                    <p className="text-xs text-slate-500">Instant agent communication and scheduled private walkthroughs at your convenience.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">End-to-End CRM Pipeline</h4>
                    <p className="text-xs text-slate-500">Track inquiries, schedule visits, and monitor feedback through our transparent platform.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80"
                  alt="Modern villa interior design"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-navy-900 text-white p-6 rounded-2xl shadow-xl max-w-xs border border-slate-800 hidden sm:block">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-8 h-8 text-brand-400" />
                  <div>
                    <p className="font-bold text-base font-serif">Excellence Award</p>
                    <p className="text-[11px] text-slate-400">Best Luxury Real Estate Platform 2025</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Agents Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-widest mb-2">
                <Users className="w-3.5 h-3.5" />
                Licensed Partners
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 font-serif tracking-tight">
                Meet Our Premier Advisors
              </h2>
            </div>
            <Link to="/agents">
              <Button variant="outline" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                View All Advisors
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-premium transition-all text-center flex flex-col items-center"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-brand-500/40 p-0.5">
                  <img
                    src={agent.profilePhoto || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'}
                    alt={agent.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h3 className="font-bold text-lg text-navy-900">{agent.name}</h3>
                <p className="text-xs text-brand-600 font-semibold mb-2">{agent.agencyName}</p>
                <p className="text-xs text-slate-500 mb-4 line-clamp-1">{agent.specialization}</p>

                <div className="w-full grid grid-cols-2 gap-2 py-3 border-y border-slate-100 text-xs mb-4">
                  <div>
                    <span className="font-bold text-slate-900">{agent.yearsOfExperience} Years</span>
                    <p className="text-[10px] text-slate-400">Experience</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">{agent.rating} ★</span>
                    <p className="text-[10px] text-slate-400">Rating</p>
                  </div>
                </div>

                <Link to={`/agents/${agent.id}`} className="w-full">
                  <Button variant="secondary" size="sm" className="w-full font-semibold">
                    View Listings
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-navy-950 via-navy-900 to-slate-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold font-serif tracking-tight">
            Ready to Discover Your Dream Residence?
          </h2>
          <p className="text-slate-300 text-base max-w-2xl mx-auto font-light">
            Connect with our certified property advisors or list your luxury property to access verified ultra-high-net-worth buyers.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link to="/properties">
              <Button variant="gold" size="lg" className="font-bold">
                Browse Marketplace
              </Button>
            </Link>
            <Link to="/register?role=agent">
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 font-bold">
                Partner as Agent
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
