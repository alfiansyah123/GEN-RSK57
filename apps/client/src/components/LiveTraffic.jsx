import React, { useState, useEffect, useRef } from 'react';
import { supabaseTraffic } from '../utils/supabaseTraffic';

const MAX_ITEMS = 5;

export default function LiveTraffic() {
    const [traffic, setTraffic] = useState([]);
    const subscriptionRef = useRef(null);

    const fetchInitialTraffic = async () => {
        try {
            const { data, error } = await supabaseTraffic
                .from('clicks')
                .select('id, country, link_id, slug, created_at')
                .order('created_at', { ascending: false })
                .limit(MAX_ITEMS);

            if (error) throw error;
            if (data) {
                const formatted = data.map(item => ({
                    id: item.id,
                    country: item.country,
                    countryCode: item.country || 'Unknown',
                    name: item.slug || item.link_id || 'Unknown',
                    network: 'LIVE',
                    flag: (item.country && item.country.toLowerCase() !== 'xx')
                        ? `https://flagcdn.com/w20/${item.country.toLowerCase()}.png`
                        : 'https://flagcdn.com/w20/un.png'
                }));
                setTraffic(formatted);
            }
        } catch (error) {
            console.error('Initial Traffic Fetch Error:', error);
        }
    };

    useEffect(() => {
        // Initial Fetch
        fetchInitialTraffic();

        // Realtime Subscription
        subscriptionRef.current = supabaseTraffic
            .channel('public:clicks')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'clicks' }, payload => {
                const newItem = payload.new;
                const formatted = {
                    id: newItem.id,
                    country: newItem.country,
                    countryCode: newItem.country || 'Unknown',
                    name: newItem.slug || newItem.link_id || 'Unknown',
                    network: 'LIVE',
                    flag: (newItem.country && newItem.country.toLowerCase() !== 'xx')
                        ? `https://flagcdn.com/w20/${newItem.country.toLowerCase()}.png`
                        : 'https://flagcdn.com/w20/un.png'
                };
                setTraffic(prev => [formatted, ...prev.slice(0, MAX_ITEMS - 1)]);
            })
            .subscribe();

        return () => {
            if (subscriptionRef.current) {
                supabaseTraffic.removeChannel(subscriptionRef.current);
            }
        };
    }, []);

    return (
        <div className="rounded-xl p-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase text-gray-900 dark:text-white">
                    Live Traffic
                </h3>
            </div>

            <div className="space-y-2 min-h-[150px]">
                {traffic.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-slate-500 opacity-50">
                        <span className="material-symbols-outlined text-[32px] mb-2">radar</span>
                        <span className="text-xs">Waiting for clicks...</span>
                    </div>
                ) : (
                    traffic.map((item, index) => (
                        <div
                            key={item.id}
                            className={`flex items-center rounded p-2 shadow-sm border animate-in slide-in-from-top-2 fade-in duration-300 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 ${index === 0 ? 'animate-pulse' : ''}`}
                        >
                            <div className="flex-shrink-0 w-8 h-5 rounded mr-2 overflow-hidden relative bg-gray-200 dark:bg-gray-600">
                                <img
                                    alt={`${item.country} Flag`}
                                    className="object-cover w-full h-full"
                                    src={item.flag}
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            </div>
                            <div className="flex flex-col min-w-0 flex-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-mono font-medium truncate text-blue-500">
                                        {item.name}
                                    </span>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300 ml-2 truncate max-w-[80px]">
                                        {item.network}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
