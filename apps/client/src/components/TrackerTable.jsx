import React from 'react';
import { useTheme } from '../context/ThemeContext';

const TeamBadge = ({ team, color }) => {
    let bgClass = "";
    let textClass = "";
    let borderClass = "";
    let circleClass = "";

    if (color === 'emerald') {
        bgClass = "bg-emerald-500/10";
        textClass = "text-emerald-400";
        borderClass = "border-emerald-500/20";
        circleClass = "bg-emerald-500";
    } else if (color === 'blue') {
        bgClass = "bg-blue-500/10";
        textClass = "text-blue-400";
        borderClass = "border-blue-500/20";
        circleClass = "bg-blue-500";
    } else if (color === 'purple') {
        bgClass = "bg-purple-500/10";
        textClass = "text-purple-400";
        borderClass = "border-purple-500/20";
        circleClass = "bg-purple-500";
    }

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${bgClass} ${textClass} ${borderClass}`}>
            <span className={`size-1.5 rounded-full ${circleClass}`}></span>
            {team}
        </span>
    );
};

export default function TrackerTable({ trackers = [], onEdit, onDelete }) {
    const { isDark } = useTheme();

    return (
        <div className={`flex-1 flex flex-col rounded-xl border overflow-hidden shadow-2xl ${isDark ? 'bg-[#16172b] border-[#232448]' : 'bg-white border-gray-200'}`}>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className={`border-b ${isDark ? 'bg-[#1a1b2e] border-[#232448]' : 'bg-gray-50 border-gray-200'}`}>
                            <th className={`p-4 text-xs font-semibold tracking-wide uppercase w-[100px] ${isDark ? 'text-[#9293c9]' : 'text-gray-500'}`}>ID</th>
                            <th className={`p-4 text-xs font-semibold tracking-wide uppercase ${isDark ? 'text-[#9293c9]' : 'text-gray-500'}`}>Tracker Name</th>
                            <th className={`p-4 text-xs font-semibold tracking-wide uppercase ${isDark ? 'text-[#9293c9]' : 'text-gray-500'}`}>Password</th>
                            <th className={`p-4 text-xs font-semibold tracking-wide uppercase ${isDark ? 'text-[#9293c9]' : 'text-gray-500'}`}>Generate URL</th>
                            <th className={`p-4 text-xs font-semibold tracking-wide uppercase w-[140px] ${isDark ? 'text-[#9293c9]' : 'text-gray-500'}`}>Team</th>
                            <th className={`p-4 text-xs font-semibold tracking-wide uppercase text-right w-[120px] ${isDark ? 'text-[#9293c9]' : 'text-gray-500'}`}>Action</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-[#232448]' : 'divide-gray-100'}`}>
                        {trackers.length === 0 ? (
                            <tr>
                                <td colSpan="6" className={`p-8 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                    No trackers found. Create one to get started!
                                </td>
                            </tr>
                        ) : trackers.map((row, index) => (
                            <tr key={index} className={`transition-colors group ${isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-gray-50'}`}>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary/10 text-primary p-1.5 rounded-md">
                                            <span className="material-symbols-outlined text-[18px]">badge</span>
                                        </div>
                                        <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{row.id}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`font-mono text-sm px-2 py-1 rounded ${isDark ? 'text-gray-300 bg-black/20' : 'text-gray-700 bg-gray-100'}`}>{row.name}</span>
                                </td>
                                <td className="p-4">
                                    <div className={`flex items-center gap-2 transition-colors ${isDark ? 'text-[#9293c9] group-hover:text-white' : 'text-gray-500 group-hover:text-gray-900'}`}>
                                        <span className="tracking-widest text-lg leading-none">{row.password || '••••••'}</span>
                                        <button className={`opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'text-[#9293c9] hover:text-primary' : 'text-gray-400 hover:text-primary'}`}>
                                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                                        </button>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2 max-w-[250px]">
                                        <a href={row.targetUrl} target="_blank" rel="noopener noreferrer" className="truncate text-primary text-sm underline decoration-primary/30 underline-offset-4 cursor-pointer hover:text-primary/80">
                                            {row.targetUrl}
                                        </a>
                                        <button
                                            className={`${isDark ? 'text-[#9293c9] hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}
                                            onClick={() => navigator.clipboard.writeText(row.targetUrl)}
                                        >
                                            <span className="material-symbols-outlined text-[16px]">content_copy</span>
                                        </button>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <TeamBadge team={row.team} color={row.team === 'ADMIN' ? 'purple' : 'blue'} />
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onEdit(row)}
                                            className={`size-8 flex items-center justify-center rounded-lg transition-colors ${isDark ? 'hover:bg-[#232448] text-[#9293c9] hover:text-white' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-900'}`}
                                        >
                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (window.confirm('Are you sure you want to delete this tracker?')) {
                                                    onDelete(row.id);
                                                }
                                            }}
                                            className={`size-8 flex items-center justify-center rounded-lg transition-colors ${isDark ? 'hover:bg-red-500/10 text-[#9293c9] hover:text-red-400' : 'hover:bg-red-50 text-gray-400 hover:text-red-500'}`}
                                        >
                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Pagination */}
            <div className={`p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${isDark ? 'border-[#232448]' : 'border-gray-200'}`}>
                <div className={`text-sm text-center sm:text-left ${isDark ? 'text-[#9293c9]' : 'text-gray-500'}`}>
                    Showing <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>1</span> to <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>10</span> of <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{trackers.length}</span> results
                </div>
                <div className="flex items-center gap-2">
                    <button className={`h-9 px-3 rounded border text-sm font-medium transition-colors disabled:opacity-50 ${isDark ? 'border-[#232448] text-[#9293c9] hover:text-white hover:bg-[#232448]' : 'border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
                        Previous
                    </button>
                    <div className="flex items-center gap-1">
                        <button className="size-9 rounded bg-primary text-white text-sm font-bold">1</button>
                        <button className={`size-9 rounded text-sm font-medium transition-colors ${isDark ? 'hover:bg-[#232448] text-[#9293c9] hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`}>2</button>
                        <button className={`size-9 rounded text-sm font-medium transition-colors ${isDark ? 'hover:bg-[#232448] text-[#9293c9] hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`}>3</button>
                        <span className={`px-1 ${isDark ? 'text-[#9293c9]' : 'text-gray-400'}`}>...</span>
                        <button className={`size-9 rounded text-sm font-medium transition-colors ${isDark ? 'hover:bg-[#232448] text-[#9293c9] hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`}>12</button>
                    </div>
                    <button className={`h-9 px-3 rounded border text-sm font-medium transition-colors ${isDark ? 'border-[#232448] text-[#9293c9] hover:text-white hover:bg-[#232448]' : 'border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
