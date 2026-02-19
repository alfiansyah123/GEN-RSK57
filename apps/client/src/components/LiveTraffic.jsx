import React, { useState, useEffect, useRef } from 'react';

const MAX_ITEMS = 5;

export default function LiveTraffic() {
    const [traffic, setTraffic] = useState([]);

    // Polling Logic (PHP Backend)
    useEffect(() => {
        const fetchTraffic = async () => {
            try {
                // Fetch dari API PHP yang baru dibuat
                const response = await fetch('https://ccpxengine.shop/api/live_traffic.php');
                if (response.ok) {
                    const json = await response.json();
                    if (json && json.data) {
                        const newItems = json.data.map(item => ({
                            id: item.id,
                            country: item.country,
                            countryCode: item.country || 'Unknown',
                            name: item.trackerId || 'Unknown',
                            network: item.network || 'Unknown', // Ambil Network dari API
                            flag: (item.country && item.country.toLowerCase() !== 'xx')
                                ? `https://flagcdn.com/w20/${item.country.toLowerCase()}.png`
                                : 'https://flagcdn.com/w20/un.png'
                        }));
                        setTraffic(newItems.slice(0, MAX_ITEMS));
                    }
                }
            } catch (error) {
                console.error('Live Traffic Fetch Error:', error);
            }
        };

        // Jalan pertama kali
        fetchTraffic();

        // Ulangi setiap 3 detik
        const interval = setInterval(fetchTraffic, 3000);

        return () => clearInterval(interval);
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
