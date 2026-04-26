// import { useMemo, useState } from 'react';
// import { Link, NavLink, useNavigate } from 'react-router';
// import {
//     BarChart3Icon, FileTextIcon, HomeIcon, LogOutIcon,
//     MenuIcon, MicIcon, PlusIcon, XIcon, ChevronLeftIcon,
//     ChevronRightIcon, UserIcon
// } from 'lucide-react';
// import { useAuth } from '../context/AuthContext.jsx';
// import { ThemeToggle } from './ThemeToggle.jsx';

// const navigation = [
//     { name: 'Overview',   href: '/dashboard', icon: HomeIcon },
//     { name: 'Reports',    href: '/reports',   icon: FileTextIcon },
//     { name: 'Mock',       href: '/mock',      icon: MicIcon },
//     { name: 'Analytics',  href: '/analytics', icon: BarChart3Icon },
// ];

// export function Layout({ title, eyebrow, children, actions = null }) {
//     const { user, logout } = useAuth();
//     const navigate = useNavigate();
//     const [mobileOpen, setMobileOpen] = useState(false);
//     const [collapsed, setCollapsed] = useState(false);

//     const initials = user?.username
//         ? user.username.slice(0, 2).toUpperCase()
//         : 'U';

//     async function handleLogout() {
//         await logout();
//         navigate('/login');
//     }

//     return (
//         <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
//             <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.12),transparent_32%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_28%)]" />

//             {/* ── DESKTOP SIDEBAR ── */}
//             <aside className={`fixed inset-y-0 left-0 hidden lg:flex flex-col border-r border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'}`}>

//                 {/* Logo + collapse toggle */}
//                 <div className="flex items-center justify-between px-4 py-5 border-b border-slate-100 dark:border-slate-800">
//                     {!collapsed && (
//                         <Link to="/dashboard" className="flex items-center gap-3 min-w-0">
//                             <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-sm">
//                                 AI
//                             </div>
//                             <div className="min-w-0">
//                                 <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">InterviewAI</div>
//                                 <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">Candidate Workspace</div>
//                             </div>
//                         </Link>
//                     )}
//                     {collapsed && (
//                         <Link to="/dashboard" className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-sm">
//                             AI
//                         </Link>
//                     )}
//                     {!collapsed && (
//                         <button
//                             onClick={() => setCollapsed(true)}
//                             className="ml-2 flex-shrink-0 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
//                             title="Collapse sidebar"
//                         >
//                             <ChevronLeftIcon className="h-4 w-4" />
//                         </button>
//                     )}
//                 </div>

//                 {/* Expand button when collapsed */}
//                 {collapsed && (
//                     <button
//                         onClick={() => setCollapsed(false)}
//                         className="mx-auto mt-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
//                         title="Expand sidebar"
//                     >
//                         <ChevronRightIcon className="h-4 w-4" />
//                     </button>
//                 )}

//                 {/* Nav links */}
//                 <nav className="flex-1 px-3 py-4 space-y-1">
//                     {navigation.map((item) => (
//                         <NavLink
//                             key={item.href}
//                             to={item.href}
//                             title={collapsed ? item.name : undefined}
//                             className={({ isActive }) =>
//                                 `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
//                                     collapsed ? 'justify-center' : ''
//                                 } ${
//                                     isActive
//                                         ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
//                                         : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white'
//                                 }`
//                             }
//                         >
//                             <item.icon className="h-4 w-4 flex-shrink-0" />
//                             {!collapsed && <span>{item.name}</span>}
//                         </NavLink>
//                     ))}
//                 </nav>

//                 {/* New Analysis button */}
//                 <div className="px-3 pb-3">
//                     <Link
//                         to="/reports/new"
//                         title={collapsed ? 'New Analysis' : undefined}
//                         className={`flex items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 ${collapsed ? 'justify-center' : 'justify-center'}`}
//                     >
//                         <PlusIcon className="h-4 w-4 flex-shrink-0" />
//                         {!collapsed && <span>New Analysis</span>}
//                     </Link>
//                 </div>

//                 {/* User section */}
//                 <div className={`border-t border-slate-100 dark:border-slate-800 px-3 py-4 ${collapsed ? 'flex flex-col items-center gap-3' : ''}`}>
//                     {collapsed ? (
//                         <>
//                             <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400">
//                                 {initials}
//                             </div>
//                             <button onClick={handleLogout} title="Sign out" className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-500 transition">
//                                 <LogOutIcon className="h-4 w-4" />
//                             </button>
//                         </>
//                     ) : (
//                         <div className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-3">
//                             {/* Avatar */}
//                             <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-sm font-bold text-indigo-600 dark:text-indigo-400 flex-shrink-0">
//                                 {initials}
//                             </div>
//                             <div className="flex-1 min-w-0">
//                                 <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.username}</div>
//                                 <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</div>
//                             </div>
//                             <button
//                                 onClick={handleLogout}
//                                 title="Sign out"
//                                 className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-500 transition flex-shrink-0"
//                             >
//                                 <LogOutIcon className="h-4 w-4" />
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             </aside>

//             {/* ── MOBILE OVERLAY ── */}
//             {mobileOpen && (
//                 <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)}>
//                     <div className="absolute inset-y-0 left-0 w-72 border-r border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950" onClick={e => e.stopPropagation()}>
//                         <div className="flex items-center justify-between mb-6">
//                             <div className="text-base font-semibold">Navigation</div>
//                             <button onClick={() => setMobileOpen(false)} className="rounded-xl border border-slate-200 p-2 dark:border-slate-800">
//                                 <XIcon className="h-4 w-4" />
//                             </button>
//                         </div>
//                         <nav className="space-y-1">
//                             {navigation.map((item) => (
//                                 <NavLink
//                                     key={item.href}
//                                     to={item.href}
//                                     onClick={() => setMobileOpen(false)}
//                                     className={({ isActive }) =>
//                                         `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
//                                             isActive
//                                                 ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
//                                                 : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'
//                                         }`
//                                     }
//                                 >
//                                     <item.icon className="h-4 w-4" />
//                                     <span>{item.name}</span>
//                                 </NavLink>
//                             ))}
//                         </nav>
//                     </div>
//                 </div>
//             )}

//             {/* ── MAIN CONTENT ── */}
//             <div className={`transition-all duration-300 ${collapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>

//                 {/* Top navbar */}
//                 <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 px-4 backdrop-blur md:px-6 dark:border-slate-800 dark:bg-slate-950/80">
//                     <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4">

//                         {/* Left: mobile menu + title */}
//                         <div className="flex items-center gap-3 min-w-0">
//                             <button
//                                 onClick={() => setMobileOpen(true)}
//                                 className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
//                             >
//                                 <MenuIcon className="h-4 w-4" />
//                             </button>
//                             <div className="min-w-0">
//                                 {eyebrow && (
//                                     <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
//                                         {eyebrow}
//                                     </div>
//                                 )}
//                                 <h1 className="truncate text-xl font-semibold text-slate-900 dark:text-white">
//                                     {title}
//                                 </h1>
//                             </div>
//                         </div>

//                         {/* Right: actions + avatar + theme */}
//                         <div className="flex items-center gap-2 flex-shrink-0">
//                             {actions}
//                             <ThemeToggle />

//                             {/* Avatar in navbar */}
//                             <div className="relative group">
//                                 <button className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
//                                     <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400">
//                                         {initials}
//                                     </div>
//                                     <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:block">
//                                         {user?.username}
//                                     </span>
//                                 </button>

//                                 {/* Dropdown */}
//                                 <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
//                                     <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
//                                         <div className="text-sm font-semibold text-slate-900 dark:text-white">{user?.username}</div>
//                                         <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</div>
//                                     </div>
//                                     <div className="p-2">
//                                         <Link to="/reports/new" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition">
//                                             <PlusIcon className="h-4 w-4" />
//                                             New report
//                                         </Link>
//                                         <button
//                                             onClick={handleLogout}
//                                             className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
//                                         >
//                                             <LogOutIcon className="h-4 w-4" />
//                                             Sign out
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </header>

//                 <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
//                     {children}
//                 </main>
//             </div>
//         </div>
//     );
// }





import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import {
    LayoutDashboard,
    FileText,
    Mic2,
    BarChart2,
    Plus,
    LogOut,
    Menu,
    X,
    ChevronLeft,
    Sun,
    Moon,
    Settings,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const NAV = [
    { label: 'Overview',   to: '/dashboard', icon: LayoutDashboard },
    { label: 'Reports',    to: '/reports',   icon: FileText },
    { label: 'Mock',       to: '/mock',      icon: Mic2 },
    { label: 'Analytics',  to: '/analytics', icon: BarChart2 },
];

function Avatar({ name, size = 'md' }) {
    const initials = name ? name.slice(0, 2).toUpperCase() : '?';
    const colors = [
        ['#e0e7ff', '#4f46e5'],
        ['#dcfce7', '#16a34a'],
        ['#fef3c7', '#d97706'],
        ['#fce7f3', '#db2777'],
        ['#e0f2fe', '#0284c7'],
    ];
    const idx = name ? name.charCodeAt(0) % colors.length : 0;
    const [bg, fg] = colors[idx];

    const sz = size === 'sm' ? 28 : size === 'lg' ? 40 : 34;

    return (
        <div style={{
            width: sz, height: sz,
            borderRadius: '50%',
            background: bg,
            color: fg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: sz * 0.35,
            fontWeight: 700,
            flexShrink: 0,
            letterSpacing: '0.02em',
            userSelect: 'none',
        }}>
            {initials}
        </div>
    );
}

export function Layout({ title, eyebrow, children, actions = null }) {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme?.() || {};
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const isDark = document.documentElement.classList.contains('dark');

    async function handleLogout() {
        await logout();
        navigate('/login');
    }

    const SidebarContent = ({ onNav }) => (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

            {/* Logo row */}
            <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'space-between',
                padding: collapsed ? '20px 0' : '20px 16px',
                borderBottom: '1px solid var(--sb-border)',
                marginBottom: 8,
            }}>
                {!collapsed && (
                    <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: 'var(--sb-accent)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0,
                            letterSpacing: '0.04em',
                        }}>
                            AI
                        </div>
                        <div>
                            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--sb-text3)', lineHeight: 1 }}>
                                InterviewAI
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--sb-text)', lineHeight: 1.3, marginTop: 2 }}>
                                Workspace
                            </div>
                        </div>
                    </Link>
                )}
                {collapsed && (
                    <Link to="/dashboard" style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: 'var(--sb-accent)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 800, color: '#fff',
                        textDecoration: 'none',
                    }}>
                        AI
                    </Link>
                )}
                {!collapsed && (
                    <button
                        onClick={() => setCollapsed(true)}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            padding: 6, borderRadius: 8, color: 'var(--sb-text3)',
                            display: 'flex', alignItems: 'center',
                            transition: 'background 0.15s, color 0.15s',
                        }}
                        onMouseOver={e => { e.currentTarget.style.background = 'var(--sb-hover)'; e.currentTarget.style.color = 'var(--sb-text)'; }}
                        onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--sb-text3)'; }}
                        title="Collapse"
                    >
                        <ChevronLeft size={15} />
                    </button>
                )}
            </div>

            {/* Expand button when collapsed */}
            {collapsed && (
                <button
                    onClick={() => setCollapsed(false)}
                    style={{
                        margin: '4px auto 8px', background: 'none', border: 'none',
                        cursor: 'pointer', padding: 6, borderRadius: 8,
                        color: 'var(--sb-text3)', display: 'flex', alignItems: 'center',
                        transition: 'background 0.15s',
                    }}
                    title="Expand"
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6"/>
                    </svg>
                </button>
            )}

            {/* Nav */}
            <nav style={{ flex: 1, padding: '4px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                {NAV.map(({ label, to, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        onClick={onNav}
                        title={collapsed ? label : undefined}
                        style={{ textDecoration: 'none' }}
                        className={({ isActive }) => isActive ? 'nav-active' : 'nav-inactive'}
                    >
                        {({ isActive }) => (
                            <div style={{
                                display: 'flex', alignItems: 'center',
                                gap: collapsed ? 0 : 10,
                                justifyContent: collapsed ? 'center' : 'flex-start',
                                padding: collapsed ? '10px 0' : '9px 12px',
                                borderRadius: 10,
                                fontSize: 13.5, fontWeight: 500,
                                transition: 'background 0.15s, color 0.15s',
                                background: isActive ? 'var(--sb-active-bg)' : 'transparent',
                                color: isActive ? 'var(--sb-active-text)' : 'var(--sb-text2)',
                            }}
                            onMouseOver={e => { if (!isActive) e.currentTarget.style.background = 'var(--sb-hover)'; }}
                            onMouseOut={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                            >
                                <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} style={{ flexShrink: 0 }} />
                                {!collapsed && <span>{label}</span>}
                                {!collapsed && isActive && (
                                    <div style={{
                                        marginLeft: 'auto', width: 6, height: 6,
                                        borderRadius: '50%', background: 'var(--sb-accent)',
                                    }} />
                                )}
                            </div>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* New analysis button */}
            <div style={{ padding: '8px 8px 4px' }}>
                <Link
                    to="/reports/new"
                    onClick={onNav}
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: 7, padding: collapsed ? '10px 0' : '10px 14px',
                        borderRadius: 10, background: 'var(--sb-accent)',
                        color: '#fff', textDecoration: 'none',
                        fontSize: 13.5, fontWeight: 600,
                        transition: 'opacity 0.15s',
                    }}
                    onMouseOver={e => e.currentTarget.style.opacity = '0.88'}
                    onMouseOut={e => e.currentTarget.style.opacity = '1'}
                >
                    <Plus size={15} strokeWidth={2.5} />
                    {!collapsed && 'New Analysis'}
                </Link>
            </div>

            {/* User section */}
            <div style={{
                borderTop: '1px solid var(--sb-border)',
                padding: '12px 8px',
                marginTop: 4,
            }}>
                {collapsed ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                        <Avatar name={user?.username} size="sm" />
                        <button
                            onClick={handleLogout}
                            style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                padding: 7, borderRadius: 8, color: 'var(--sb-text3)',
                                display: 'flex', alignItems: 'center',
                                transition: 'background 0.15s, color 0.15s',
                            }}
                            title="Sign out"
                            onMouseOver={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#ef4444'; }}
                            onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--sb-text3)'; }}
                        >
                            <LogOut size={15} />
                        </button>
                    </div>
                ) : (
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 12px', borderRadius: 12,
                        border: '1px solid var(--sb-border)',
                        background: 'var(--sb-hover)',
                    }}>
                        <Avatar name={user?.username} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                                fontSize: 13, fontWeight: 600,
                                color: 'var(--sb-text)',
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            }}>
                                {user?.username}
                            </div>
                            <div style={{
                                fontSize: 11.5, color: 'var(--sb-text3)',
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                marginTop: 1,
                            }}>
                                {user?.email}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleLogout}
                            title="Sign out"
                            style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                padding: 7, borderRadius: 8, color: 'var(--sb-text3)',
                                display: 'flex', alignItems: 'center', flexShrink: 0,
                                transition: 'background 0.15s, color 0.15s',
                            }}
                            onMouseOver={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#ef4444'; }}
                            onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--sb-text3)'; }}
                        >
                            <LogOut size={14} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <>
            <style>{`
                :root {
                    --sb-bg:          #ffffff;
                    --sb-border:      #f1f1f1;
                    --sb-hover:       #f8f8f8;
                    --sb-text:        #0f0f0f;
                    --sb-text2:       #6b7280;
                    --sb-text3:       #9ca3af;
                    --sb-accent:      #4f46e5;
                    --sb-active-bg:   #eef2ff;
                    --sb-active-text: #4338ca;
                    --sb-width:       256px;
                    --sb-width-sm:    68px;
                    --top-h:          60px;
                }
                .dark {
                    --sb-bg:          #0c0c0f;
                    --sb-border:      #1f1f27;
                    --sb-hover:       #13131a;
                    --sb-text:        #f5f5f7;
                    --sb-text2:       #8b8b9a;
                    --sb-text3:       #55556a;
                    --sb-active-bg:   #1e1b4b;
                    --sb-active-text: #818cf8;
                }
                .layout-sidebar {
                    position: fixed;
                    top: 0; left: 0; bottom: 0;
                    background: var(--sb-bg);
                    border-right: 1px solid var(--sb-border);
                    display: flex; flex-direction: column;
                    transition: width 0.25s cubic-bezier(0.4,0,0.2,1);
                    z-index: 30;
                    overflow: hidden;
                }
                .layout-main {
                    transition: padding-left 0.25s cubic-bezier(0.4,0,0.2,1);
                    min-height: 100vh;
                    background: var(--main-bg, #f9f9fb);
                }
                .dark .layout-main {
                    --main-bg: #07070b;
                }
                .layout-topbar {
                    position: sticky; top: 0; z-index: 20;
                    height: var(--top-h);
                    background: var(--sb-bg);
                    border-bottom: 1px solid var(--sb-border);
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 0 24px;
                    backdrop-filter: blur(8px);
                }
                .nav-active, .nav-inactive { display: block; }
                @media (max-width: 1023px) {
                    .layout-sidebar { display: none !important; }
                }
            `}</style>

            <div style={{ display: 'flex', minHeight: '100vh' }}>

                {/* Desktop Sidebar */}
                <aside
                    className="layout-sidebar"
                    style={{ width: collapsed ? 'var(--sb-width-sm)' : 'var(--sb-width)' }}
                >
                    <SidebarContent />
                </aside>

                {/* Mobile overlay */}
                {mobileOpen && (
                    <div
                        onClick={() => setMobileOpen(false)}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 50,
                            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
                        }}
                    >
                        <div
                            onClick={e => e.stopPropagation()}
                            style={{
                                position: 'absolute', top: 0, left: 0, bottom: 0,
                                width: 'var(--sb-width)',
                                background: 'var(--sb-bg)',
                                borderRight: '1px solid var(--sb-border)',
                            }}
                        >
                            <div style={{ position: 'absolute', top: 14, right: 14 }}>
                                <button
                                    onClick={() => setMobileOpen(false)}
                                    style={{
                                        background: 'var(--sb-hover)', border: 'none',
                                        borderRadius: 8, padding: 6, cursor: 'pointer',
                                        color: 'var(--sb-text2)', display: 'flex',
                                    }}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                            <SidebarContent onNav={() => setMobileOpen(false)} />
                        </div>
                    </div>
                )}

                {/* Main content area */}
                <div
                    className="layout-main"
                    style={{
                        paddingLeft: collapsed ? 'var(--sb-width-sm)' : 'var(--sb-width)',
                        flex: 1,
                    }}
                    // hide left padding on mobile
                >
                    {/* Top bar */}
                    <div className="layout-topbar">

                        {/* Left */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            {/* Mobile menu button */}
                            <button
                                onClick={() => setMobileOpen(true)}
                                style={{
                                    display: 'none',
                                    background: 'var(--sb-hover)', border: '1px solid var(--sb-border)',
                                    borderRadius: 9, padding: 7, cursor: 'pointer',
                                    color: 'var(--sb-text2)', alignItems: 'center',
                                }}
                                className="mobile-menu-btn"
                            >
                                <Menu size={16} />
                            </button>

                            <div>
                                {eyebrow && (
                                    <div style={{
                                        fontSize: 10.5, fontWeight: 600, letterSpacing: '0.16em',
                                        textTransform: 'uppercase', color: 'var(--sb-text3)',
                                        lineHeight: 1, marginBottom: 3,
                                    }}>
                                        {eyebrow}
                                    </div>
                                )}
                                <h1 style={{
                                    fontSize: 17, fontWeight: 600,
                                    color: 'var(--sb-text)', margin: 0, lineHeight: 1,
                                }}>
                                    {title}
                                </h1>
                            </div>
                        </div>

                        {/* Right */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {actions}

                            {/* Theme toggle */}
                            <button
                                onClick={toggleTheme}
                                style={{
                                    background: 'var(--sb-hover)', border: '1px solid var(--sb-border)',
                                    borderRadius: 9, padding: 8, cursor: 'pointer',
                                    color: 'var(--sb-text2)', display: 'flex', alignItems: 'center',
                                    transition: 'background 0.15s',
                                }}
                                title="Toggle theme"
                            >
                                {isDark ? <Sun size={15} /> : <Moon size={15} />}
                            </button>

                            {/* User pill */}
                            <div style={{ position: 'relative' }} className="user-pill-wrap">
                                <button
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 8,
                                        background: 'var(--sb-hover)',
                                        border: '1px solid var(--sb-border)',
                                        borderRadius: 10, padding: '6px 10px 6px 7px',
                                        cursor: 'pointer', transition: 'border-color 0.15s',
                                    }}
                                    className="user-pill-btn"
                                >
                                    <Avatar name={user?.username} size="sm" />
                                    <span style={{
                                        fontSize: 13, fontWeight: 500,
                                        color: 'var(--sb-text)',
                                    }}>
                                        {user?.username}
                                    </span>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--sb-text3)" strokeWidth="2.5">
                                        <path d="M6 9l6 6 6-6"/>
                                    </svg>
                                </button>

                                {/* Dropdown */}
                                <div className="user-dropdown" style={{
                                    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                                    width: 220, borderRadius: 14,
                                    background: 'var(--sb-bg)',
                                    border: '1px solid var(--sb-border)',
                                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                                    opacity: 0, visibility: 'hidden',
                                    transform: 'translateY(-6px)',
                                    transition: 'opacity 0.15s, transform 0.15s, visibility 0.15s',
                                    zIndex: 60,
                                    overflow: 'hidden',
                                }}>
                                    {/* User info */}
                                    <div style={{
                                        padding: '14px 16px 12px',
                                        borderBottom: '1px solid var(--sb-border)',
                                        display: 'flex', gap: 10, alignItems: 'center',
                                    }}>
                                        <Avatar name={user?.username} size="md" />
                                        <div style={{ minWidth: 0 }}>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--sb-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {user?.username}
                                            </div>
                                            <div style={{ fontSize: 11.5, color: 'var(--sb-text3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 1 }}>
                                                {user?.email}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div style={{ padding: '6px 6px' }}>
                                        <Link
                                            to="/reports/new"
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 8,
                                                padding: '9px 10px', borderRadius: 8,
                                                fontSize: 13, color: 'var(--sb-text2)',
                                                textDecoration: 'none',
                                                transition: 'background 0.12s, color 0.12s',
                                            }}
                                            onMouseOver={e => { e.currentTarget.style.background = 'var(--sb-hover)'; e.currentTarget.style.color = 'var(--sb-text)'; }}
                                            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--sb-text2)'; }}
                                        >
                                            <Plus size={14} />
                                            New report
                                        </Link>
                                        <Link
                                            to="/settings"
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 8,
                                                padding: '9px 10px', borderRadius: 8,
                                                fontSize: 13, color: 'var(--sb-text2)',
                                                textDecoration: 'none',
                                                transition: 'background 0.12s, color 0.12s',
                                            }}
                                            onMouseOver={e => { e.currentTarget.style.background = 'var(--sb-hover)'; e.currentTarget.style.color = 'var(--sb-text)'; }}
                                            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--sb-text2)'; }}
                                        >
                                            <Settings size={14} />
                                            Settings
                                        </Link>
                                    </div>

                                    <div style={{ height: 1, background: 'var(--sb-border)', margin: '0 6px' }} />

                                    <div style={{ padding: '6px 6px 8px' }}>
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 8,
                                                padding: '9px 10px', borderRadius: 8,
                                                fontSize: 13, color: '#ef4444',
                                                background: 'transparent', border: 'none',
                                                cursor: 'pointer', width: '100%',
                                                transition: 'background 0.12s',
                                            }}
                                            onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                                            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <LogOut size={14} />
                                            Sign out
                                        </button>
                                    </div>
                                </div>

                                <style>{`
                                    .user-pill-wrap:hover .user-dropdown {
                                        opacity: 1 !important;
                                        visibility: visible !important;
                                        transform: translateY(0) !important;
                                    }
                                    @media (max-width: 1023px) {
                                        .mobile-menu-btn { display: flex !important; }
                                        .layout-main { padding-left: 0 !important; }
                                    }
                                `}</style>
                            </div>
                        </div>
                    </div>

                    {/* Page content */}
                    <div style={{ padding: '28px 24px', maxWidth: 1200, margin: '0 auto' }}>
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}