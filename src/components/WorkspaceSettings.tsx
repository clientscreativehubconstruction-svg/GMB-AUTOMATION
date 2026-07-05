import React, { useState } from 'react';
import { User, GoogleAccount } from '../types';
import { Settings, Shield, UserPlus, Trash2, Key, Info, CheckCircle } from 'lucide-react';

interface WorkspaceSettingsProps {
  organizationName: string;
  users: User[];
  googleAccounts: GoogleAccount[];
  onDisconnectAccount: (id: string) => void;
  onInviteUser: (email: string, name: string, role: 'owner' | 'admin' | 'member') => void;
  onDeleteOrganizationData: () => Promise<void>;
}

export default function WorkspaceSettings({
  organizationName,
  users,
  googleAccounts,
  onDisconnectAccount,
  onInviteUser,
  onDeleteOrganizationData,
}: WorkspaceSettingsProps) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState<'owner' | 'admin' | 'member'>('member');

  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const activeAccount = googleAccounts.find(ga => ga.isConnected);

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteName) return;

    onInviteUser(inviteEmail, inviteName, inviteRole);
    setInviteEmail("");
    setInviteName("");
  };

  const handleDeleteTrigger = async () => {
    await onDeleteOrganizationData();
    setDeleteConfirmation(true);
    setShowConfirmModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* SaaS Architecture Summary Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 flex gap-4 items-start">
        <div className="h-10 w-10 rounded-xl bg-blue-950 text-blue-400 border border-blue-900 flex items-center justify-center shrink-0 mt-0.5">
          <Shield size={16} />
        </div>
        <div>
          <span className="text-[10px] font-black text-slate-500 uppercase font-mono block tracking-widest">Tenant Row-Level Security</span>
          <h3 className="text-sm font-black text-white mt-1 uppercase tracking-tighter font-display">Multi-Tenant Data Separation Enabled</h3>
          <p className="text-xs text-slate-400 leading-relaxed mt-1 font-sans">
            Every database query is automatically sandboxed using strict row-level filters matching your selected active workspace token. Disconnecting profiles or requesting account deletions remains strictly scoped to this organization tenant, ensuring complete enterprise data confidentiality.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Organization Workspace Info */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-4">
          <h3 className="font-black text-white tracking-tighter text-xs uppercase font-display">Workspace Settings</h3>
          
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 font-mono">Active Organization Name</label>
            <input
              type="text"
              readOnly
              className="w-full text-xs bg-slate-950 border border-slate-850 rounded-lg p-2.5 font-bold text-slate-400 cursor-not-allowed focus:outline-none"
              value={organizationName}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 font-mono">GMB Sync Account Link</label>
            {activeAccount ? (
              <div className="border border-slate-850 rounded-xl p-3 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-300 font-bold truncate max-w-[140px]">{activeAccount.email}</span>
                <button
                  onClick={() => onDisconnectAccount(activeAccount.id)}
                  className="text-[10px] text-rose-500 font-black uppercase tracking-wider hover:bg-rose-500/10 px-2.5 py-1 rounded transition cursor-pointer"
                >
                  Unlink
                </button>
              </div>
            ) : (
              <p className="text-[10px] text-slate-500 italic font-mono">No Google Account linked. Visit the Overview section to connect.</p>
            )}
          </div>
        </div>

        {/* Right column: Invite Team Members & Roles */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-black text-white tracking-tighter text-xs uppercase font-display">Team Workspace Roles</h3>
            <span className="text-[10px] bg-slate-950 border border-slate-850 px-2.5 py-0.5 rounded text-slate-400 font-mono font-bold">Members: {users.length}</span>
          </div>

          {/* Members list */}
          <div className="space-y-2 border-b border-slate-850 pb-4">
            {users.map(u => (
              <div key={u.id} className="flex items-center justify-between text-xs py-2 border-b border-slate-850 last:border-0 last:pb-0">
                <div className="space-y-0.5">
                  <span className="font-bold text-white block">{u.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono font-bold">{u.email}</span>
                </div>

                <span className="bg-blue-500/10 text-blue-400 text-[9px] font-black px-2.5 py-0.5 rounded-full border border-blue-500/20 uppercase font-mono tracking-wider">
                  {u.role}
                </span>
              </div>
            ))}
          </div>

          {/* Invite form */}
          <div>
            <span className="text-[10px] font-black text-white uppercase tracking-widest font-mono block mb-3">Invite Team Member</span>
            
            <form onSubmit={handleInviteSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  className="text-xs bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 w-full focus:ring-1 focus:ring-blue-600 focus:outline-none font-bold"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                />
              </div>

              <div>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="text-xs bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 w-full focus:ring-1 focus:ring-blue-600 focus:outline-none font-sans font-bold"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <select
                  className="text-xs bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 w-full focus:ring-1 focus:ring-blue-600 focus:outline-none font-bold font-mono"
                  value={inviteRole}
                  onChange={(e: any) => setInviteRole(e.target.value)}
                >
                  <option value="member" className="bg-slate-950 text-white">Member</option>
                  <option value="admin" className="bg-slate-950 text-white">Admin</option>
                  <option value="owner" className="bg-slate-950 text-white">Owner</option>
                </select>

                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-black uppercase tracking-widest cursor-pointer shrink-0 transition"
                >
                  Invite
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>

      {/* GDPR Data deletion block */}
      <div className="bg-rose-950/10 border border-rose-900/20 rounded-3xl p-6">
        <h3 className="font-black text-rose-400 tracking-tighter text-xs uppercase font-display mb-1">Danger Zone</h3>
        <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
          Request full data erasure of this organization tenant account. This permanently detaches all synced GMB locations, deletes schedules, replies drafts, metrics, and unlinks connected OAuth tokens immediately.
        </p>

        {deleteConfirmation ? (
          <div className="bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl p-3 text-xs flex items-center gap-2">
            <CheckCircle size={14} className="text-green-400" />
            <span>Erasure requests successfully dispatched. Workspace data purged in-memory. Reload workspace to refresh state.</span>
          </div>
        ) : showConfirmModal ? (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 space-y-3">
            <p className="text-xs text-rose-400 font-bold">
              Are you absolutely sure? This will delete all content history and disconnect GMB credentials. This action is irreversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteTrigger}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-black uppercase tracking-widest cursor-pointer"
              >
                Confirm Deletion
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-slate-800 text-slate-400 hover:bg-slate-800 rounded-lg text-xs font-black uppercase tracking-widest cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirmModal(true)}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer transition"
          >
            Purge Tenant Database Records
          </button>
        )}
      </div>

    </div>
  );
}
