import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import AddonDomainModal from '../components/AddonDomainModal';
import GeneratorNavigation from '../components/GeneratorNavigation';

export default function GeneratorAddonDomain() {
    const { trackerId } = useParams();
    const { isDark, toggleTheme } = useTheme();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State for domains (will be fetched from API)
    const [domains, setDomains] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className={`font-display flex flex-col min-h-screen overflow-y-auto transition-colors ${isDark ? 'bg-background-dark text-white' : 'bg-gray-50 text-gray-900'}`}>
            <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors ${isDark ? 'bg-[#15162e]/90 border-[#323367]' : 'bg-white/90 border-gray-200'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 relative">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                                <span className="material-symbols-outlined text-white text-[20px]">link</span>
                            </div>
                            <span className={`font-bold text-lg tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>CPA LinkGen</span>
                        </div>
                        <button onClick={toggleTheme} className={`transition-colors ${isDark ? 'text-[#9293c9] hover:text-white' : 'text-gray-500 hover:text-gray-900'}`} title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
                            <span className="material-symbols-outlined">{isDark ? 'light_mode' : 'dark_mode'}</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <GeneratorNavigation />
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div className="flex flex-col gap-1">
                        <h1 className={`text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>My Domains</h1>
                        <p className={`text-base max-w-xl ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Manage your custom tracking domains to align your links with your brand identity.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-primary hover:bg-indigo-600 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-primary/20"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        <span>Add New Domain</span>
                    </button>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className={`flex flex-col gap-2 rounded-xl p-6 border ${isDark ? 'bg-surface-dark border-surface-border' : 'bg-white border-gray-200'}`}>
                        <div className={`flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                            <span className="material-symbols-outlined text-[20px]">dns</span>
                            <p className="text-sm font-medium uppercase tracking-wider">Total Domains</p>
                        </div>
                        <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>3</p>
                    </div>
                    <div className={`flex flex-col gap-2 rounded-xl p-6 border relative overflow-hidden group ${isDark ? 'bg-surface-dark border-surface-border' : 'bg-white border-gray-200'}`}>
                        <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-[80px] text-green-500">check_circle</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-400">
                            <span className="material-symbols-outlined text-[20px]">check_circle</span>
                            <p className="text-sm font-medium uppercase tracking-wider">Active</p>
                        </div>
                        <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>2</p>
                    </div>
                    <div className={`flex flex-col gap-2 rounded-xl p-6 border relative overflow-hidden group ${isDark ? 'bg-surface-dark border-surface-border' : 'bg-white border-gray-200'}`}>
                        <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-[80px] text-yellow-500">pending</span>
                        </div>
                        <div className="flex items-center gap-2 text-yellow-500">
                            <span className="material-symbols-outlined text-[20px]">hourglass_empty</span>
                            <p className="text-sm font-medium uppercase tracking-wider">Pending DNS</p>
                        </div>
                        <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>1</p>
                    </div>
                </div>

                {/* DNS Info Box */}
                <div className="mb-8 rounded-xl bg-gradient-to-r from-primary/20 to-transparent border border-primary/30 p-1">
                    <div className={`backdrop-blur-sm rounded-lg p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between ${isDark ? 'bg-surface-dark/80' : 'bg-white/80'}`}>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined text-[24px]">dns</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>DNS Configuration Required</h3>
                                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>To verify ownership, create an <code className={`px-1.5 py-0.5 rounded font-mono text-xs ${isDark ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-800'}`}>A Record</code> pointing to our server IP for each domain you add.</p>
                            </div>
                        </div>
                        <div className={`flex items-center gap-4 rounded-lg p-3 border w-full md:w-auto ${isDark ? 'bg-slate-950/50 border-surface-border' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-500 uppercase font-semibold">Target IP Address</span>
                                <span className={`font-mono font-medium text-lg tracking-wide ${isDark ? 'text-white' : 'text-gray-900'}`}>192.168.10.45</span>
                            </div>
                            <button className={`ml-auto p-2 transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`} title="Copy IP">
                                <span className="material-symbols-outlined text-[20px]">content_copy</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Domains Table */}
                <div className={`rounded-xl border overflow-hidden shadow-sm ${isDark ? 'bg-surface-dark border-surface-border' : 'bg-white border-gray-200'}`}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className={`border-b ${isDark ? 'bg-slate-900/50 border-surface-border' : 'bg-gray-50 border-gray-200'}`}>
                                    <th className={`px-6 py-4 font-medium uppercase tracking-wider text-xs w-[35%] ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Domain Name</th>
                                    <th className={`px-6 py-4 font-medium uppercase tracking-wider text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Status</th>
                                    <th className={`px-6 py-4 font-medium uppercase tracking-wider text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>SSL</th>
                                    <th className={`px-6 py-4 font-medium uppercase tracking-wider text-xs hidden md:table-cell ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Added On</th>
                                    <th className={`px-6 py-4 font-medium uppercase tracking-wider text-xs text-right ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Actions</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${isDark ? 'divide-surface-border' : 'divide-gray-100'}`}>
                                {domains.map((row) => (
                                    <tr key={row.id} className={`group transition-colors ${row.type === 'pending' ? (isDark ? 'bg-yellow-500/5 hover:bg-yellow-500/10' : 'bg-yellow-50 hover:bg-yellow-100') : (isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50')}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`size-8 rounded-full flex items-center justify-center ${isDark ? 'bg-white/5 text-slate-400' : 'bg-gray-100 text-gray-500'}`}>
                                                    <span className="material-symbols-outlined text-[18px]">language</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{row.name}</span>
                                                    {row.sub && <span className="text-xs text-slate-500">{row.sub}</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${row.status.includes('Verified') ? (isDark ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-green-50 text-green-600 border border-green-200') : (isDark ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-yellow-50 text-yellow-600 border border-yellow-200')}`}>
                                                <span className={`size-1.5 rounded-full ${row.status.includes('Verified') ? 'bg-green-400' : 'bg-yellow-400 animate-pulse'}`}></span>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                                                <span className={`material-symbols-outlined text-[16px] ${row.ssl === 'Active' ? 'text-green-400' : 'text-slate-500'}`}>{row.ssl === 'Active' ? 'lock' : 'lock_open'}</span>
                                                <span>{row.ssl}</span>
                                            </div>
                                        </td>
                                        <td className={`px-6 py-4 hidden md:table-cell ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{row.added}</td>
                                        <td className="px-6 py-4 text-right">
                                            {row.type === 'pending' ? (
                                                <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary hover:bg-indigo-600 text-white text-xs font-bold transition-colors">
                                                    <span>Verify DNS</span>
                                                    <span className="material-symbols-outlined text-[14px]">refresh</span>
                                                </button>
                                            ) : (
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className={`p-2 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'}`} title="Settings">
                                                        <span className="material-symbols-outlined text-[20px]">settings</span>
                                                    </button>
                                                    <button className={`p-2 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:text-red-400 hover:bg-red-400/10' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`} title="Delete">
                                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination / Footer */}
                    <div className={`px-6 py-4 border-t flex items-center justify-between ${isDark ? 'bg-slate-900/50 border-surface-border' : 'bg-gray-50 border-gray-200'}`}>
                        <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>Showing 3 of 3 domains</p>
                        <div className="flex gap-2">
                            <button className={`px-3 py-1 text-xs font-medium disabled:opacity-50 ${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`} disabled>Previous</button>
                            <button className={`px-3 py-1 text-xs font-medium disabled:opacity-50 ${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`} disabled>Next</button>
                        </div>
                    </div>
                </div>
            </main>
            <AddonDomainModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
