import { useState } from "react";
import { toast } from "sonner";
import { EyeIcon, EyeOffIcon, UserIcon, ShieldIcon, LinkIcon, ExternalLinkIcon } from "lucide-react";
import { Layout } from "../components/Layout.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { authService } from "../services/auth.service.js";

function Section({ title, description, children }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-6 pb-5 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
        {description && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export function Settings() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loadingPw, setLoadingPw] = useState(false);

  async function handleChangePassword(e) {
    e.preventDefault();
    if (newPassword !== confirmPassword) { toast.error("New passwords don't match."); return; }
    if (newPassword.length < 8) { toast.error("New password must be at least 8 characters."); return; }
    setLoadingPw(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      toast.success("Password changed successfully.");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to change password.");
    } finally {
      setLoadingPw(false);
    }
  }

  const profileLinks = [
    { label: "GitHub", icon: "🐙", href: "https://github.com/Md-Aman45", username: "Md-Aman45" },
    { label: "LinkedIn", icon: "💼", href: "https://linkedin.com/in/md-aman", username: "md-aman" },
    { label: "LeetCode", icon: "🧩", href: "https://leetcode.com/md-aman", username: "md-aman" },
  ];

  return (
    <Layout title="Settings" eyebrow="Account preferences">
      <div className="max-w-2xl space-y-6">

        {/* Profile info */}
        <Section title="Profile" description="Your account information.">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-950/50 text-xl font-bold text-indigo-600 dark:text-indigo-400">
              {user?.username?.slice(0, 2).toUpperCase() || "?"}
            </div>
            <div>
              <div className="text-base font-semibold text-slate-900 dark:text-white">{user?.username}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Username</div>
              <div className="text-sm font-medium text-slate-900 dark:text-white">{user?.username}</div>
            </div>
            <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Email</div>
              <div className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.email}</div>
            </div>
          </div>
        </Section>

        {/* Change password */}
        <Section title="Change Password" description="Use a strong unique password for your account.">
          <form onSubmit={handleChangePassword} className="space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Current password</span>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950"
                  placeholder="Your current password"
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition">
                  {showCurrent ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">New password</span>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950"
                  placeholder="Minimum 8 characters"
                />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition">
                  {showNew ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Confirm new password</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className={`w-full rounded-2xl border bg-slate-50 px-4 py-3 text-sm outline-none transition focus:bg-white dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950 ${
                  confirmPassword && newPassword !== confirmPassword
                    ? 'border-red-300 focus:border-red-500 dark:border-red-800'
                    : 'border-slate-200 focus:border-indigo-500 dark:border-slate-800'
                }`}
                placeholder="Re-enter new password"
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
              )}
            </label>

            <button
              type="submit"
              disabled={loadingPw || !currentPassword || !newPassword || !confirmPassword}
              className="rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loadingPw ? "Updating..." : "Update password"}
            </button>
          </form>
        </Section>

        {/* Profile Links */}
        <Section title="Profile Links" description="Your developer profiles and portfolio.">
          <div className="space-y-3">
            {profileLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-3.5 transition hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{link.icon}</span>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{link.label}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{link.href}</div>
                  </div>
                </div>
                <ExternalLinkIcon className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition" />
              </a>
            ))}
          </div>
        </Section>

      </div>
    </Layout>
  );
}