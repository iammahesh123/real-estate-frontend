import React, { useState, useEffect } from 'react';
import { userApi, UserSummary } from '../../api/users';
import { Skeleton } from '../../components/common/Skeleton';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userApi.getAll(0, 50);
      setUsers(res.content || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusChange = async (userId: number, newStatus: string) => {
    try {
      setActionLoading(userId);
      await userApi.updateStatus(userId, newStatus);
      await fetchUsers();
    } catch (err) {
      console.error('Failed to update user status:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">ACTIVE</span>;
      case 'INACTIVE':
        return <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">INACTIVE</span>;
      case 'SUSPENDED':
        return <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">SUSPENDED</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 pb-6 border-b border-slate-200">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded">
            Identity &amp; Access Governance
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
            Registered Platform Users ({users.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage customer accounts, verify realtor profiles, and suspend violating actors.
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-xl mx-auto my-8">
            <h2 className="text-lg font-bold text-slate-900">No users found</h2>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Phone</th>
                    <th className="px-6 py-4">Assigned Roles</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Account Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 text-sm">{u.fullName}</p>
                        <p className="text-slate-500 text-xs font-mono">{u.email}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-mono">
                        {u.phone || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {u.roles?.map((r) => (
                            <span key={r} className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded">
                              {r.replace('ROLE_', '')}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(u.status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <select
                            value={u.status}
                            disabled={actionLoading === u.id}
                            onChange={(e) => handleStatusChange(u.id, e.target.value)}
                            className="text-xs px-2.5 py-1 border border-slate-200 rounded-lg bg-white font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                          >
                            <option value="ACTIVE">Set Active</option>
                            <option value="INACTIVE">Set Inactive</option>
                            <option value="SUSPENDED">Suspend Account</option>
                          </select>
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
