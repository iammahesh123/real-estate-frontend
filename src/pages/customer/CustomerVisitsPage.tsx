import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { visitsApi } from '../../api/visits';
import { SiteVisit } from '../../types';
import { Skeleton } from '../../components/common/Skeleton';
import { formatDate } from '../../utils/format';

export const CustomerVisitsPage: React.FC = () => {
  const [visits, setVisits] = useState<SiteVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Reschedule state
  const [rescheduleModalVisit, setRescheduleModalVisit] = useState<SiteVisit | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('11:00 AM');
  const [rescheduleNotes, setRescheduleNotes] = useState('');

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const data = await visitsApi.getMyVisits();
      setVisits(data || []);
    } catch (err) {
      console.error('Failed to load visits:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const handleCancel = async (visitId: number) => {
    if (!window.confirm('Are you sure you wish to cancel this scheduled property tour?')) return;
    try {
      setActionLoading(visitId);
      await visitsApi.updateStatus(visitId, {
        status: 'CANCELLED',
        notes: 'Cancelled by customer',
      });
      await fetchVisits();
    } catch (err) {
      console.error('Failed to cancel visit:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleModalVisit) return;
    try {
      setActionLoading(rescheduleModalVisit.id);
      await visitsApi.updateStatus(rescheduleModalVisit.id, {
        status: 'RESCHEDULED',
        rescheduledDate: newDate,
        rescheduledTime: newTime,
        notes: rescheduleNotes,
      });
      setRescheduleModalVisit(null);
      await fetchVisits();
    } catch (err) {
      console.error('Failed to reschedule visit:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">Confirmed by Agent</span>;
      case 'SCHEDULED':
        return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">Scheduled &bull; Pending Confirmation</span>;
      case 'RESCHEDULED':
        return <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full">Rescheduled</span>;
      case 'COMPLETED':
        return <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-1 rounded-full">Visit Completed</span>;
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
              Private Viewings
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
              Site Inspection Schedule ({visits.length})
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage your private property walkthrough appointments with certified luxury advisors.
            </p>
          </div>

          <Link
            to="/properties"
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition self-start sm:self-auto"
          >
            Schedule New Visit
          </Link>
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
            <h2 className="text-lg font-bold text-slate-900">No scheduled visits</h2>
            <p className="text-xs text-slate-500 mt-1">
              Select a property and pick your preferred date and time to experience a personalized tour.
            </p>
            <Link
              to="/properties"
              className="mt-6 inline-block bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition"
            >
              Discover Properties
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {visits.map((visit) => (
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
                    <div className="mt-2 text-xs font-bold text-slate-800 bg-slate-100 inline-block px-2.5 py-1 rounded-lg">
                      🗓️ {formatDate(visit.scheduledDate)} at {visit.scheduledTime}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:border-l md:border-slate-200 md:pl-6">
                  <div className="text-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Advisor</span>
                    <p className="font-bold text-slate-800">{visit.agentName}</p>
                    <a href={`tel:${visit.agentPhone}`} className="text-amber-600 hover:underline font-semibold block mt-0.5">
                      {visit.agentPhone}
                    </a>
                  </div>

                  {(visit.status === 'SCHEDULED' || visit.status === 'CONFIRMED') && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setRescheduleModalVisit(visit);
                          setNewDate(visit.scheduledDate);
                          setNewTime(visit.scheduledTime);
                        }}
                        disabled={actionLoading === visit.id}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => handleCancel(visit.id)}
                        disabled={actionLoading === visit.id}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs transition"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reschedule Modal */}
        {rescheduleModalVisit && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
              <h3 className="text-lg font-bold text-slate-900">Reschedule Site Tour</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Choose a new suitable date and time for &quot;{rescheduleModalVisit.propertyTitle}&quot;.
              </p>

              <form onSubmit={handleRescheduleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">New Date *</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Time *</label>
                  <select
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option>10:00 AM</option>
                    <option>11:30 AM</option>
                    <option>02:00 PM</option>
                    <option>04:00 PM</option>
                    <option>05:30 PM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Reason / Notes for Advisor</label>
                  <textarea
                    rows={2}
                    value={rescheduleNotes}
                    onChange={(e) => setRescheduleNotes(e.target.value)}
                    placeholder="e.g. Flight delay, prefer late afternoon..."
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setRescheduleModalVisit(null)}
                    className="px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800"
                  >
                    Update Appointment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
