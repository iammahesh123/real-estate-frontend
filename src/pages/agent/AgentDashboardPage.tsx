import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dashboardApi } from '../../api/dashboard';
import { crmApi } from '../../api/crm';
import { visitsApi } from '../../api/visits';
import { AgentDashboardStats, Lead, SiteVisit } from '../../types';
import { Skeleton } from '../../components/common/Skeleton';
import { formatDate } from '../../utils/format';

export const AgentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AgentDashboardStats | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [visits, setVisits] = useState<SiteVisit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAgentData = async () => {
      try {
        setLoading(true);
        const [statsData, leadsData, visitsData] = await Promise.all([
          dashboardApi.getAgentStats(),
          crmApi.getLeads(undefined, 0, 5),
          visitsApi.getAgentVisits(),
        ]);
        setStats(statsData);
        setLeads(leadsData.content || []);
        setVisits(visitsData || []);
      } catch (err) {
        console.error('Failed to load agent dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAgentData();
  }, []);

  const pendingVisits = visits.filter((v) => v.status === 'SCHEDULED');

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-md">
          <div>
            <span className="bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-amber-400/30">
              Agent CRM &amp; Sales Desk
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-3">
              Advisor Dashboard &bull; {user?.fullName || 'Agent'}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Track assigned client inquiries, lead conversion stages, and upcoming property viewings.
            </p>
          </div>

          <Link
            to="/agent/properties/create"
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-5 py-3 rounded-xl text-xs transition shadow flex items-center shrink-0"
          >
            <span className="text-base mr-1.5">+</span> Post New Property
          </Link>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400">Active Listings</span>
              <div className="text-3xl font-black text-slate-900 mt-2">{stats?.activeProperties || 0}</div>
              <Link to="/agent/properties" className="text-xs text-amber-600 font-bold hover:underline mt-2 block">
                Manage ({stats?.totalProperties || 0}) &rarr;
              </Link>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400">Total Leads</span>
              <div className="text-3xl font-black text-slate-900 mt-2">{stats?.totalLeads || 0}</div>
              <span className="text-xs text-blue-600 font-semibold mt-2 block">
                {stats?.newLeads || 0} New / Uncontacted
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400">Qualified Pipeline</span>
              <div className="text-3xl font-black text-amber-600 mt-2">{stats?.qualifiedLeads || 0}</div>
              <Link to="/agent/leads" className="text-xs text-amber-600 font-bold hover:underline mt-2 block">
                View pipeline &rarr;
              </Link>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400">Pending Visits</span>
              <div className="text-3xl font-black text-rose-600 mt-2">{stats?.pendingSiteVisits || pendingVisits.length}</div>
              <Link to="/agent/visits" className="text-xs text-rose-600 font-bold hover:underline mt-2 block">
                Confirm visits &rarr;
              </Link>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400">Closed Deals</span>
              <div className="text-3xl font-black text-emerald-600 mt-2">{stats?.closedDeals || 0}</div>
              <span className="text-xs text-slate-500 mt-2 block">
                {stats?.conversionRate || 0}% Conversion
              </span>
            </div>
          </div>
        )}

        {/* Action split: Urgent Visits vs Recent Leads */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Site Visits Section */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Upcoming Site Visits</h2>
                <p className="text-xs text-slate-500">View customer requests requiring your confirmation</p>
              </div>
              <Link to="/agent/visits" className="text-xs font-bold text-amber-600 hover:underline">
                View All ({visits.length}) &rarr;
              </Link>
            </div>

            {visits.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center bg-slate-50 rounded-2xl">
                No site visits currently assigned to your account.
              </p>
            ) : (
              <div className="space-y-3">
                {visits.slice(0, 4).map((v) => (
                  <div key={v.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{v.propertyTitle}</p>
                      <p className="text-[11px] text-slate-500">Client: {v.customerName} &bull; {v.customerPhone}</p>
                      <div className="mt-1 text-[11px] font-semibold text-amber-700">
                        {formatDate(v.scheduledDate)} at {v.scheduledTime}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        v.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {v.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Leads Section */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Assigned Client Leads</h2>
                <p className="text-xs text-slate-500">Enquiries automatically routed to your sales desk</p>
              </div>
              <Link to="/agent/leads" className="text-xs font-bold text-amber-600 hover:underline">
                Full Pipeline ({leads.length}) &rarr;
              </Link>
            </div>

            {leads.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center bg-slate-50 rounded-2xl">
                No leads currently in your pipeline.
              </p>
            ) : (
              <div className="space-y-3">
                {leads.map((l) => (
                  <div key={l.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{l.clientName}</p>
                      <p className="text-[11px] text-slate-500">{l.propertyTitle || 'General Consultation'}</p>
                      <p className="text-[11px] text-slate-400">{l.clientPhone} &bull; {l.clientEmail}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-amber-100 text-amber-900 uppercase">
                        {l.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
