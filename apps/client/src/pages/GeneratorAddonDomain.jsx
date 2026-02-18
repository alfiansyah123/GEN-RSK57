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
        <div className={`font-display flex flex-col min-h-screen overflow-y-auto transition-colors ${isDark ? 'bg-transparent text-white' : 'bg-gray-50 text-gray-900'}`}>


            <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-16">
                <div className="w-full space-y-8">
                    <div className="space-y-8">
                        {/* Main Card */}
                        <div className={`relative overflow-hidden rounded-[2rem] border transition-all duration-500 ${isDark
                            ? 'glass-panel border-white/20 shadow-2xl shadow-purple-900/20'
                            : 'bg-white border-gray-300 shadow-xl shadow-gray-200/50'
                            }`}>

                            <div className="p-4 md:p-10 relative">
                                {/* Logo Banner */}
                                <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
                                    <img
                                        src="/logo.png"
                                        alt="Banner"
                                        className="w-full h-auto object-cover"
                                    />
                                </div>

                                {/* Navigation & Tracker ID */}
                                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
                                    <GeneratorNavigation />

                                    <div className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl border ${isDark
                                        ? 'bg-[#16172b] border-[#323367] text-indigo-300'
                                        : 'bg-indigo-50 border-indigo-100 text-indigo-600'
                                        }`}>
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        <span className="text-sm font-semibold tracking-wide uppercase">Tracker: {trackerId}</span>
                                    </div>
                                </div>

                                {/* Stats Overview - Removed request */}

                                <div className="flex justify-between items-center mb-6">
                                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Managed Domains</h3>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/25 transform active:scale-95"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">add</span>
                                        <span>Add Domain</span>
                                    </button>
                                </div>

                                {/* DNS Info Box */}
                                <div className={`mb-8 rounded-xl p-5 transition-colors ${isDark ? 'glass-card' : 'bg-gray-50'}`}>
                                    <div className={`flex flex-col md:flex-row gap-6 items-start md:items-center justify-between`}>
                                        <div className="flex gap-4">
                                            <div className="flex-shrink-0 size-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-500">
                                                <span className="material-symbols-outlined text-[24px]">dns</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>DNS Configuration Required</h3>
                                                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>To verify ownership, create an <code className={`px-1.5 py-0.5 rounded font-mono text-xs ${isDark ? 'bg-black/30 text-indigo-300' : 'bg-gray-100 text-indigo-600'}`}>A Record</code> pointing to our server IP.</p>
                                            </div>
                                        </div>
                                        <div className={`flex items-center gap-4 rounded-xl p-3 border w-full md:w-auto ${isDark ? 'glass-input' : 'bg-gray-50 border-gray-200'}`}>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Target IP Address</span>
                                                <span className={`font-mono font-bold text-lg tracking-wide ${isDark ? 'text-white' : 'text-gray-900'}`}>94.100.26.12</span>
                                            </div>
                                            <button className={`p-2 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-200'}`} title="Copy IP">
                                                <span className="material-symbols-outlined text-[20px]">content_copy</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Domains Table */}
                                <div className={`rounded-xl border overflow-hidden ${isDark ? 'glass-card border-white/10' : 'bg-white border-gray-100'}`}>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm">
                                            <thead>
                                                <tr className={`border-b ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                                                    <th className={`px-6 py-4 font-bold uppercase tracking-wider text-xs w-[35%] ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Domain Name</th>
                                                    <th className={`px-6 py-4 font-bold uppercase tracking-wider text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Status</th>
                                                    <th className={`px-6 py-4 font-bold uppercase tracking-wider text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>SSL</th>
                                                    <th className={`px-6 py-4 font-bold uppercase tracking-wider text-xs hidden md:table-cell ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Added On</th>
                                                    <th className={`px-6 py-4 font-bold uppercase tracking-wider text-xs text-right ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-gray-100'}`}>
                                                {domains.map((row) => (
                                                    <tr key={row.id} className={`group transition-colors ${row.type === 'pending' ? (isDark ? 'bg-yellow-500/5 hover:bg-yellow-500/10' : 'bg-yellow-50 hover:bg-yellow-100') : (isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50')}`}>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`size-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-white/10 text-slate-400' : 'bg-gray-100 text-gray-500'}`}>
                                                                    <span className="material-symbols-outlined text-[20px]">language</span>
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{row.name}</span>
                                                                    {row.sub && <span className="text-xs text-slate-500 font-medium">{row.sub}</span>}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${row.status.includes('Verified') ? (isDark ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-green-50 text-green-600 border border-green-200') : (isDark ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-yellow-50 text-yellow-600 border border-yellow-200')}`}>
                                                                <span className={`size-2 rounded-full ${row.status.includes('Verified') ? 'bg-green-400' : 'bg-yellow-400 animate-pulse'}`}></span>
                                                                {row.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className={`flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                                                                <span className={`material-symbols-outlined text-[18px] ${row.ssl === 'Active' ? 'text-green-400' : 'text-slate-500'}`}>{row.ssl === 'Active' ? 'lock' : 'lock_open'}</span>
                                                                <span className="font-medium">{row.ssl}</span>
                                                            </div>
                                                        </td>
                                                        <td className={`px-6 py-4 hidden md:table-cell font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{row.added}</td>
                                                        <td className="px-6 py-4 text-right">
                                                            {row.type === 'pending' ? (
                                                                <button className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold transition-colors shadow-lg shadow-indigo-500/20">
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
                                    <div className={`px-6 py-4 border-t flex items-center justify-between ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                                        <p className={`text-xs font-medium ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>Showing 3 of 3 domains</p>
                                        <div className="flex gap-2">
                                            <button className={`px-3 py-1 text-xs font-bold disabled:opacity-50 ${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`} disabled>Previous</button>
                                            <button className={`px-3 py-1 text-xs font-bold disabled:opacity-50 ${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`} disabled>Next</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <AddonDomainModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
