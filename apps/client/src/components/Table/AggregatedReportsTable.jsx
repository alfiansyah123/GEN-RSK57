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
                        <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:text-primary" onClick={() => handleSort('smartlink')}>SMARTLINK</th>
                        <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:text-primary" onClick={() => handleSort('network')}>NETWORK</th>
                        <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 text-center cursor-pointer hover:text-primary" onClick={() => handleSort('clicks')}>CLICKS</th>
                        <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 text-center cursor-pointer hover:text-primary" onClick={() => handleSort('leads')}>LEADS</th>
                        <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 text-center cursor-pointer hover:text-primary" onClick={() => handleSort('cr')}>CR</th>
                        <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 text-right cursor-pointer hover:text-primary" onClick={() => handleSort('payouts')}>PAYOUTS</th>
                    </tr>
                </thead>
                <tbody className={`text-sm font-medium divide-y ${isDark ? 'divide-gray-800' : 'divide-gray-100'}`}>
                    {sortedData.length > 0 ? (
                        <>
                            {sortedData.map((row, index) => (
                                <tr key={index} className={`transition-colors text-gray-900 dark:text-gray-100 ${isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-gray-50'}`}>
                                    <td className="px-6 py-3 text-center text-gray-500 dark:text-gray-400 font-mono">{index + 1}</td>
                                    <td className="px-6 py-3">
                                        <button
                                            onClick={() => onDrillDown(row)}
                                            className="font-medium hover:text-primary hover:underline transition-colors text-left"
                                        >
                                            {row.smartlink}
                                        </button>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className={`px-2 py-0.5 rounded text-xs border ${row.network?.toLowerCase().includes('lospollos')
                                                ? 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800'
                                                : 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800'
                                            }`}>
                                            {row.network}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-center font-mono">{row.clicks}</td>
                                    <td className="px-6 py-3 text-center font-mono">{row.leads}</td>
                                    <td className="px-6 py-3 text-center font-mono">{typeof row.cr === 'number' ? row.cr.toFixed(2) : row.cr}%</td>
                                    <td className="px-6 py-3 text-right font-mono font-bold text-green-600 dark:text-green-400">
                                        {formatCurrency(row.payouts)}
                                    </td>
                                </tr>
                            ))}
                            {/* Total Row */}
                            <tr className={`font-bold ${isDark ? 'bg-[#1a1b2e] text-white' : 'bg-gray-100 text-gray-900'}`}>
                                <td colSpan="3" className="px-6 py-3 text-center border-t border-gray-200 dark:border-gray-700">TOTAL</td>
                                <td className="px-6 py-3 text-center font-mono border-t border-gray-200 dark:border-gray-700">{totalClicks}</td>
                                <td className="px-6 py-3 text-center font-mono border-t border-gray-200 dark:border-gray-700">{totalLeads}</td>
                                <td className="px-6 py-3 text-center font-mono border-t border-gray-200 dark:border-gray-700">{totalCR.toFixed(2)}%</td>
                                <td className="px-6 py-3 text-right font-mono text-green-600 dark:text-green-400 border-t border-gray-200 dark:border-gray-700">
                                    {formatCurrency(totalPayouts)}
                                </td>
                            </tr>
                        </>
                    ) : (
                        <tr>
                            <td colSpan="7" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                No data available for this period.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
