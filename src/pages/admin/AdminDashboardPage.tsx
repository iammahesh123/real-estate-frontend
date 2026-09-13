import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../api/dashboard';
import { AdminDashboardStats } from '../../types';
import { Skeleton } from '../../components/common/Skeleton';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        const data = await dashboardApi.getAdminStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="bg-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-rose-400/30">
              Platform Administration
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-3">
              Master System Control Center
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Live marketplace inventory oversight, broker verification, lead routing, and platform analytics.
            </p>
          </div>

          <div className="flex gap-3 shrink-0">
            <Link
              to="/admin/properties/pending"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-4 py-2.5 rounded-xl text-xs transition shadow"
            >
              Pending Approvals ({stats?.pendingApprovals || 0})
            </Link>
            <Link
              to="/admin/users"
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition border border-white/20"
            >
              Manage Users
            </Link>
          </div>
        </div>

        {/* Global KPI Cards */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400">Total Properties</span>
              <div className="text-3xl font-black text-slate-900 mt-2">{stats?.totalProperties || 0}</div>
              <Link to="/admin/properties" className="text-xs text-amber-600 font-bold hover:underline mt-2 block">
                All listings &rarr;
              </Link>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400">Pending Review</span>
              <div className="text-3xl font-black text-amber-600 mt-2">{stats?.pendingApprovals || 0}</div>
              <Link to="/admin/properties/pending" className="text-xs text-amber-600 font-bold hover:underline mt-2 block">
                Review queue &rarr;
              </Link>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400">Registered Users</span>
              <div className="text-3xl font-black text-slate-900 mt-2">{stats?.totalCustomers || 0}</div>
              <span className="text-xs text-slate-500 mt-2 block">Buyers / Investors</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400">Verified Agents</span>
              <div className="text-3xl font-black text-slate-900 mt-2">{stats?.totalAgents || 0}</div>
              <span className="text-xs text-slate-500 mt-2 block">Brokers / Realtors</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400">Total Leads</span>
              <div className="text-3xl font-black text-slate-900 mt-2">{stats?.totalLeads || 0}</div>
              <Link to="/admin/leads" className="text-xs text-amber-600 font-bold hover:underline mt-2 block">
                Lead control &rarr;
              </Link>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400">Site Tours</span>
              <div className="text-3xl font-black text-emerald-600 mt-2">{stats?.totalSiteVisits || 0}</div>
              <span className="text-xs text-slate-500 mt-2 block">{stats?.upcomingVisits || 0} Upcoming</span>
            </div>
          </div>
        )}

        {/* Analytics Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Properties by City */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4">Inventory Distribution by City</h2>
            {(!stats?.propertiesByCity || Object.keys(stats.propertiesByCity).length === 0) ? (
              <p className="text-xs text-slate-400 py-6 text-center">No city breakdown data available.</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(stats.propertiesByCity).map(([city, count]) => {
                  const percent = Math.round((count / (stats.totalProperties || 1)) * 100);
                  return (
                    <div key={city} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-800">{city}</span>
                        <span className="text-slate-500 font-bold">{count} ({percent}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Properties by Category */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4">Inventory by Asset Category</h2>
            {(!stats?.propertiesByCategory || Object.keys(stats.propertiesByCategory).length === 0) ? (
              <p className="text-xs text-slate-400 py-6 text-center">No category breakdown data available.</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(stats.propertiesByCategory).map(([category, count]) => {
                  const percent = Math.round((count / (stats.totalProperties || 1)) * 100);
                  return (
                    <div key={category} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-800">{category}</span>
                        <span className="text-slate-500 font-bold">{count} ({percent}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-slate-900 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
