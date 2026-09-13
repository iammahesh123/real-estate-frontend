import React, { useState, useEffect } from 'react';
import { crmApi } from '../../api/crm';
import { Lead } from '../../types';
import { Skeleton } from '../../components/common/Skeleton';
import { formatDate, formatPrice, getWhatsAppLink } from '../../utils/format';

export const AgentLeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Active Lead Detail / Action Drawer
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newStatus, setNewStatus] = useState('CONTACTED');
  const [statusRemarks, setStatusRemarks] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await crmApi.getLeads(statusFilter || undefined, 0, 50);
      setLeads(data.content || []);
    } catch (err) {
      console.error('Failed to load agent leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter]);

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    try {
      setActionLoading(true);
      const updated = await crmApi.updateLeadStatus(selectedLead.id, {
        status: newStatus,
        remarks: statusRemarks,
      });
      setSelectedLead(updated);
      await fetchLeads();
    } catch (err) {
      console.error('Failed to update lead status:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !noteContent.trim()) return;
    try {
      setActionLoading(true);
      const updated = await crmApi.addLeadNote(selectedLead.id, noteContent);
      setSelectedLead(updated);
      setNoteContent('');
      await fetchLeads();
    } catch (err) {
      console.error('Failed to add note to lead:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (st: string) => {
    switch (st) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CONTACTED':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'QUALIFIED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'WON':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'LOST':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pb-6 border-b border-slate-200 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded">
              CRM Pipeline
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
              Client Leads &amp; Deals ({leads.length})
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Active buyers and prospective investors routed to your desk. Track qualification stages and conversation notes.
            </p>
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-2">
            {['', 'NEW', 'CONTACTED', 'QUALIFIED', 'WON', 'LOST'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {st === '' ? 'All Statuses' : st}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-2xl" />
            ))}
          </div>
        ) : leads.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-xl mx-auto my-8">
            <h2 className="text-lg font-bold text-slate-900">No leads found</h2>
            <p className="text-xs text-slate-500 mt-1">
              When buyers submit property inquiries or request private consultations, they will appear here.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Client Name &amp; Contact</th>
                    <th className="px-6 py-4">Inquired Property</th>
                    <th className="px-6 py-4">Budget / Source</th>
                    <th className="px-6 py-4">Stage</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.map((lead) => {
                    const waUrl = getWhatsAppLink(
                      lead.clientPhone,
                      `Hello ${lead.clientName}, I am your assigned advisor on EstateHub regarding ${lead.propertyTitle || 'your inquiry'}.`
                    );

                    return (
                      <tr key={lead.id} className="hover:bg-slate-50/60 transition">
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-900 text-sm">{lead.clientName}</p>
                          <p className="text-[11px] text-slate-500">{lead.clientEmail}</p>
                          <p className="text-[11px] text-slate-600 font-mono mt-0.5">{lead.clientPhone}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-800 max-w-xs truncate">
                            {lead.propertyTitle || 'General Inbound Inquiry'}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Received {formatDate(lead.createdAt)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-900">
                            {lead.budget ? formatPrice(lead.budget) : 'Not specified'}
                          </p>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">
                            Via {lead.leadSource}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition"
                              title="Chat on WhatsApp"
                            >
                              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                              </svg>
                            </a>
                            <button
                              onClick={() => {
                                setSelectedLead(lead);
                                setNewStatus(lead.status);
                              }}
                              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition"
                            >
                              Update &amp; Notes
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Lead Action & Notes Modal */}
        {selectedLead && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${getStatusColor(selectedLead.status)}`}>
                    {selectedLead.status}
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-2">{selectedLead.clientName}</h3>
                  <p className="text-xs text-slate-500">{selectedLead.clientEmail} &bull; {selectedLead.clientPhone}</p>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 text-xl font-bold"
                >
                  &times;
                </button>
              </div>

              {/* Status Update Form */}
              <form onSubmit={handleStatusUpdate} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Update Sales Stage</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white"
                    >
                      <option value="NEW">New / Uncontacted</option>
                      <option value="CONTACTED">Contacted Client</option>
                      <option value="QUALIFIED">Qualified / Site Tour Scheduled</option>
                      <option value="WON">Closed / Deal Won</option>
                      <option value="LOST">Lost / Dropped</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Remarks</label>
                    <input
                      type="text"
                      value={statusRemarks}
                      onChange={(e) => setStatusRemarks(e.target.value)}
                      placeholder="e.g. Discussed 3 BHK budget, tour this Sat"
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition"
                >
                  Save Status Change
                </button>
              </form>

              {/* Add Note Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Add CRM Note</h4>
                <form onSubmit={handleAddNote} className="space-y-2">
                  <textarea
                    rows={2}
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Log client call highlights, specific preferences, pricing negotiations..."
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    disabled={actionLoading || !noteContent.trim()}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition disabled:opacity-50"
                  >
                    Save Note
                  </button>
                </form>
              </div>

              {/* Notes Timeline */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Internal Notes History</h4>
                {(!selectedLead.notes || selectedLead.notes.length === 0) ? (
                  <p className="text-xs text-slate-400 italic">No notes logged yet.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedLead.notes.map((n) => (
                      <div key={n.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                        <p className="text-slate-800">{n.note}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          By {n.authorName} &bull; {formatDate(n.createdAt)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
