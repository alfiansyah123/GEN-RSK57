import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import GeneratorNavigation from '../components/GeneratorNavigation';
import { supabase } from '../lib/supabaseClient';

// Tier 1 Countries (High CPC countries)
const TIER1_COUNTRIES = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'SE', name: 'Sweden' },
    { code: 'NO', name: 'Norway' },
    { code: 'DK', name: 'Denmark' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'AT', name: 'Austria' },
    { code: 'BE', name: 'Belgium' },
    { code: 'NZ', name: 'New Zealand' },
    { code: 'IE', name: 'Ireland' },
];

export default function GeoRedirect() {
    const { trackerId } = useParams();
    const { isDark } = useTheme();

    const [campaigns, setCampaigns] = useState([]);
    const [domains, setDomains] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Geo Redirect Configuration
    const [tier1Network, setTier1Network] = useState('iMonetizeit');
    const [tier2Network, setTier2Network] = useState('Trafee');
    const [selectedDomain, setSelectedDomain] = useState('random');
    const [numberOfLinks, setNumberOfLinks] = useState(1);

    // Generated Results
    const [generatedUrls, setGeneratedUrls] = useState([]);

    // Fetch campaigns and domains
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: campaignsData } = await supabase
                    .from('campaign')
                    .select('*')
                    .order('createdAt', { ascending: false });

                if (campaignsData) setCampaigns(campaignsData);

                const { data: domainsData } = await supabase
                    .from('domain')
                    .select('*')
                    .order('addedAt', { ascending: false });

                if (domainsData) {
                    const formatted = domainsData.map(d => ({ ...d, title: d.name }));
                    setDomains(formatted);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    // Get unique networks from campaigns
    const availableNetworks = [...new Set(campaigns.map(c => c.network))];
    const networkOptions = availableNetworks.length > 0 ? availableNetworks : ['iMonetizeit', 'Lospollos', 'Clickdealer', 'Trafee'];

    // Helper to generate random Click ID
    const generateClickId = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 32; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const handleGenerate = async () => {
        // Find campaigns for both networks
        const tier1Campaign = campaigns.find(c => c.network === tier1Network);
        const tier2Campaign = campaigns.find(c => c.network === tier2Network);

        if (!tier1Campaign) {
            alert(`No campaign found for ${tier1Network}. Please create one in Campaign Management first.`);
            return;
        }
        if (!tier2Campaign) {
            alert(`No campaign found for ${tier2Network}. Please create one in Campaign Management first.`);
            return;
        }

        setIsLoading(true);
        setGeneratedUrls([]);

        const allGeneratedUrls = [];
        const payloads = [];

        try {
            for (let i = 0; i < numberOfLinks; i++) {
                const clickId = generateClickId();

                // Resolve Domain
                let finalDomain = selectedDomain;
                if (selectedDomain === 'random') {
                    const activeDomains = domains.filter(d => d.status === 'Active');
                    if (activeDomains.length > 0) {
                        const randomIdx = Math.floor(Math.random() * activeDomains.length);
                        finalDomain = activeDomains[randomIdx].title;
                    } else {
                        alert('No active domains available.');
                        setIsLoading(false);
                        return;
                    }
                }

                // Prepare tier1 and tier2 target URLs
                let tier1Url = tier1Campaign.offerName.replace('{sub_id}', trackerId);
                let tier2Url = tier2Campaign.offerName.replace('{sub_id}', trackerId);

                // Note: The schema currently lacks `isGeoRedirect` and `geoRules`.
                // We will try to insert them, but if it fails, we might need a schema update.
                // For now, we will store the PRIMARY (tier2) url as targetUrl.

                payloads.push({
                    slug: clickId,
                    "targetUrl": tier2Url, // Default fallback
                    domain: finalDomain,
                    "trackerId": trackerId,
                    network: 'GeoRedirect'
                });

                const finalUrl = `https://${finalDomain}/${clickId}`;
                allGeneratedUrls.push({
                    url: finalUrl,
                    tier1: `${tier1Network} (${TIER1_COUNTRIES.length} countries)`,
                    tier2: `${tier2Network} (Rest of World)`
                });
            }

            // Bulk Insert
            const { error } = await supabase
                .from('link')
                .insert(payloads);

            if (error) {
                // Fallback if schema doesn't match? No, strict schema.
                throw error;
            }

            setGeneratedUrls(allGeneratedUrls);

            // Auto-copy
            if (allGeneratedUrls.length > 0) {
                const allLinks = allGeneratedUrls.map(r => r.url).join('\n');
                navigator.clipboard.writeText(allLinks).catch(err => console.error('Failed to copy:', err));
            }

        } catch (error) {
            console.error('Error generating geo link:', error);
            alert('Failed to generate geo link: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`font-display flex flex-col min-h-screen overflow-y-auto transition-colors ${isDark ? 'bg-transparent text-white' : 'bg-gray-50 text-gray-900'}`}>

            <main className="flex-1 w-full max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 pb-10 pt-4 md:pt-16 relative z-10">
                <div className="w-full space-y-8">
                    <div className="space-y-8">

                        {/* Main Card */}
                        <div className={`relative overflow-hidden rounded-[2rem] border transition-all duration-500 ${isDark
                            ? 'glass-panel border-white/20 shadow-2xl shadow-purple-900/20'
                            : 'bg-white border-gray-300 shadow-xl shadow-gray-200/50'
                            }`}>

                            <div className="p-4 md:p-10 relative">
                                {/* Fully Centered Premium Header: Reverted to Logo Top */}
                                <div className="flex flex-col items-center text-center gap-8 mb-12 pb-10 border-b border-white/10">
                                    
                                    {/* Logo Section */}
                                    <div className="relative group">
                                        <div className="absolute -inset-4 bg-indigo-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                        <img
                                            src="/logo.png"
                                            alt="D87"
                                            className="h-36 md:h-52 w-auto object-contain relative transition-transform duration-700 hover:scale-110 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                                        />
                                    </div>

                                    {/* Title Section */}
                                    <div className="space-y-4 max-w-2xl">
                                        <div className="flex flex-col items-center">
                                            <h2 className={`text-4xl md:text-7xl font-black italic tracking-tighter leading-[0.8] ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                D87 <span className={isDark ? 'text-indigo-500' : 'text-indigo-600'}>GEO REDIRECT</span>
                                            </h2>
                                            <p className={`mt-4 text-sm md:text-xl font-black uppercase tracking-[0.8em] opacity-80 ${isDark ? 'text-indigo-300' : 'text-indigo-500'}`}>
                                                BOLO WOLU PITU
                                            </p>
                                        </div>

                                        {/* Tracker Badge - Centered & Bold */}
                                        <div className="flex justify-center mt-6">
                                            <div className={`flex items-center gap-4 px-8 py-3 rounded-full border-2 shadow-xl transition-all ${isDark
                                                ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300 shadow-indigo-500/5'
                                                : 'bg-white border-indigo-100 text-indigo-600 shadow-lg'
                                                }`}>
                                                <span className="text-[11px] font-black uppercase tracking-[0.2em] opacity-60">TRACKER ACTIVE</span>
                                                <div className="w-[2px] h-4 bg-current opacity-20"></div>
                                                <span className="text-xl font-black tracking-widest uppercase italic">{trackerId}</span>
                                                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse ring-4 ring-green-500/20 ml-1"></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Navigation Section - Centered */}
                                    <div className="mt-4">
                                        <div className={`p-2 rounded-[2.5rem] shadow-2xl transition-all ${isDark ? 'bg-black/40 border border-white/10 backdrop-blur-xl' : 'bg-white border border-gray-200'}`}>
                                            <GeneratorNavigation />
                                        </div>
                                    </div>
                                </div>

                                {/* Geo Redirect Info Header */}
                                <div className={`mb-8 rounded-xl p-5 transition-colors ${isDark ? 'glass-card' : 'bg-gray-50'}`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="flex-shrink-0 size-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white">
                                            <span className="material-symbols-outlined text-[24px]">public</span>
                                        </div>
                                        <div>
                                            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Geo Redirect Generator</h3>
                                            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                                Create smart links that redirect visitors to different networks based on their country
                                            </p>
                                        </div>
                                    </div>

                                    {/* Tier 1 Countries Preview */}
                                    <div className="flex flex-wrap gap-1.5 mt-4">
                                        <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Tier 1:</span>
                                        {TIER1_COUNTRIES.slice(0, 10).map(country => (
                                            <span key={country.code} className={`px-2 py-0.5 rounded text-xs font-medium ${isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'}`}>
                                                {country.code}
                                            </span>
                                        ))}
                                        {TIER1_COUNTRIES.length > 10 && (
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${isDark ? 'bg-slate-500/20 text-slate-400' : 'bg-gray-100 text-gray-500'}`}>
                                                +{TIER1_COUNTRIES.length - 10} more
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Configuration Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                                    {/* Tier 1 Network */}
                                    <div className={`rounded-xl p-5 border transition-colors ${isDark ? 'glass-card border-green-500/30' : 'bg-green-50 border-green-200'}`}>
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className={`material-symbols-outlined text-[20px] ${isDark ? 'text-green-400' : 'text-green-600'}`}>arrow_upward</span>
                                            <label className={`text-sm font-bold ${isDark ? 'text-green-400' : 'text-green-700'}`}>TIER 1 COUNTRIES</label>
                                        </div>
                                        <p className={`text-xs mb-3 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                            US, UK, CA, AU, DE, FR, NL, etc. → High CPC countries
                                        </p>
                                        <select
                                            value={tier1Network}
                                            onChange={(e) => setTier1Network(e.target.value)}
                                            className={`w-full appearance-none rounded-xl border px-4 py-3 text-sm font-medium outline-none transition-all cursor-pointer ${isDark
                                                ? 'glass-input text-white focus:border-green-500'
                                                : 'bg-white border-gray-200 text-gray-900 focus:border-green-500'
                                                }`}
                                        >
                                            {networkOptions.map((network) => (
                                                <option key={network} value={network} className="text-black">{network}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Tier 2 Network */}
                                    <div className={`rounded-xl p-5 border transition-colors ${isDark ? 'glass-card border-orange-500/30' : 'bg-orange-50 border-orange-200'}`}>
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className={`material-symbols-outlined text-[20px] ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>public</span>
                                            <label className={`text-sm font-bold ${isDark ? 'text-orange-400' : 'text-orange-700'}`}>OTHER COUNTRIES</label>
                                        </div>
                                        <p className={`text-xs mb-3 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                            Rest of World → All other countries not in Tier 1
                                        </p>
                                        <select
                                            value={tier2Network}
                                            onChange={(e) => setTier2Network(e.target.value)}
                                            className={`w-full appearance-none rounded-xl border px-4 py-3 text-sm font-medium outline-none transition-all cursor-pointer ${isDark
                                                ? 'glass-input text-white focus:border-orange-500'
                                                : 'bg-white border-gray-200 text-gray-900 focus:border-orange-500'
                                                }`}
                                        >
                                            {networkOptions.map((network) => (
                                                <option key={network} value={network} className="text-black">{network}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Domain & Number of Links */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="space-y-3">
                                        <label className={`text-xs font-bold tracking-wider uppercase pl-1 ${isDark ? 'text-slate-300' : 'text-gray-400'}`}>Domain</label>
                                        <select
                                            value={selectedDomain}
                                            onChange={(e) => setSelectedDomain(e.target.value)}
                                            className={`w-full appearance-none rounded-xl border px-5 py-4 text-sm font-medium outline-none transition-all cursor-pointer ${isDark
                                                ? 'glass-input text-white focus:border-indigo-500'
                                                : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-500'
                                                }`}
                                        >
                                            <option value="random" className="text-black">Random Domain</option>
                                            {domains.map(domain => (
                                                <option key={domain.dbId} value={domain.title} className="text-black">
                                                    {domain.title} {domain.status !== 'Active' ? `(${domain.status})` : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-3">
                                        <label className={`text-xs font-bold tracking-wider uppercase pl-1 ${isDark ? 'text-slate-300' : 'text-gray-400'}`}>Number of Links</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="100"
                                            value={numberOfLinks}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value) || 1;
                                                setNumberOfLinks(Math.min(100, Math.max(1, val)));
                                            }}
                                            className={`w-full rounded-xl border px-5 py-4 text-sm font-medium outline-none transition-all ${isDark
                                                ? 'glass-input text-white focus:border-indigo-500'
                                                : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-500'
                                                }`}
                                            placeholder="1"
                                        />
                                    </div>
                                </div>

                                {/* Generate Button */}
                                <button
                                    onClick={handleGenerate}
                                    disabled={isLoading}
                                    className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-base transition-all ${isLoading
                                        ? 'opacity-70 cursor-not-allowed'
                                        : 'hover:opacity-90 shadow-lg shadow-indigo-500/30 transform active:scale-[0.99]'
                                        } bg-gradient-to-r from-green-500 to-emerald-600 text-white`}
                                >
                                    {isLoading ? (
                                        <span className="material-symbols-outlined animate-spin text-[24px]">progress_activity</span>
                                    ) : (
                                        <span className="material-symbols-outlined text-[24px]">public</span>
                                    )}
                                    {isLoading ? 'Generating...' : 'Generate Geo Redirect Links'}
                                </button>

                                {/* Generated Results */}
                                {generatedUrls.length > 0 && (
                                    <div className={`mt-8 rounded-xl border transition-colors ${isDark ? 'glass-card border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                        <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-green-500 text-[20px]">check_circle</span>
                                                <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    Generated Geo Links ({generatedUrls.length})
                                                </h3>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(generatedUrls.map(r => r.url).join('\n'));
                                                        alert(`${generatedUrls.length} links copied!`);
                                                    }}
                                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${isDark
                                                        ? 'bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30'
                                                        : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                                                        }`}
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                                                    Copy All
                                                </button>
                                                <button
                                                    onClick={() => setGeneratedUrls([])}
                                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${isDark
                                                        ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                                                        : 'bg-red-100 text-red-600 hover:bg-red-200'
                                                        }`}
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">close</span>
                                                    Clear
                                                </button>
                                            </div>
                                        </div>
                                        <div className="max-h-[300px] overflow-y-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className={`border-b ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'}`}>
                                                        <th className={`px-4 py-3 text-left text-xs font-bold uppercase ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>#</th>
                                                        <th className={`px-4 py-3 text-left text-xs font-bold uppercase ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Geo Link</th>
                                                        <th className={`px-4 py-3 text-left text-xs font-bold uppercase ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Tier 1</th>
                                                        <th className={`px-4 py-3 text-left text-xs font-bold uppercase ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Other</th>
                                                        <th className={`px-4 py-3 text-right text-xs font-bold uppercase ${isDark ? 'text-slate-400' : 'text-gray-500'}`}></th>
                                                    </tr>
                                                </thead>
                                                <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-gray-100'}`}>
                                                    {generatedUrls.map((result, idx) => (
                                                        <tr key={idx} className={`group transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}>
                                                            <td className={`px-4 py-3 text-xs font-medium ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                                                {idx + 1}
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <a
                                                                    href={result.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className={`text-sm font-medium hover:underline ${isDark ? 'text-green-400' : 'text-green-600'}`}
                                                                >
                                                                    {result.url}
                                                                </a>
                                                            </td>
                                                            <td className={`px-4 py-3 text-xs ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                                                                {result.tier1}
                                                            </td>
                                                            <td className={`px-4 py-3 text-xs ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                                                                {result.tier2}
                                                            </td>
                                                            <td className="px-4 py-3 text-right">
                                                                <button
                                                                    onClick={() => navigator.clipboard.writeText(result.url)}
                                                                    className={`opacity-0 group-hover:opacity-100 p-1.5 rounded transition-all ${isDark
                                                                        ? 'text-slate-400 hover:text-white hover:bg-white/10'
                                                                        : 'text-gray-400 hover:text-gray-900 hover:bg-gray-200'
                                                                        }`}
                                                                    title="Copy Link"
                                                                >
                                                                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
