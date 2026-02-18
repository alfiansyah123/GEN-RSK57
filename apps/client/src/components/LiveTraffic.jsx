import { supabase } from '../lib/supabaseClient';

const MAX_ITEMS = 5;

export default function LiveTraffic() {
    const [traffic, setTraffic] = useState([]);

    // Realtime Traffic Logic (Supabase)
    useEffect(() => {
        // Initial fetch of recent clicks
        const fetchInitialTraffic = async () => {
            const { data, error } = await supabase
                .from('click')
                .select(`
                    id,
                    country,
                    createdAt,
                    link (
                        trackerId,
                        network
                    )
                `)
                .order('createdAt', { ascending: false })
                .limit(MAX_ITEMS);

            if (data) {
                const formatted = data.map(item => ({
                    id: item.id,
                    country: item.country,
                    countryCode: item.country || 'Unknown',
                    name: item.link?.trackerId || 'Unknown',
                    network: item.link?.network || 'Unknown',
                    flag: (item.country && item.country.toLowerCase() !== 'xx')
                        ? `https://flagcdn.com/w20/${item.country.toLowerCase()}.png`
                        : 'https://flagcdn.com/w20/un.png'
                }));
                setTraffic(formatted);
            }
        };

        fetchInitialTraffic();

        // Subscribe to real-time inserts on 'click' table
        const subscription = supabase
            .channel('live-traffic')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'click' }, async (payload) => {
                const newClick = payload.new;

                // Fetch related link info for the new click
                const { data: linkData } = await supabase
                    .from('link')
                    .select('trackerId, network')
                    .eq('id', newClick.linkId)
                    .single();

                const newItem = {
                    id: newClick.id,
                    country: newClick.country,
                    countryCode: newClick.country || 'Unknown',
                    name: linkData?.trackerId || 'Unknown',
                    network: linkData?.network || 'Unknown',
                    flag: (newClick.country && newClick.country.toLowerCase() !== 'xx')
                        ? `https://flagcdn.com/w20/${newClick.country.toLowerCase()}.png`
                        : 'https://flagcdn.com/w20/un.png'
                };

                setTraffic(prev => [newItem, ...prev].slice(0, MAX_ITEMS));
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
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
