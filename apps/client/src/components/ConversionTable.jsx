import React, { useState, useMemo } from 'react';

// Platform Icons
const androidSvg = (style) => <svg viewBox="0 0 24 24" fill="#3DDC84" style={style}><path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l-1.997-3.4592c-.3087-.5346-.9858-.7181-1.5208-.4094-.535.3087-.7189.9854-.4098 1.5204l1.9168 3.3204c-1.8946-.8626-4.0494-.8626-5.9439 0l1.9168-3.3204c.3079-.535.1252-1.2117-.4098-1.5204-.5361-.3087-1.2121-.1252-1.5208.4094l-1.9969 3.4592c-2.9103 1.5879-4.7003 4.549-4.9082 7.7788h18.8213c-.2083-3.2298-1.9983-6.1909-4.9086-7.7788" /></svg>;
const appleSvg = (style) => <svg viewBox="0 0 384 512" fill="#A2AAAD" style={style}><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z" /></svg>;
const windowsSvg = (style) => <svg viewBox="0 0 448 512" fill="#0078D7" style={style}><path d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z" /></svg>;

// Browser Icons
const facebookSvg = (style) => <svg style={style} viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>;
const instagramSvg = (style) => <svg style={style} viewBox="0 0 24 24" fill="#E1306C"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.072 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>;
const chromeSvg = (style) => <svg style={style} viewBox="0 0 24 24" fill="#4285F4"><path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12 12-5.373 12-12S18.628 0 12 0zm0 4.154c1.927 0 3.692.68 5.097 1.82L15.355 9.17c-.85-.596-1.875-.95-2.986-.95-2.9 0-5.32 1.99-6.077 4.708H2.435C3.39 7.426 7.338 4.154 12 4.154zm0 15.692c-2.368 0-4.47-1.054-5.922-2.73l3.65-6.32c.22.89.87 1.62 1.72 2.05l-3.33 5.772c1.17.78 2.56 1.228 4.052 1.228 4.23 0 7.747-3.13 8.355-7.23h3.81c-.69 6.27-6.02 11.23-12.335 11.23zm7.077-8.308c-.225 3.32-2.26 6.088-5.077 7.45l-3.65-6.32c.596-.34 1.085-.83 1.425-1.425l6.73 3.882c.35-1.14.572-2.35.572-3.587 0-1.87-.52-3.63-1.42-5.17l-3.75 6.49c.65 1.135 1.05 2.457 1.05 3.86z" /></svg>;

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

    const getTrafficIcon = (row) => {
        const traffic = row.traffic || 'UNKNOWN';
        const browser = row.browser || 'UNKNOWN';
        const lowerTraffic = traffic.toLowerCase();
        const lowerBrowser = browser.toLowerCase();

        // Determine WAP/WEB
        const isMobile = lowerTraffic.includes('android') || lowerTraffic.includes('ios') || lowerTraffic.includes('iphone') || lowerTraffic.includes('mobile');
        const typeLabel = isMobile ? 'WAP' : 'WEB';
        const typeColor = isMobile ? 'text-orange-600 dark:text-orange-400' : 'text-cyan-600 dark:text-cyan-400';

        const iconStyle = { width: '16px', height: '16px' };

        // Get OS Icon
        let osIcon = null;
        if (lowerTraffic.includes('android')) osIcon = androidSvg(iconStyle);
        else if (lowerTraffic.includes('ios') || lowerTraffic.includes('apple') || lowerTraffic.includes('iphone') || lowerTraffic.includes('mac')) osIcon = appleSvg(iconStyle);
        else if (lowerTraffic.includes('windows')) osIcon = windowsSvg(iconStyle);
        else osIcon = <span className="material-symbols-outlined text-base">devices</span>;

        // Get Browser/Source Icon
        let browserIcon = null;
        if (lowerBrowser.includes('facebook')) browserIcon = facebookSvg(iconStyle);
        else if (lowerBrowser.includes('instagram')) browserIcon = instagramSvg(iconStyle);
        else if (lowerBrowser.includes('chrome')) browserIcon = chromeSvg(iconStyle);
        else if (lowerBrowser.includes('tiktok')) browserIcon = <span className="text-sm">🎵</span>;
        else browserIcon = <span className="material-symbols-outlined text-base">public</span>;

        return (
            <div className="flex items-center gap-2">
                <div className="flex animate-in fade-in slide-in-from-left-2 duration-500">
                    <div className="flex items-center -space-x-1.5 hover:space-x-1 transition-all">
                        <div className="bg-white/10 p-1 rounded-md backdrop-blur-md border border-white/10 shadow-sm relative z-10">
                            {osIcon}
                        </div>
                        <div className="bg-white/10 p-1 rounded-md backdrop-blur-md border border-white/10 shadow-sm relative z-0">
                            {browserIcon}
                        </div>
                    </div>
                </div>
                <span className={`text-[10px] font-black tracking-widest ${typeColor} bg-current/5 px-1.5 py-0.5 rounded border border-current/10`}>
                    {typeLabel}
                </span>
            </div>
        );
    };

    const formatCurrency = (num) => {
        const val = parseFloat(num);
        if (isNaN(val)) return currency === 'IDR' ? 'Rp 0' : '$0.00';
        if (currency === 'IDR') {
            return `Rp ${(val * currencyRate).toLocaleString('id-ID')}`;
        }
        return `$${val.toFixed(2)}`;
    };

    const topSmartlink = useMemo(() => {
        if (data.length === 0) return null;
        const totals = data.reduce((acc, curr) => {
            const earnings = parseFloat(curr.earning) || 0;
            const key = curr.smartlink || curr.subId || 'Unknown';
            acc[key] = (acc[key] || 0) + earnings;
            return acc;
        }, {});
        let max = 0; let winner = null;
        Object.entries(totals).forEach(([id, total]) => {
            if (total > max) { max = total; winner = id; }
        });
        return winner;
    }, [data]);

    return (
        <div className="w-full h-full overflow-auto relative scrollbar-hide">
            <table className="w-full text-left border-collapse">
                <thead className={`text-xs font-semibold tracking-wider sticky top-0 z-10 backdrop-blur-sm border-b ${isDark ? 'bg-[#1a1b2e]/95 text-gray-400 border-gray-800' : 'bg-gray-50/95 text-gray-500 border-gray-200'}`}>
                    <tr>
                        <th className="px-6 py-3 w-16 text-center">#</th>
                        <th className="px-6 py-3 cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('smartlink')}>
                            <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold">Smartlink</div>
                        </th>
                        <th className="px-6 py-3 cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('network')}>
                            <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold">Network</div>
                        </th>
                        <th className="px-6 py-3 cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('country')}>
                            <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold">Country</div>
                        </th>
                        <th className="px-6 py-3 cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('traffic')}>
                            <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold">Traffic</div>
                        </th>
                        <th className="px-6 py-3 text-center cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('earning')}>
                            <div className="flex items-center justify-center gap-1 text-[10px] uppercase tracking-widest font-bold">Earning</div>
                        </th>
                        <th className="px-6 py-3 text-center cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('ipAddress')}>
                            <div className="flex items-center justify-center gap-1 text-[10px] uppercase tracking-widest font-bold">IP Address</div>
                        </th>
                    </tr>
                </thead>
                <tbody className="text-xs font-medium divide-y divide-gray-50 dark:divide-gray-800">
                    {filteredData.length > 0 ? (
                        filteredData.map((row, index) => {
                            const displaySmartlink = row.smartlink || row.subId || 'Unknown';
                            // Remove win crown for total "Gambar 3" look
                            return (
                                <tr key={row.id || index} className="bg-white dark:bg-transparent hover:bg-indigo-50/10 dark:hover:bg-indigo-500/5 transition-all group">
                                    <td className="px-6 py-4 text-center text-gray-400 font-mono text-[10px]">{index + 1}</td>
                                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100 font-semibold">
                                        {displaySmartlink}
                                    </td>
                                    <td className="px-6 py-4">
                                        {(() => {
                                            const network = row.network || 'Unknown';
                                            const lowerNet = network.toLowerCase();
                                            // Image 3 style logos using material symbols or simple labels if SVG not found
                                            if (lowerNet.includes('imonetizeit')) return <div className="flex items-center gap-1.5"><div className="bg-emerald-500 rounded p-1"><span className="material-symbols-outlined text-[14px] text-white">north_east</span></div><span className="text-[10px] font-bold text-emerald-500">iMonetizeit</span></div>;
                                            if (lowerNet.includes('lospollos')) return <div className="flex items-center gap-1.5"><div className="bg-orange-500 rounded p-1 text-[10px]">🎭</div><span className="text-[10px] font-bold text-orange-500">Lospollos</span></div>;
                                            if (lowerNet.includes('trafee')) return <div className="flex items-center gap-1.5"><div className="bg-purple-500 rounded p-1 text-[10px]">⚡</div><span className="text-[10px] font-bold text-purple-500">Trafee</span></div>;
                                            if (lowerNet.includes('clickdealer')) return <div className="flex items-center gap-1.5"><div className="bg-blue-500 rounded p-1 text-[10px]">🤝</div><span className="text-[10px] font-bold text-blue-500">Clickdealer</span></div>;
                                            return <span className="text-[10px] font-bold text-gray-400">{network}</span>;
                                        })()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {row.flag ? (
                                                <img alt={row.country} className="w-5 h-3.5 object-cover rounded-sm" src={row.flag} />
                                            ) : <span className="text-sm">🌍</span>}
                                            <span className="text-gray-900 dark:text-gray-100">{row.country}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{getTrafficIcon(row)}</td>
                                    <td className="px-6 py-4 text-center font-mono font-bold text-green-500 text-sm">
                                        {formatCurrency(row.earning)}
                                    </td>
                                    <td className="px-6 py-4 text-center font-mono text-gray-500 dark:text-gray-400 text-[10px]">
                                        {row.ipAddress || row.ip || '-'}
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-500 italic">No conversions found in this time range...</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
