import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useTheme } from '../context/ThemeContext';

const MAX_ITEMS = 50;

// ============================================
// User-Agent Parsing Helpers
// ============================================
function parseOS(ua) {
    if (!ua) return { name: 'Unknown', icon: 'devices' };
    const u = ua.toLowerCase();
    if (u.includes('iphone') || u.includes('ipad') || u.includes('ipod')) return { name: 'iOS', icon: 'phone_iphone' };
    if (u.includes('android')) return { name: 'Android', icon: 'phone_android' };
    if (u.includes('windows')) return { name: 'Windows', icon: 'laptop_windows' };
    if (u.includes('macintosh') || u.includes('mac os')) return { name: 'macOS', icon: 'laptop_mac' };
    if (u.includes('linux')) return { name: 'Linux', icon: 'computer' };
    if (u.includes('cros')) return { name: 'ChromeOS', icon: 'laptop_chromebook' };
    return { name: 'Unknown', icon: 'devices' };
}

function parseBrowser(ua) {
    if (!ua) return { name: 'Unknown', icon: 'public' };
    const u = ua.toLowerCase();
    // In-app browsers first (most specific)
    if (u.includes('instagram')) return { name: 'Instagram', icon: 'photo_camera' };
    if (u.includes('fban') || u.includes('fbav') || u.includes('fb_iab')) return { name: 'Facebook', icon: 'group' };
    if (u.includes('tiktok')) return { name: 'TikTok', icon: 'play_circle' };
    if (u.includes('twitter')) return { name: 'Twitter', icon: 'tag' };
    if (u.includes('snapchat')) return { name: 'Snapchat', icon: 'photo_camera' };
    if (u.includes('line/')) return { name: 'LINE', icon: 'chat' };
    if (u.includes('whatsapp')) return { name: 'WhatsApp', icon: 'chat' };
    if (u.includes('telegram')) return { name: 'Telegram', icon: 'send' };
    // Standard browsers
    if (u.includes('edg/') || u.includes('edge/')) return { name: 'Edge', icon: 'language' };
    if (u.includes('opr/') || u.includes('opera')) return { name: 'Opera', icon: 'language' };
    if (u.includes('brave')) return { name: 'Brave', icon: 'shield' };
    if (u.includes('firefox') || u.includes('fxios')) return { name: 'Firefox', icon: 'local_fire_department' };
    if (u.includes('samsungbrowser')) return { name: 'Samsung', icon: 'phone_android' };
    if (u.includes('ucbrowser') || u.includes('ucweb')) return { name: 'UC Browser', icon: 'language' };
    if ((u.includes('chrome') || u.includes('crios')) && !u.includes('edg')) return { name: 'Chrome', icon: 'language' };
    if (u.includes('safari') && !u.includes('chrome') && !u.includes('crios')) return { name: 'Safari', icon: 'travel_explore' };
    return { name: 'Other', icon: 'public' };
}

function parseReferrer(ref) {
    if (!ref) return '-';
    try {
        const hostname = new URL(ref).hostname;
        // Clean up common long hostnames
        return hostname.replace(/^www\./, '').replace(/^m\./, '').replace(/^l\./, '');
    } catch {
        return ref.substring(0, 30);
    }
}

function formatTime(dateStr) {
    const d = new Date(dateStr);
    const day = d.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[d.getMonth()];
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    return `${day} ${month}, ${hours}.${mins}`;
}

// ============================================
// Component
// ============================================
export default function LiveTraffic() {
    const [traffic, setTraffic] = useState([]);
    const [stats, setStats] = useState({ totalClicks: 0, countries: 0, uniqueIps: 0 });
    const { isDark } = useTheme();

    const formatItem = (item, linkData) => ({
        id: item.id,
        time: formatTime(item.createdAt),
        clickId: linkData?.trackerId || 'Unknown',
        referrer: parseReferrer(item.referrer),
        country: item.country || 'XX',
        flag: (item.country && item.country.toLowerCase() !== 'xx')
            ? `https://flagcdn.com/w20/${item.country.toLowerCase()}.png`
            : 'https://flagcdn.com/w20/un.png',
        os: parseOS(item.userAgent),
        browser: parseBrowser(item.userAgent),
        ip: item.ip || '-',
        network: linkData?.network || 'Unknown',
    });

    useEffect(() => {
        const fetchInitialTraffic = async () => {
            const { data, error } = await supabase
                .from('click')
                .select(`
                    id, ip, country, userAgent, referrer, createdAt,
                    link ( trackerId, network )
                `)
                .order('createdAt', { ascending: false })
                .limit(MAX_ITEMS);

            if (data) {
                const formatted = data.map(item => formatItem(item, item.link));
                setTraffic(formatted);

                // Calculate stats
                const countries = new Set(data.map(c => c.country).filter(Boolean));
                const ips = new Set(data.map(c => c.ip).filter(Boolean));
                setStats({
                    totalClicks: data.length,
                    countries: countries.size,
                    uniqueIps: ips.size,
                });
            }
        };

        fetchInitialTraffic();

        // Realtime subscription
        const subscription = supabase
            .channel('live-traffic')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'click' }, async (payload) => {
                const newClick = payload.new;

                const { data: linkData } = await supabase
                    .from('link')
                    .select('trackerId, network')
                    .eq('id', newClick.linkId)
                    .single();

                const newItem = formatItem(newClick, linkData);

                setTraffic(prev => {
                    const updated = [newItem, ...prev].slice(0, MAX_ITEMS);
                    // Update stats
                    const countries = new Set(updated.map(c => c.country).filter(Boolean));
                    const ips = new Set(updated.map(c => c.ip).filter(Boolean));
                    setStats({
                        totalClicks: updated.length,
                        countries: countries.size,
                        uniqueIps: ips.size,
                    });
                    return updated;
                });
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className={`rounded-xl p-4 text-center border ${isDark ? 'glass-card border-white/10' : 'bg-white border-gray-200'}`}>
                    <div className={`text-2xl md:text-3xl font-black ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{stats.totalClicks}</div>
                    <div className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Total Clicks</div>
                </div>
                <div className={`rounded-xl p-4 text-center border ${isDark ? 'glass-card border-white/10' : 'bg-white border-gray-200'}`}>
                    <div className={`text-2xl md:text-3xl font-black ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{stats.countries}</div>
                    <div className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Countries</div>
                </div>
                <div className={`rounded-xl p-4 text-center border ${isDark ? 'glass-card border-white/10' : 'bg-white border-gray-200'}`}>
                    <div className={`text-2xl md:text-3xl font-black ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>{stats.uniqueIps}</div>
                    <div className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Unique IPs</div>
                </div>
            </div>

            {/* Click Performance Title */}
            <div className="flex items-center justify-between">
                <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Click Performance</h2>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>LIVE</span>
                </div>
            </div>

            {/* Table */}
            <div className={`rounded-xl border overflow-hidden ${isDark ? 'glass-card border-white/10' : 'bg-white border-gray-200'}`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className={`border-b ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                <th className={`px-4 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Time</th>
                                <th className={`px-4 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Click ID</th>
                                <th className={`px-4 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Referrer</th>
                                <th className={`px-4 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Country</th>
                                <th className={`px-4 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>OS</th>
                                <th className={`px-4 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Browser</th>
                                <th className={`px-4 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>IP Address</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-gray-100'}`}>
                            {traffic.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-12">
                                        <div className="flex flex-col items-center gap-2 opacity-50">
                                            <span className={`material-symbols-outlined text-[32px] ${isDark ? 'text-slate-600' : 'text-gray-300'}`}>radar</span>
                                            <span className={`text-xs ${isDark ? 'text-slate-600' : 'text-gray-400'}`}>Waiting for clicks...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                traffic.map((item, idx) => (
                                    <tr key={item.id} className={`transition-colors ${idx === 0 ? (isDark ? 'bg-emerald-500/5' : 'bg-emerald-50') : ''} ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                                        {/* Time */}
                                        <td className={`px-4 py-3 whitespace-nowrap text-xs font-medium ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                                            {item.time}
                                        </td>

                                        {/* Click ID */}
                                        <td className={`px-4 py-3 whitespace-nowrap text-xs font-mono font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {item.clickId}
                                        </td>

                                        {/* Referrer */}
                                        <td className={`px-4 py-3 whitespace-nowrap text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                            {item.referrer}
                                        </td>

                                        {/* Country */}
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={item.flag}
                                                    alt={item.country}
                                                    className="w-5 h-3.5 object-cover rounded-sm shadow-sm"
                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                />
                                            </div>
                                        </td>

                                        {/* OS */}
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5">
                                                <span className={`material-symbols-outlined text-[16px] ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                                    {item.os.icon}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Browser */}
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5">
                                                <span className={`material-symbols-outlined text-[16px] ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                                    {item.browser.icon}
                                                </span>
                                            </div>
                                        </td>

                                        {/* IP */}
                                        <td className={`px-4 py-3 whitespace-nowrap text-xs font-mono ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                            {item.ip}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
