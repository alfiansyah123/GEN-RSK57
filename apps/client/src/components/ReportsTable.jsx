import React from 'react';

export default function ReportsTable({ data }) {
    if (!data || data.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500">
                No data available for the selected period.
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                        <th className="px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">Date/Time</th>
                        <th className="px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">IP Address</th>
                        <th className="px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">Country</th>
                        <th className="px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">Tracker</th>
                        <th className="px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">Link Slug</th>
                        <th className="px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">User Agent</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {data.map((row) => (
                        <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                                {new Date(row.createdAt).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-mono text-xs">
                                {row.ip}
                            </td>
                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                {row.country}
                            </td>
                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">
                                {row.trackerName}
                            </td>
                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                {row.linkSlug}
                            </td>
                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs truncate max-w-[200px]" title={row.userAgent}>
                                {row.userAgent}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
