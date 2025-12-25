import React from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function GeneratorNavigation() {
    const { trackerId } = useParams();
    const { isDark } = useTheme();
    const location = useLocation();

    // Helper to determine if a link is active
    const isActive = (path) => {
        // Handle root generator path separately to avoid active state on all sub-routes if using startsWith
        // The generator path is `/${trackerId}` exactly
        if (path === `/${trackerId}`) {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    const getLinkClass = (path) => {
        const active = isActive(path);
        if (active) {
            return "px-4 py-2 rounded-full text-sm font-medium text-white bg-primary shadow-lg shadow-primary/25 transition-colors";
        }
        return `px-4 py-2 rounded-full text-sm font-medium transition-colors ${isDark ? 'text-[#9293c9] hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'}`;
    };

    return (
        <div className="flex justify-center py-3 mb-4">
            <div className={`flex items-center gap-1 p-1 rounded-full border transition-colors ${isDark ? 'bg-surface-dark/50 border-[#323367]' : 'bg-gray-100 border-gray-200'}`}>
                <Link to={`/${trackerId}`} className={getLinkClass(`/${trackerId}`)}>
                    Generate
                </Link>
                <Link to={`/${trackerId}/bulk-url`} className={getLinkClass(`/${trackerId}/bulk-url`)}>
                    BulkUrl
                </Link>
                <Link to={`/${trackerId}/addon-domain`} className={getLinkClass(`/${trackerId}/addon-domain`)}>
                    Addon Domain
                </Link>
            </div>
        </div>
    );
}
