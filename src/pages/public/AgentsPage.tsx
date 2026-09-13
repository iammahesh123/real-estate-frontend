import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { agentApi, AgentProfile } from '../../api/agents';
import { Skeleton } from '../../components/common/Skeleton';
import { getWhatsAppLink } from '../../utils/format';

export const AgentsPage: React.FC = () => {
  const [agents, setAgents] = useState<AgentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        const res = await agentApi.getAll(0, 50);
        setAgents(res.content || []);
      } catch (err) {
        console.error('Failed to load agents:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  const filtered = agents.filter((a) =>
    a.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.agencyName && a.agencyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (a.specialization && a.specialization.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Trusted Real Estate Advisors
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
            Meet Our Certified Property Specialists
          </h1>
          <p className="text-slate-600 mt-3 text-base">
            Work with verified, top-performing real estate professionals who understand luxury real estate, market trends, and legal compliance.
          </p>

          {/* Search bar */}
          <div className="mt-6 max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Search by agent name, agency or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
            />
            <svg
              className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-12 w-full" />
                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-lg font-bold text-slate-800">No agents found</h3>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((agent) => {
              const waUrl = getWhatsAppLink(
                agent.phone || '',
                `Hello ${agent.fullName}, I discovered your profile on EstateHub and would like to inquire about luxury properties.`
              );

              return (
                <div
                  key={agent.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={agent.profileImageUrl || `https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80`}
                          alt={agent.fullName}
                          className="w-16 h-16 rounded-full object-cover border-2 border-amber-500 shadow-sm"
                        />
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <h3 className="font-bold text-slate-900 text-lg leading-snug">{agent.fullName}</h3>
                            {agent.verified && (
                              <span className="text-blue-500" title="Verified Agent">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-amber-700 font-semibold">{agent.agencyName || 'Independent Prime Partner'}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{agent.specialization || 'Luxury Residential & Commercial'}</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-slate-600 text-xs mt-4 line-clamp-3 leading-relaxed">
                      {agent.bio || 'Dedicated real estate professional specialized in premium residential properties, luxury high-rises, and prime commercial investments with total legal transparency.'}
                    </p>

                    {/* Stats pills */}
                    <div className="grid grid-cols-3 gap-2 mt-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                      <div>
                        <span className="block text-xs text-slate-400 font-medium">Experience</span>
                        <span className="font-bold text-slate-800 text-sm">{agent.experienceYears || 5}+ Yrs</span>
                      </div>
                      <div className="border-x border-slate-200">
                        <span className="block text-xs text-slate-400 font-medium">Deals</span>
                        <span className="font-bold text-slate-800 text-sm">{agent.totalDealsClosed || 45}+</span>
                      </div>
                      <div>
                        <span className="block text-xs text-slate-400 font-medium">Listings</span>
                        <span className="font-bold text-slate-800 text-sm">{agent.activeListingsCount || 8} Active</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="bg-slate-50/70 px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Link
                      to={`/agents/${agent.id}`}
                      className="text-xs font-bold text-slate-700 hover:text-amber-600 transition"
                    >
                      View Profile &rarr;
                    </Link>
                    <div className="flex items-center space-x-2">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg text-xs font-semibold flex items-center shadow-sm transition"
                        title="Chat on WhatsApp"
                      >
                        <svg className="w-4 h-4 fill-current mr-1" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                        </svg>
                        WhatsApp
                      </a>
                      <a
                        href={`tel:${agent.phone}`}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-lg text-xs font-semibold transition shadow-sm"
                      >
                        Call
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
