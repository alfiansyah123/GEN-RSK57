import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function AggregatedReportsTable({ data = [], onDrillDown, currency, currencyRate }) {
    const { isDark } = useTheme();
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = [...data].sort((a, b) => {
        if (!sortConfig.key) return 0;
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const formatCurrency = (val) => {
        const num = parseFloat(val);
        if (isNaN(num)) return currency === 'IDR' ? 'Rp 0' : '$0.00';
        if (currency === 'IDR') {
            return `Rp ${(num * currencyRate).toLocaleString('id-ID')}`;
        }
        return `$${num.toFixed(2)}`;
    };

    // Calculate Totals
    const totalClicks = data.reduce((sum, row) => sum + (parseInt(row.clicks) || 0), 0);
    const totalLeads = data.reduce((sum, row) => sum + (parseInt(row.leads) || 0), 0);
    const totalPayouts = data.reduce((sum, row) => sum + (parseFloat(row.payouts) || 0), 0);
    const totalCR = totalClicks > 0 ? (totalLeads / totalClicks) * 100 : 0;

    return (
        <div className="w-full h-full overflow-auto relative scrollbar-hide">
            <table className="w-full text-left border-collapse">
                <thead className={`text-xs uppercase font-semibold tracking-wider sticky top-0 z-10 backdrop-blur-sm shadow-sm ${isDark ? 'bg-[#1a1b2e]/95 text-gray-400' : 'bg-gray-50/95 text-gray-500'}`}>
                    <tr>
                        <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 w-16 text-center">#</th>
                        <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:text-primary" onClick={() => handleSort('date')}>DATE</th>
                        <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:text-primary" onClick={() => handleSort('smartlink')}>SMARTLINK</th>
                        <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:text-primary" onClick={() => handleSort('network')}>NETWORK</th>
                        <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 text-center cursor-pointer hover:text-primary" onClick={() => handleSort('clicks')}>CLICKS</th>
                        <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 text-center cursor-pointer hover:text-primary" onClick={() => handleSort('leads')}>LEADS</th>
                        <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 text-center cursor-pointer hover:text-primary" onClick={() => handleSort('cr')}>CR</th>
                        <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 text-right cursor-pointer hover:text-primary" onClick={() => handleSort('payouts')}>PAYOUTS</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                    {sortedData.length > 0 ? (
                        <>
                            {sortedData.map((row, index) => {
                                const cr = row.clicks > 0 ? ((row.leads / row.clicks) * 100).toFixed(1) : '0';
                                return (
                                    <tr key={index} className="bg-white dark:bg-transparent hover:bg-indigo-50/10 dark:hover:bg-indigo-500/5 transition-all">
                                        <td className="px-6 py-4 text-xs font-medium text-gray-400">{index + 1}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                                                {row.date ? new Date(row.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => onDrillDown(row)}
                                                className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-primary hover:underline transition-colors text-left"
                                            >
                                                {row.smartlink}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            {(() => {
                                                const network = row.network || 'Unknown';
                                                const lowerNet = network.toLowerCase();
                                                if (lowerNet.includes('imonetizeit')) return <div className="flex items-center gap-1.5"><div className="bg-emerald-500 rounded p-1"><span className="material-symbols-outlined text-[14px] text-white">north_east</span></div><span className="text-[10px] font-bold text-emerald-500">iMonetizeit</span></div>;
                                                if (lowerNet.includes('lospollos')) return <div className="flex items-center gap-1.5"><div className="bg-orange-500 rounded p-1 text-[10px]">🎭</div><span className="text-[10px] font-bold text-orange-500">Lospollos</span></div>;
                                                if (lowerNet.includes('trafee')) return <div className="flex items-center gap-1.5"><div className="bg-purple-500 rounded p-1 text-[10px]">⚡</div><span className="text-[10px] font-bold text-purple-500">Trafee</span></div>;
                                                if (lowerNet.includes('clickdealer')) return <div className="flex items-center gap-1.5"><div className="bg-blue-500 rounded p-1 text-[10px]">🤝</div><span className="text-[10px] font-bold text-blue-500">Clickdealer</span></div>;
                                                return <span className="text-[10px] font-bold text-gray-400">{network}</span>;
                                            })()}
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{row.clicks}</span>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{row.leads}</span>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${parseFloat(cr) > 0 ? 'bg-green-500/10 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                                {cr}%
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <span className="text-sm font-black text-green-600 dark:text-green-500">
                                                {formatCurrency(row.payouts)}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            {/* Total Row */}
                            <tr className={`font-bold ${isDark ? 'bg-gray-800/50 text-white' : 'bg-gray-50 text-gray-900'}`}>
                                <td colSpan="4" className="px-6 py-4 text-right pr-12 text-xs uppercase tracking-widest opacity-50">TOTAL</td>
                                <td className="px-4 py-4 text-center font-bold">{totalClicks}</td>
                                <td className="px-4 py-4 text-center font-bold text-indigo-500">{totalLeads}</td>
                                <td className="px-4 py-4 text-center font-bold">{totalCR.toFixed(1)}%</td>
                                <td className="px-4 py-4 text-right font-black text-green-500">
                                    {formatCurrency(totalPayouts)}
                                </td>
                            </tr>
                        </>
                    ) : (
                        <tr>
                            <td colSpan="7" className="px-6 py-12 text-center text-gray-500 italic">No data available for this range...</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
