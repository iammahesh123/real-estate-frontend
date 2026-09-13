import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectApi, ProjectDetail } from '../../api/projects';
import { propertyApi } from '../../api/properties';
import { crmApi } from '../../api/crm';
import { PropertySummary } from '../../types';
import { PropertyCard } from '../../components/property/PropertyCard';
import { Skeleton } from '../../components/common/Skeleton';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [properties, setProperties] = useState<PropertySummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Lead inquiry form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const p = await projectApi.getBySlug(slug);
        setProject(p);

        // Fetch properties related to this city or general
        const props = await propertyApi.search({ size: 4 });
        setProperties(props.content || []);
      } catch (err) {
        console.error('Failed to load project details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectData();
  }, [slug]);

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      setSending(true);
      await crmApi.submitEnquiry({
        name,
        email,
        phone,
        message: `Interested in project: ${project?.name}. ${message}`,
        source: 'PROJECT_PAGE',
      });
      setEnquirySuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Skeleton className="h-80 w-full rounded-3xl mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-40 w-full" />
          </div>
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Project not found</h2>
        <Link to="/projects" className="mt-4 inline-block text-amber-600 font-semibold hover:underline">
          &larr; Back to all projects
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-amber-600">Home</Link>
          <span>/</span>
          <Link to="/projects" className="hover:text-amber-600">Projects</Link>
          <span>/</span>
          <span className="text-slate-800 font-medium">{project.name}</span>
        </nav>

        {/* Hero banner */}
        <div className="relative rounded-3xl overflow-hidden mb-10 h-72 sm:h-96 shadow-lg bg-slate-900">
          <img
            src={project.bannerImageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80'}
            alt={project.name}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-amber-500 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                {project.status.replace(/_/g, ' ')}
              </span>
              {project.reraNumber && (
                <span className="bg-white/20 backdrop-blur-md text-white text-xs font-medium px-3 py-1 rounded-full font-mono">
                  RERA: {project.reraNumber}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{project.name}</h1>
            <p className="text-slate-300 text-sm mt-1">
              By <span className="text-amber-400 font-bold">{project.developerName}</span> &bull; {project.locality?.name}, {project.city?.name}
            </p>
          </div>
        </div>

        {/* Split details and lead form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Project Overview</h2>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {project.description ||
                  `${project.name} is an elite residential and commercial landmark by ${project.developerName}. Designed by leading architectural firms, it features spacious layouts, panoramic skyline views, high efficiency building automation, and world-class leisure amenities.`}
              </p>

              {/* Specifications Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Towers</span>
                  <span className="text-base font-extrabold text-slate-900">{project.totalTowers || 4} High Rises</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Units</span>
                  <span className="text-base font-extrabold text-slate-900">{project.totalUnits || 320} Residences</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Possession</span>
                  <span className="text-base font-extrabold text-amber-600">{project.completionDate || 'Dec 2027'}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Location</span>
                  <span className="text-base font-extrabold text-slate-900">{project.city?.name || 'Metropolis'}</span>
                </div>
              </div>
            </div>

            {/* Developer Section */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-2">About Developer &bull; {project.developerName}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                With decades of real estate innovation, {project.developerName} is committed to timely delivery, structural excellence, and transparent customer relationships. All projects adhere strictly to state RERA guidelines and environmental certifications.
              </p>
            </div>

            {/* Available inventory in project */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Available Residences in this Development</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {properties.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            </div>
          </div>

          {/* Lead inquiry card */}
          <div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-24">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded">
                Direct Developer Desk
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-2">Download Brochure &amp; Price Sheet</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Register to receive floor plans, payment schedules, and exclusive pre-launch incentives.
              </p>

              {enquirySuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-center">
                  <svg className="w-10 h-10 text-emerald-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="font-bold text-sm">Brochure Request Sent!</p>
                  <p className="text-xs mt-1 text-emerald-700">Check your inbox shortly for the full project prospectus.</p>
                  <button
                    onClick={() => setEnquirySuccess(false)}
                    className="mt-3 text-xs text-emerald-800 font-bold underline"
                  >
                    Submit another enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 text-red-700 border border-red-200 text-xs p-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ramesh Chandra"
                      className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ramesh@example.com"
                      className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Unit Configuration Preference</label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Interested in 3 BHK or 4 BHK penthouse with sea view..."
                      className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-slate-950 hover:bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs transition shadow disabled:opacity-50"
                  >
                    {sending ? 'Processing Request...' : 'Get Instant Access &amp; Price List'}
                  </button>
                  <p className="text-[10px] text-slate-400 text-center">
                    Direct developer pricing with zero brokerage charges.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
