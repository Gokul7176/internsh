import React from 'react';
import { UserProfile } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

interface UserTableProps {
  users: UserProfile[];
}

export function UserTable({ users }: UserTableProps) {
  return (
    <div className="p-6 rounded-3xl bg-white/80 dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800/80 backdrop-blur-md shadow-sm space-y-6">
      <div>
        <h3 className="font-serif text-xl font-semibold text-stone-900 dark:text-cream-50">
          User Account Directory ({users.length})
        </h3>
        <p className="text-xs text-stone-500">Overview of registered customers and administrator profiles</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-stone-200 dark:border-stone-800 text-[11px] font-bold uppercase tracking-wider text-stone-500">
              <th className="py-3 px-4">User Profile</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Skin Profile</th>
              <th className="py-3 px-4">Joined Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60 text-xs">
            {users.map((u) => (
              <tr key={u.uid} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/40 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    {u.photoURL ? (
                      <img src={u.photoURL} alt={u.displayName} className="w-8 h-8 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 font-bold flex items-center justify-center text-xs">
                        {u.displayName.charAt(0)}
                      </div>
                    )}
                    <span className="font-semibold text-stone-900 dark:text-stone-100">{u.displayName}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-stone-600 dark:text-stone-300">{u.email}</td>
                <td className="py-3 px-4">
                  {u.role === 'admin' ? (
                    <Badge variant="gold" size="sm">Admin</Badge>
                  ) : (
                    <Badge variant="cream" size="sm">Customer</Badge>
                  )}
                </td>
                <td className="py-3 px-4 text-stone-500 uppercase font-semibold text-[10px]">
                  {u.skinType || 'Not Diagnostic Yet'}
                </td>
                <td className="py-3 px-4 text-stone-500">{formatDate(u.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
