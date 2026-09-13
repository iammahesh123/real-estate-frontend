import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertyApi } from '../../api/properties';
import { PropertySummary } from '../../types';
import { Skeleton } from '../../components/common/Skeleton';
import { formatPrice } from '../../utils/format';

export const AdminPendingPropertiesPage: React.FC = () => {
  const [pendingProperties, setPendingProperties] = useState<PropertySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Reject modal state
  const [rejectProperty, setRejectProperty] = useState<PropertySummary | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await propertyApi.getPendingApprovals(0, 50);
      setPendingProperties(res.content || []);
    } catch (err) {
      console.error('Failed to load pending properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      setActionLoading(id);
      await propertyApi.approveOrReject(id, 'APPROVED');
      await fetchPending();
    } catch (err) {
      console.error('Failed to approve property:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectProperty) return;
    try {
      setActionLoading(rejectProperty.id);
      await propertyApi.approveOrReject(rejectProperty.id, 'REJECTED', rejectionReason);
      setRejectProperty(null);
      setRejectionReason('');
      await fetchPending();
    } catch (err) {
      console.error('Failed to reject property:', err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pb-6 border-b border-slate-200 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded">
              Quality Assurance &amp; Legal Audit
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
              Pending Property Approvals ({pendingProperties.length})
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Review agent-submitted listings for accuracy, pricing realism, and media standards before publishing to the public marketplace.
            </p>
          </div>

          <Link
            to="/admin/properties"
            className="text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-200 bg-white px-4 py-2 rounded-xl"
          >
            &larr; Back to All Properties
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28 rounded-2xl w-full" />
            ))}
          </div>
        ) : pendingProperties.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-xl mx-auto my-8">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 fill-current" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-slate-900">All submissions have been reviewed!</h2>
            <p className="text-xs text-slate-500 mt-1">
              There are currently no new property listings awaiting verification.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingProperties.map((prop) => (
              <div
                key={prop.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-start sm:items-center space-x-4">
                  <img
                    src={prop.primaryImageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=240&q=80'}
                    alt={prop.title}
                    className="w-20 h-20 rounded-xl object-cover border border-slate-100"
                  />
                  <div>
                    <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      Pending Verification
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      <Link to={`/properties/${prop.slug}`} className="hover:text-amber-600 transition">
                        {prop.title}
                      </Link>
                    </h3>
                    <p className="text-xs text-slate-500">{prop.propertyType} &bull; {prop.city}</p>
                    <p className="text-sm font-black text-slate-900 mt-1">{formatPrice(prop.price)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end md:self-center">
                  <Link
                    to={`/properties/${prop.slug}`}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                  >
                    Inspect Details
                  </Link>
                  <button
                    onClick={() => {
                      setRejectProperty(prop);
                      setRejectionReason('');
                    }}
                    disabled={actionLoading === prop.id}
                    className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs transition"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(prop.id)}
                    disabled={actionLoading === prop.id}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs transition shadow-sm"
                  >
                    {actionLoading === prop.id ? 'Processing...' : 'Approve & Publish'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rejection Modal */}
        {rejectProperty && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
              <h3 className="text-lg font-bold text-slate-900">Reject Property Listing</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Please provide feedback for &quot;{rejectProperty.title}&quot; so the broker can rectify issues.
              </p>

              <form onSubmit={handleRejectSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Rejection *</label>
                  <textarea
                    rows={3}
                    required
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g. Inaccurate location address, missing carpet area documentation, or blurry photos..."
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setRejectProperty(null)}
                    className="px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-rose-600 text-white font-bold rounded-xl text-xs hover:bg-rose-700"
                  >
                    Confirm Rejection
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
