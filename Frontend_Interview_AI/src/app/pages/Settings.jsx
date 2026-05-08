import { useState } from "react";
import { toast } from "sonner";
import {
  EyeIcon,
  EyeOffIcon,
  ExternalLinkIcon,
  LinkIcon,
  ShieldCheckIcon,
  UserIcon,
} from "lucide-react";

import { Layout } from "../components/Layout.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { authService } from "../services/auth.service.js";

function Section({ icon, title, description, children }) {
  return (
    <div className="rounded-[2rem] border border-slate-200/80 bg-white/90 backdrop-blur-sm p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mb-7 flex items-start gap-4 border-b border-slate-100 pb-6 dark:border-slate-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
          {icon}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
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

    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    setLoadingPw(true);

    try {
      await authService.changePassword(currentPassword, newPassword);

      toast.success("Password updated successfully.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to update password."
      );
    } finally {
      setLoadingPw(false);
    }
  }

  const savedLinks = JSON.parse(
    localStorage.getItem("interviewai_profile_links") || "{}"
  );

  const presets = savedLinks?.presets || {};
  const custom = savedLinks?.custom || [];

  const profileLinks = [
    presets.github && {
      label: "GitHub",
      icon: "🐙",
      href: presets.github,
    },

    presets.linkedin && {
      label: "LinkedIn",
      icon: "💼",
      href: presets.linkedin,
    },

    presets.portfolio && {
      label: "Portfolio",
      icon: "🌐",
      href: presets.portfolio,
    },

    presets.leetcode && {
      label: "LeetCode",
      icon: "🧩",
      href: presets.leetcode,
    },

    presets.gfg && {
      label: "GeeksforGeeks",
      icon: "🟢",
      href: presets.gfg,
    },

    ...custom.map((link) => ({
      label: link.label || "Custom Link",
      icon: link.icon || "🔗",
      href: link.url,
    })),
  ].filter(Boolean);

  return (
    <Layout title="Settings" eyebrow="Account preferences">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* PROFILE */}
        <Section
          icon={<UserIcon className="h-5 w-5" />}
          title="Profile"
          description="Manage your account information and profile details."
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-gradient-to-br from-indigo-500 to-violet-500 text-2xl font-bold text-white shadow-lg shadow-indigo-500/20">
                {user?.username?.slice(0, 2).toUpperCase() || "?"}
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {user?.username}
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {user?.email}
                </p>

                <div className="mt-3 inline-flex items-center rounded-xl bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                  Active account
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-900">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Username
                </div>

                <div className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
                  {user?.username}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-900">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Email
                </div>

                <div className="mt-2 truncate text-sm font-semibold text-slate-900 dark:text-white">
                  {user?.email}
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* PASSWORD */}
        <Section
          icon={<ShieldCheckIcon className="h-5 w-5" />}
          title="Security"
          description="Keep your account secure with a strong password."
        >
          <form onSubmit={handleChangePassword} className="space-y-5">

            {/* CURRENT */}
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Current password
              </span>

              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-12 text-sm outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950"
                />

                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showCurrent ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </label>

            {/* NEW */}
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                New password
              </span>

              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-12 text-sm outline-none transition focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950"
                />

                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showNew ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </label>

            {/* CONFIRM */}
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Confirm password
              </span>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className={`w-full rounded-2xl border bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:bg-white dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950 ${
                  confirmPassword &&
                  newPassword !== confirmPassword
                    ? "border-red-300 focus:border-red-500 dark:border-red-800"
                    : "border-slate-200 focus:border-indigo-500 dark:border-slate-800"
                }`}
              />

              {confirmPassword &&
                newPassword !== confirmPassword && (
                  <p className="mt-2 text-xs text-red-500">
                    Passwords don't match
                  </p>
                )}
            </label>

            <button
              type="submit"
              disabled={
                loadingPw ||
                !currentPassword ||
                !newPassword ||
                !confirmPassword
              }
              className="rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingPw ? "Updating..." : "Update password"}
            </button>
          </form>
        </Section>

        {/* PROFILE LINKS */}
        <Section
          icon={<LinkIcon className="h-5 w-5" />}
          title="Profile Links"
          description="Your developer profiles and portfolio links."
        >
          {profileLinks.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-slate-200 bg-slate-50/70 p-10 text-center dark:border-slate-800 dark:bg-slate-900/40">

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-950/40">
                <LinkIcon className="h-7 w-7 text-indigo-500" />
              </div>

              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                No profile links added
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                Add your GitHub, LinkedIn, portfolio, LeetCode, or other developer profiles from the dashboard.
              </p>

              <div className="mt-5 inline-flex items-center rounded-xl bg-indigo-50 px-4 py-2 text-xs font-medium text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-300">
                Dashboard → Resume Links
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {profileLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 transition hover:border-indigo-200 hover:bg-indigo-50/60 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/20"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-white text-xl shadow-sm dark:border-slate-800 dark:bg-slate-950">
                      {link.icon}
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        {link.label}
                      </div>

                      <div className="mt-1 max-w-[180px] truncate text-xs text-slate-500 dark:text-slate-400">
                        {link.href}
                      </div>
                    </div>
                  </div>

                  <ExternalLinkIcon className="h-4 w-4 text-slate-400 transition group-hover:text-indigo-500" />
                </a>
              ))}
            </div>
          )}
        </Section>

      </div>
    </Layout>
  );
}