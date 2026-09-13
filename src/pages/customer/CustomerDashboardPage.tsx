import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dashboardApi, favouriteApi } from '../../api/dashboard';
import { visitsApi } from '../../api/visits';
import { CustomerDashboardStats, PropertySummary, SiteVisit } from '../../types';
import { PropertyCard } from '../../components/property/PropertyCard';
import { Skeleton } from '../../components/common/Skeleton';
import { formatDate } from '../../utils/format';

export const CustomerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<CustomerDashboardStats | null>(null);
  const [favourites, setFavourites] = useState<PropertySummary[]>([]);
  const [upcomingVisits, setUpcomingVisits] = useState<SiteVisit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const [statsData, favsData, visitsData] = await Promise.all([
          dashboardApi.getCustomerStats(),
          favouriteApi.getFavourites(),
          visitsApi.getMyVisits(),
        ]);
        setStats(statsData);
        setFavourites(favsData || []);
        // Filter upcoming scheduled visits
        const upcoming = (visitsData || []).filter(
          (v) => v.status === 'SCHEDULED' || v.status === 'CONFIRMED'
        );
        setUpcomingVisits(upcoming);
      } catch (err) {
        console.error('Failed to load customer dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-10 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10">
            <span className="bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-amber-400/30">
              Buyer &amp; Investor Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-3">
              Welcome back, {user?.firstName || 'Valued Client'}
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Track your saved luxury listings, inspect scheduled site appointments, and communicate with dedicated property consultants.
            </p>
          </div>
        </div>

        {/* KPI Metrics */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Saved Homes</div>
              <div className="text-3xl font-extrabold text-slate-900 mt-2">{stats?.totalFavourites || 0}</div>
              <Link to="/customer/favourites" className="text-xs text-amber-600 font-bold hover:underline mt-2 inline-block">
                View favourites &rarr;
              </Link>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Enquiries</div>
              <div className="text-3xl font-extrabold text-slate-900 mt-2">{stats?.totalEnquiries || 0}</div>
              <Link to="/customer/enquiries" className="text-xs text-amber-600 font-bold hover:underline mt-2 inline-block">
                View status &rarr;
              </Link>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Upcoming Visits</div>
              <div className="text-3xl font-extrabold text-amber-600 mt-2">{stats?.upcomingVisits || 0}</div>
              <Link to="/customer/visits" className="text-xs text-amber-600 font-bold hover:underline mt-2 inline-block">
                Manage schedule &rarr;
              </Link>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Tours Conducted</div>
              <div className="text-3xl font-extrabold text-slate-900 mt-2">{stats?.totalVisits || 0}</div>
              <span className="text-xs text-slate-400 mt-2 inline-block">Verified Site Visits</span>
            </div>
          </div>
        )}

        {/* Section: Upcoming Site Visits */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Upcoming Site Inspection Appointments</h2>
              <p className="text-xs text-slate-500">Confirmed &amp; scheduled tours accompanied by licensed agents.</p>
            </div>
            <Link to="/customer/visits" className="text-xs font-bold text-amber-600 hover:text-amber-700">
              All Visits ({upcomingVisits.length}) &rarr;
            </Link>
          </div>

          {upcomingVisits.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-sm font-semibold text-slate-700">No upcoming tours scheduled</p>
              <p className="text-xs text-slate-500 mt-1">
                Browse our luxury properties and click &quot;Schedule Site Visit&quot; to plan a physical walkthrough.
              </p>
              <Link
                to="/properties"
                className="mt-4 inline-block bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl"
              >
                Browse Marketplace
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingVisits.map((visit) => (
                <div
                  key={visit.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200 gap-4"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={visit.primaryImageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&q=80'}
                      alt={visit.propertyTitle}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div>
                      <Link
                        to={`/properties/${visit.propertySlug}`}
                        className="text-sm font-bold text-slate-900 hover:text-amber-600 transition"
                      >
                        {visit.propertyTitle}
                      </Link>
                      <p className="text-xs text-slate-500 mt-0.5">{visit.propertyAddress}, {visit.propertyCity}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded">
                          📅 {formatDate(visit.scheduledDate)} at {visit.scheduledTime}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          visit.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {visit.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right sm:border-l sm:border-slate-200 sm:pl-6 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Assigned Agent</span>
                      <span className="text-xs font-bold text-slate-800">{visit.agentName}</span>
                    </div>
                    {visit.agentPhone && (
                      <a
                        href={`tel:${visit.agentPhone}`}
                        className="text-xs text-amber-600 font-bold hover:underline mt-1 block"
                      >
                        Call Agent
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section: Saved Properties */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recently Saved Listings</h2>
              <p className="text-xs text-slate-500">Quick access to your curated property shortlist.</p>
            </div>
            <Link to="/customer/favourites" className="text-xs font-bold text-amber-600 hover:text-amber-700">
              View All Favourites &rarr;
            </Link>
          </div>

          {favourites.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
              <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h3 className="text-base font-bold text-slate-800">No saved properties yet</h3>
              <p className="text-xs text-slate-500 mt-1">Tap the heart icon on any property card to save it here.</p>
              <Link
                to="/properties"
                className="mt-4 inline-block bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm"
              >
                Explore Properties
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favourites.slice(0, 3).map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
