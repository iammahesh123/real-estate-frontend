import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { visitsApi } from '../../api/visits';
import { SiteVisit } from '../../types';
import { Skeleton } from '../../components/common/Skeleton';
import { formatDate, getWhatsAppLink } from '../../utils/format';

export const AgentVisitsPage: React.FC = () => {
  const [visits, setVisits] = useState<SiteVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const data = await visitsApi.getAgentVisits();
      setVisits(data || []);
    } catch (err) {
      console.error('Failed to load agent visits:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const handleStatusUpdate = async (visitId: number, status: string) => {
    try {
      setActionLoading(visitId);
      await visitsApi.updateStatus(visitId, { status });
      await fetchVisits();
    } catch (err) {
      console.error('Failed to update visit status:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">Confirmed</span>;
      case 'SCHEDULED':
        return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">Pending Your Confirmation</span>;
      case 'RESCHEDULED':
        return <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full">Rescheduled</span>;
      case 'COMPLETED':
        return <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-1 rounded-full">Completed</span>;
      case 'CANCELLED':
        return <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-1 rounded-full">Cancelled</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-1 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pb-6 border-b border-slate-200 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded">
              Physical Tours
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
              Assigned Site Inspections ({visits.length})
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Confirm prospective buyers&apos; requested tour slots and update completion milestones.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-2xl w-full" />
            ))}
          </div>
        ) : visits.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-xl mx-auto my-8">
            <svg className="w-14 h-14 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h2 className="text-lg font-bold text-slate-900">No site visits scheduled</h2>
            <p className="text-xs text-slate-500 mt-1">
              When clients book a tour for your listings, they will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {visits.map((visit) => {
              const waUrl = getWhatsAppLink(
                visit.customerPhone,
                `Hello ${visit.customerName}, I am confirming our scheduled tour for ${visit.propertyTitle} on ${formatDate(visit.scheduledDate)} at ${visit.scheduledTime}.`
              );

              return (
                <div
                  key={visit.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex items-start sm:items-center space-x-4">
                    <img
                      src={visit.primaryImageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=240&q=80'}
                      alt={visit.propertyTitle}
                      className="w-20 h-20 rounded-xl object-cover border border-slate-100"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusBadge(visit.status)}
                      </div>
                      <Link
                        to={`/properties/${visit.propertySlug}`}
                        className="text-base font-bold text-slate-900 hover:text-amber-600 transition"
                      >
                        {visit.propertyTitle}
                      </Link>
                      <p className="text-xs text-slate-500 mt-0.5">{visit.propertyAddress}, {visit.propertyCity}</p>
                      <div className="mt-2 text-xs font-bold text-slate-800 bg-amber-50 text-amber-900 border border-amber-200 inline-block px-2.5 py-1 rounded-lg">
                        🗓️ {formatDate(visit.scheduledDate)} at {visit.scheduledTime}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:border-l md:border-slate-200 md:pl-6">
                    <div className="text-xs">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Client</span>
                      <p className="font-bold text-slate-900">{visit.customerName}</p>
                      <p className="text-slate-500 text-[11px]">{visit.customerEmail}</p>
                      <div className="flex items-center space-x-2 mt-1.5">
                        <a href={`tel:${visit.customerPhone}`} className="text-slate-700 font-bold hover:underline">
                          {visit.customerPhone}
                        </a>
                        <span>&bull;</span>
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-600 hover:underline font-bold"
                        >
                          WhatsApp
                        </a>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {visit.status === 'SCHEDULED' && (
                        <button
                          onClick={() => handleStatusUpdate(visit.id, 'CONFIRMED')}
                          disabled={actionLoading === visit.id}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-sm"
                        >
                          Confirm Tour
                        </button>
                      )}

                      {visit.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleStatusUpdate(visit.id, 'COMPLETED')}
                          disabled={actionLoading === visit.id}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition shadow-sm"
                        >
                          Mark Completed
                        </button>
                      )}

                      {visit.status !== 'CANCELLED' && visit.status !== 'COMPLETED' && (
                        <button
                          onClick={() => handleStatusUpdate(visit.id, 'CANCELLED')}
                          disabled={actionLoading === visit.id}
                          className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs transition"
                        >
                          Cancel
                        </button>
                      )}
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
