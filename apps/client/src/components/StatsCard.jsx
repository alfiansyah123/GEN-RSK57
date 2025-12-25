import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function StatsCard({ count = 0 }) {
    const { isDark } = useTheme();
    return (
        <div className={`border rounded-lg px-4 py-2 flex items-center gap-3 transition-colors ${isDark ? 'bg-surface-dark border-secondary' : 'bg-white border-gray-200 shadow-sm'}`}>
            <span className={`${isDark ? 'text-text-muted' : 'text-gray-500'} text-sm`}>Total Trackers:</span>
            <span className={`${isDark ? 'text-white' : 'text-gray-900'} font-bold text-lg`}>{count}</span>
        </div>
    )
}
