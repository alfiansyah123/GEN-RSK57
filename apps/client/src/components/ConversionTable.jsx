import React, { useState, useMemo } from 'react';

export default function ConversionTable({ searchQuery, currency = 'USD', currencyRate = 16000, data = [] }) {
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

    const filteredData = sortedData.filter((item) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            (item.smartlink && item.smartlink.toLowerCase().includes(query)) ||
            (item.network && item.network.toLowerCase().includes(query)) ||
            (item.country && item.country.toLowerCase().includes(query)) ||
            (item.ipAddress && item.ipAddress.includes(query))
        );
    });

    const getTrafficIcon = (traffic) => {
        const t = traffic ? traffic.toUpperCase() : 'UNKNOWN';
        if (t === 'WAP' || t === 'MOB') {
            return (
                <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400">
                    <span className="material-symbols-outlined text-base">smartphone</span>
                    <span className="text-xs font-bold">WAP</span>
                </div>
            );
        } else if (t === 'WEB') {
            return (
                <div className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400">
                    <span className="material-symbols-outlined text-base">desktop_windows</span>
                    <span className="text-xs font-bold">WEB</span>
                </div>
            );
        } else {
            return (
                <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                    <span className="text-xs font-bold bg-blue-100 dark:bg-blue-900/30 px-1.5 rounded">BOT</span>
                </div>
            );
        }
    };

    const formatCurrency = (num) => {
        const val = parseFloat(num);
        if (isNaN(val)) return currency === 'IDR' ? 'Rp 0' : '$0.00';

        if (currency === 'IDR') {
            const idrVal = val * currencyRate;
            return `Rp ${idrVal.toLocaleString('id-ID')}`;
        }
        return `$${val.toFixed(2)}`;
    };

    // Aggregate earnings by Smartlink to find the "King"
    const topSmartlink = useMemo(() => {
        if (data.length === 0) return null;
        const totals = data.reduce((acc, curr) => {
            const earnings = parseFloat(curr.earning) || 0;
            // Use fallback if smartlink is missing, but backend ensures it sends 'smartlink'
            const key = curr.smartlink || curr.subId || 'Unknown';
            acc[key] = (acc[key] || 0) + earnings;
            return acc;
        }, {});

        let max = 0;
        let winner = null;
        Object.entries(totals).forEach(([id, total]) => {
            if (total > max) {
                max = total;
                winner = id;
            }
        });
        return winner;
    }, [data]);

    return (
        <div className="w-full h-full overflow-auto relative scrollbar-hide">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 dark:bg-gray-800/90 text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider sticky top-0 z-10 backdrop-blur-sm shadow-sm">
                    <tr>
                        <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 w-16 text-center bg-gray-50 dark:bg-gray-800/90">
                            #
                        </th>
                        <th
                            className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 cursor-pointer group hover:text-primary bg-gray-50 dark:bg-gray-800/90"
                            onClick={() => handleSort('smartlink')}
                        >
                            <div className="flex items-center">
                                Smartlink
                                <span className="material-symbols-outlined text-sm ml-1 opacity-0 group-hover:opacity-100">
                                    unfold_more
                                </span>
                            </div>
                        </th>
                        <th
                            className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 cursor-pointer group hover:text-primary bg-gray-50 dark:bg-gray-800/90"
                            onClick={() => handleSort('network')}
                        >
                            <div className="flex items-center">
                                Network
                                <span className="material-symbols-outlined text-sm ml-1 opacity-0 group-hover:opacity-100">
                                    unfold_more
                                </span>
                            </div>
                        </th>
                        <th
                            className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 cursor-pointer group hover:text-primary bg-gray-50 dark:bg-gray-800/90"
                            onClick={() => handleSort('country')}
                        >
                            <div className="flex items-center">
                                Country
                                <span className="material-symbols-outlined text-sm ml-1 opacity-0 group-hover:opacity-100">
                                    unfold_more
                                </span>
                            </div>
                        </th>
                        <th
                            className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 cursor-pointer group hover:text-primary bg-gray-50 dark:bg-gray-800/90"
                            onClick={() => handleSort('traffic')}
                        >
                            <div className="flex items-center">
                                Traffic
                                <span className="material-symbols-outlined text-sm ml-1 opacity-0 group-hover:opacity-100">
                                    unfold_more
                                </span>
                            </div>
                        </th>
                        <th
                            className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 text-center cursor-pointer group hover:text-primary bg-gray-50 dark:bg-gray-800/90"
                            onClick={() => handleSort('earning')}
                        >
                            <div className="flex items-center justify-center">
                                Earning
                                <span className="material-symbols-outlined text-sm ml-1 opacity-0 group-hover:opacity-100">
                                    unfold_more
                                </span>
                            </div>
                        </th>
                        <th
                            className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 text-center cursor-pointer group hover:text-primary bg-gray-50 dark:bg-gray-800/90"
                            onClick={() => handleSort('created_at')}
                        >
                            <div className="flex items-center justify-center">
                                Time
                                <span className="material-symbols-outlined text-sm ml-1 opacity-0 group-hover:opacity-100">
                                    unfold_more
                                </span>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody className="text-sm font-medium divide-y divide-gray-100 dark:divide-gray-700">
                    {filteredData.length > 0 ? (
                        filteredData.map((row, index) => {
                            // Ensure we use the correct key
                            const displaySmartlink = row.smartlink || row.subId || 'Unknown';
                            const isTopWinner = topSmartlink && displaySmartlink === topSmartlink;

                            return (
                                <tr
                                    key={row.id || index}
                                    className="bg-white dark:bg-transparent hover:bg-gray-50/80 dark:hover:bg-gray-800/60 transition-colors group"
                                >
                                    <td className="px-6 py-3 text-center text-gray-500 dark:text-gray-400 font-mono">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-3 text-gray-900 dark:text-white font-medium">
                                        {isTopWinner && <span className="text-yellow-500 mr-2" title="Top Earner">👑</span>}
                                        {displaySmartlink}
                                    </td>
                                    <td className="px-6 py-3">
                                        {(() => {
                                            const network = row.network || 'Unknown';
                                            const lowerNet = network.toLowerCase();
                                            let badgeClass = "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800";

                                            if (lowerNet.includes('imonetizeit')) {
                                                badgeClass = "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
                                            } else if (lowerNet.includes('lospollos')) {
                                                badgeClass = "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800";
                                            } else if (lowerNet.includes('clickdealer')) {
                                                badgeClass = "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800";
                                            } else if (lowerNet.includes('trafee')) {
                                                badgeClass = "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800";
                                            }

                                            return (
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border ${badgeClass}`}>
                                                    {network}
                                                </span>
                                            );
                                        })()}
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-2">
                                            {row.flag && (
                                                <img
                                                    alt={row.country}
                                                    className="w-5 rounded-sm shadow-sm"
                                                    src={row.flag}
                                                    onError={(e) => e.target.style.display = 'none'}
                                                />
                                            )}
                                            <span className="text-gray-900 dark:text-white">{row.country}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">{getTrafficIcon(row.traffic)}</td>
                                    <td className="px-6 py-3 text-center font-mono font-semibold text-green-600 dark:text-green-400">
                                        {formatCurrency(row.earning)}
                                    </td>
                                    <td className="px-6 py-3 text-center font-mono text-gray-500 dark:text-gray-400 text-xs">
                                        {(() => {
                                            if (!row.created_at) return '-';
                                            try {
                                                const dateStr = row.created_at.replace(' ', 'T');
                                                const d = new Date(dateStr);
                                                if (isNaN(d.getTime())) return row.created_at;
                                                return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
                                            } catch (e) {
                                                return row.created_at;
                                            }
                                        })()}
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="7" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                No conversions found for this period.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
