import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { agentApi, AgentProfile } from '../../api/agents';
import { propertyApi } from '../../api/properties';
import { crmApi } from '../../api/crm';
import { PropertySummary } from '../../types';
import { PropertyCard } from '../../components/property/PropertyCard';
import { Skeleton } from '../../components/common/Skeleton';
import { getWhatsAppLink } from '../../utils/format';

export const AgentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<AgentProfile | null>(null);
  const [properties, setProperties] = useState<PropertySummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Enquiry form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAgentAndProperties = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const agentData = await agentApi.getById(Number(id));
        setAgent(agentData);

        // Fetch properties (or recent featured properties as showcase)
        const propsData = await propertyApi.search({ size: 6 });
        setProperties(propsData.content || []);
      } catch (err) {
        console.error('Failed to load agent profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentAndProperties();
  }, [id]);

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      setSending(true);
      await crmApi.submitEnquiry({
        name,
        email,
        phone,
        message,
        source: 'AGENT_PROFILE',
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
        <Skeleton className="h-64 w-full rounded-3xl mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="h-96 rounded-2xl" />
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Agent profile not found</h2>
        <Link to="/agents" className="mt-4 inline-block text-amber-600 font-semibold hover:underline">
          &larr; Back to all agents
        </Link>
      </div>
    );
  }

  const waUrl = getWhatsAppLink(
    agent.phone || '',
    `Hello ${agent.fullName}, I found your profile on EstateHub and would like to consult with you.`
  );

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-amber-600">Home</Link>
          <span>/</span>
          <Link to="/agents" className="hover:text-amber-600">Agents</Link>
          <span>/</span>
          <span className="text-slate-800 font-medium">{agent.fullName}</span>
        </nav>

        {/* Hero Banner Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 mb-10 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -z-10" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <img
              src={agent.profileImageUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'}
              alt={agent.fullName}
              className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl object-cover border-4 border-amber-500/20 shadow-lg"
            />

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {agent.agencyName || 'EstateHub Premier Advisor'}
                </span>
                {agent.verified && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center">
                    <svg className="w-3.5 h-3.5 mr-1 fill-current" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified Partner
                  </span>
                )}
                {agent.licenseNumber && (
                  <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded">
                    RERA: {agent.licenseNumber}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{agent.fullName}</h1>
              <p className="text-slate-500 text-sm mt-1">{agent.specialization || 'Residential Luxury & Commercial Investments'}</p>

              <p className="text-slate-600 text-sm mt-4 leading-relaxed max-w-2xl">
                {agent.bio || 'With extensive knowledge of prime micro-markets, I provide end-to-end consulting for luxury home buyers, high-net-worth investors, and corporate leases.'}
              </p>

              {/* Quick contact buttons */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-6">
                <a
                  href={`tel:${agent.phone}`}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow transition"
                >
                  Call {agent.phone}
                </a>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow transition flex items-center"
                >
                  <svg className="w-4 h-4 fill-current mr-2" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                  </svg>
                  Chat on WhatsApp
                </a>
                <a
                  href={`mailto:${agent.email}`}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm transition"
                >
                  Email Agent
                </a>
              </div>
            </div>

            {/* Performance KPI Cards */}
            <div className="flex flex-row md:flex-col gap-3 w-full md:w-48">
              <div className="flex-1 bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-center">
                <div className="text-2xl font-extrabold text-slate-900">{agent.experienceYears || 5}+</div>
                <div className="text-xs text-slate-500 font-medium">Years Active</div>
              </div>
              <div className="flex-1 bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-center">
                <div className="text-2xl font-extrabold text-amber-600">{agent.totalDealsClosed || 45}+</div>
                <div className="text-xs text-slate-500 font-medium">Deals Closed</div>
              </div>
              <div className="flex-1 bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-center">
                <div className="text-2xl font-extrabold text-slate-900">{agent.activeListingsCount || 8}</div>
                <div className="text-xs text-slate-500 font-medium">Active Listings</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content split: Listings vs Enquiry */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Agent's showcase listings */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Featured Listings by {agent.fullName}</h2>
              <Link to="/properties" className="text-xs font-bold text-amber-600 hover:text-amber-700">
                View All Marketplace &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {properties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          </div>

          {/* Direct Lead Enquiry Card */}
          <div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-bold text-slate-900">Consult with {agent.fullName}</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Leave your details below and our specialist will reach out within 2 business hours.
              </p>

              {enquirySuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-center">
                  <svg className="w-10 h-10 text-emerald-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="font-bold text-sm">Consultation Requested!</p>
                  <p className="text-xs mt-1 text-emerald-700">The agent has been notified and will contact you shortly.</p>
                  <button
                    onClick={() => setEnquirySuccess(false)}
                    className="mt-3 text-xs text-emerald-800 font-bold underline"
                  >
                    Send another message
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
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Vikram Malhotra"
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
                      placeholder="vikram@example.com"
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
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Message or Requirements</label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="I am interested in 3 BHK sea-facing apartments in Bandra or Worli..."
                      className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition shadow-sm disabled:opacity-50"
                  >
                    {sending ? 'Transmitting Request...' : 'Request Private Consultation'}
                  </button>
                  <p className="text-[10px] text-slate-400 text-center">
                    Your contact information is encrypted and never shared with 3rd-party telemarketers.
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
