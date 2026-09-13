import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertyApi } from '../../api/properties';
import { PropertySummary } from '../../types';
import { Skeleton } from '../../components/common/Skeleton';
import { formatPrice } from '../../utils/format';

export const AgentPropertiesPage: React.FC = () => {
  const [properties, setProperties] = useState<PropertySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchMyProperties = async () => {
    try {
      setLoading(true);
      const res = await propertyApi.getMyProperties(0, 50);
      setProperties(res.content || []);
    } catch (err) {
      console.error('Failed to load agent properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to remove this property listing?')) return;
    try {
      setDeletingId(id);
      await propertyApi.delete(id);
      await fetchMyProperties();
    } catch (err) {
      console.error('Failed to delete property:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">Live / Approved</span>;
      case 'PENDING_APPROVAL':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">Pending Review</span>;
      case 'REJECTED':
        return <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">Rejected</span>;
      case 'SOLD':
        return <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">Sold</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">{status}</span>;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pb-6 border-b border-slate-200 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded">
              Portfolio Management
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
              My Property Listings ({properties.length})
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Properties listed by your agency across residential and commercial sectors.
            </p>
          </div>

          <Link
            to="/agent/properties/create"
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl text-xs shadow transition flex items-center self-start sm:self-auto"
          >
            + Add New Property Listing
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((n) => (
              <Skeleton key={n} className="h-20 w-full rounded-2xl" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-xl mx-auto my-8">
            <svg className="w-14 h-14 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h2 className="text-lg font-bold text-slate-900">You haven&apos;t created any listings yet</h2>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              Publish your first luxury penthouse, gated villa, or Grade-A commercial asset to reach premium buyers.
            </p>
            <Link
              to="/agent/properties/create"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow"
            >
              Post Property Now
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Property</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {properties.map((prop) => (
                    <tr key={prop.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={prop.primaryImageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&q=80'}
                            alt={prop.title}
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                          <div>
                            <Link
                              to={`/properties/${prop.slug}`}
                              className="font-bold text-slate-900 hover:text-amber-600 transition"
                            >
                              {prop.title}
                            </Link>
                            <p className="text-[11px] text-slate-400 font-mono mt-0.5">{prop.propertyCode} &bull; {prop.city}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900 text-sm">
                        {formatPrice(prop.price)}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {prop.propertyType} &bull; {prop.listingType}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(prop.status || prop.approvalStatus || 'PENDING_APPROVAL')}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/properties/${prop.slug}`}
                            className="p-1.5 text-slate-500 hover:text-slate-900 bg-slate-100 rounded-lg hover:bg-slate-200"
                            title="View live page"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => handleDelete(prop.id)}
                            disabled={deletingId === prop.id}
                            className="p-1.5 text-rose-500 hover:text-rose-700 bg-rose-50 rounded-lg hover:bg-rose-100 transition"
                            title="Delete listing"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
