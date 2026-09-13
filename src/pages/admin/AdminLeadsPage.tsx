import React, { useState, useEffect } from 'react';
import { crmApi } from '../../api/crm';
import { agentApi } from '../../api/agents';
import { Lead } from '../../types';
import { AgentProfile } from '../../api/agents';
import { Skeleton } from '../../components/common/Skeleton';
import { formatDate, formatPrice } from '../../utils/format';

export const AdminLeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [agents, setAgents] = useState<AgentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Reassign Modal
  const [reassignLead, setReassignLead] = useState<Lead | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<number>(1);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [leadsData, agentsData] = await Promise.all([
        crmApi.getLeads(undefined, 0, 50),
        agentApi.getAll(0, 50),
      ]);
      setLeads(leadsData.content || []);
      setAgents(agentsData.content || []);
      if (agentsData.content && agentsData.content.length > 0) {
        setSelectedAgentId(agentsData.content[0].id);
      }
    } catch (err) {
      console.error('Failed to load admin leads data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReassignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reassignLead) return;
    try {
      setActionLoading(reassignLead.id);
      await crmApi.assignLead(reassignLead.id, selectedAgentId);
      setReassignLead(null);
      await fetchData();
    } catch (err) {
      console.error('Failed to reassign lead:', err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 pb-6 border-b border-slate-200">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded">
            Sales Desk Governance
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
            Central Leads &amp; Broker Routing ({leads.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Global view of all prospective buyers. Reassign high-value opportunities to certified senior specialists.
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        ) : leads.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-xl mx-auto my-8">
            <h2 className="text-lg font-bold text-slate-900">No leads recorded in database</h2>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4">Inquiry / Property</th>
                    <th className="px-6 py-4">Budget</th>
                    <th className="px-6 py-4">Assigned Agent</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 text-sm">{l.clientName}</p>
                        <p className="text-[11px] text-slate-500">{l.clientEmail}</p>
                        <p className="text-[11px] text-slate-600 font-mono mt-0.5">{l.clientPhone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800">{l.propertyTitle || 'General Consultation'}</p>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Created {formatDate(l.createdAt)}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {l.budget ? formatPrice(l.budget) : 'Unspecified'}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">{l.assignedAgentName}</p>
                        <span className="text-[10px] text-slate-400">Agent ID: #{l.assignedAgentId}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                          {l.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setReassignLead(l);
                            setSelectedAgentId(l.assignedAgentId || (agents[0]?.id || 1));
                          }}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition"
                        >
                          Reassign Agent
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reassign Modal */}
        {reassignLead && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Reassign Lead</h3>
              <p className="text-xs text-slate-500">
                Reassign client &quot;{reassignLead.clientName}&quot; to a certified agent.
              </p>

              <form onSubmit={handleReassignSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Select Specialist</label>
                  <select
                    value={selectedAgentId}
                    onChange={(e) => setSelectedAgentId(Number(e.target.value))}
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-amber-500"
                  >
                    {agents.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.fullName} ({a.agencyName || 'EstateHub'}) - {a.specialization || 'Luxury'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setReassignLead(null)}
                    className="px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading === reassignLead.id}
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs"
                  >
                    Confirm Reassignment
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
