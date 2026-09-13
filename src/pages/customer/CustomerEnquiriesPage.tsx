import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { crmApi } from '../../api/crm';
import { Enquiry } from '../../types';
import { Skeleton } from '../../components/common/Skeleton';
import { formatDate } from '../../utils/format';

export const CustomerEnquiriesPage: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        setLoading(true);
        const data = await crmApi.getMyEnquiries();
        setEnquiries(data || []);
      } catch (err) {
        console.error('Failed to load customer enquiries:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiries();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">New / Received</span>;
      case 'CONTACTED':
        return <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full">Advisor Reached Out</span>;
      case 'QUALIFIED':
        return <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-1 rounded-full">Tour / Review In-Progress</span>;
      case 'CLOSED':
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">Completed</span>;
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
              Communication History
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
              My Property Enquiries ({enquiries.length})
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Track the progress of your requests, advisor assignments, and consultation timelines.
            </p>
          </div>

          <Link
            to="/properties"
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition self-start sm:self-auto"
          >
            Submit New Enquiry
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28 rounded-2xl w-full" />
            ))}
          </div>
        ) : enquiries.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-xl mx-auto my-8">
            <svg className="w-14 h-14 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h2 className="text-lg font-bold text-slate-900">No enquiries submitted yet</h2>
            <p className="text-xs text-slate-500 mt-1">
              When you submit a consultation request or schedule a tour on any property, it will appear here.
            </p>
            <Link
              to="/properties"
              className="mt-6 inline-block bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition"
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {enquiries.map((enq) => (
              <div
                key={enq.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {getStatusBadge(enq.status)}
                    <span className="text-xs text-slate-400">
                      Submitted on {formatDate(enq.createdAt)}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {enq.propertyTitle ? (
                      <Link
                        to={`/properties/${enq.propertySlug}`}
                        className="hover:text-amber-600 transition"
                      >
                        {enq.propertyTitle}
                      </Link>
                    ) : (
                      'General Advisory Consultation'
                    )}
                  </h3>

                  {enq.propertyCity && (
                    <p className="text-xs text-slate-500">Location: {enq.propertyCity}</p>
                  )}

                  {enq.message && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                      &quot;{enq.message}&quot;
                    </p>
                  )}
                </div>

                {/* Assigned Agent Box */}
                <div className="md:w-64 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Assigned Property Advisor
                  </span>
                  {enq.assignedAgentName ? (
                    <div className="mt-1">
                      <p className="font-bold text-slate-900 text-sm">{enq.assignedAgentName}</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">Certified Luxury Specialist</p>
                      <span className="inline-block mt-2 text-amber-600 font-bold text-xs">
                        Reviewing your requirements
                      </span>
                    </div>
                  ) : (
                    <p className="text-slate-500 mt-1 italic">Under automated qualification queue</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
