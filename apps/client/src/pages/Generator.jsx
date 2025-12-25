import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import { useTheme } from '../context/ThemeContext';
import GeneratorNavigation from '../components/GeneratorNavigation';
import LiveTraffic from '../components/LiveTraffic';

export default function Generator() {
    const { trackerId } = useParams();
    const { isDark, toggleTheme } = useTheme();
    const [selectedNetwork, setSelectedNetwork] = useState('iMonetizeit');
    const [campaigns, setCampaigns] = useState([]);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDomain, setSelectedDomain] = useState('');
    const [generatedUrl, setGeneratedUrl] = useState('');

    const [domains, setDomains] = useState([]);

    // Fetch campaigns and domains from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Campaigns
                const campaignsRes = await fetch('http://localhost:3000/api/campaigns');
                if (campaignsRes.ok) {
                    const data = await campaignsRes.json();
                    setCampaigns(data);
                }

                // Fetch Domains
                const domainsRes = await fetch('http://localhost:3000/api/addon-domains');
                if (domainsRes.ok) {
                    const data = await domainsRes.json();
                    if (Array.isArray(data)) {
                        setDomains(data);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filter campaigns by selected network
    const filteredCampaigns = campaigns.filter(c => c.network === selectedNetwork);

    // When network changes, auto-select first campaign for that network
    useEffect(() => {
        const networkCampaigns = campaigns.filter(c => c.network === selectedNetwork);
        if (networkCampaigns.length > 0) {
            setSelectedCampaign(networkCampaigns[0]);
        } else {
            setSelectedCampaign(null);
        }
        setGeneratedUrl(''); // Clear generated URL when network changes
    }, [selectedNetwork, campaigns]);

    // Helper to generate random Click ID (simulating the example format)
    const generateClickId = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        // Generating a 32-char random string similar to the user's example
        for (let i = 0; i < 32; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const handleGenerate = async () => {
        if (!selectedCampaign) {
            alert('No campaign found for this network. Please create one first.');
            return;
        }

        if (!selectedDomain || selectedDomain === 'Select Global Domain...' || selectedDomain === 'Select Custom Domain...') {
            alert('Please select a domain first.');
            return;
        }

        setIsLoading(true);

        try {
            // Generate Unique Click ID (Slug)
            const clickId = generateClickId();

            // Prepare Payload for Backend
            // Use offerName as the Target URL (User pastes the real smartlink here)
            // Inject sub_id (Tracker Name) here as it is static for this link.
            let resolvedTargetUrl = selectedCampaign.offerName;

            // Safety check: if offerName is not a URL, fallback to template or warn?
            // User instruction is strict: "smartlink asli dimasukan ke form offer name".
            // So we assume offerName IS the URL.

            resolvedTargetUrl = resolvedTargetUrl.replace('{sub_id}', trackerId);

            const payload = {
                slug: clickId,
                targetUrl: resolvedTargetUrl,
                domain: selectedDomain,
                trackerId: trackerId,
                network: selectedNetwork
            };

            // Call API to save the link
            const response = await fetch('http://localhost:3000/api/links', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to save link');
            }

            // Construct Short Tracker Link for Display
            const shortUrl = `https://${selectedDomain}/${clickId}`;
            setGeneratedUrl(shortUrl);

        } catch (error) {
            console.error('Error generating link:', error);
            alert('Failed to generate link. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`font-display flex flex-col min-h-screen overflow-y-auto transition-colors ${isDark ? 'bg-background-dark text-white' : 'bg-gray-50 text-gray-900'}`}>
            <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors ${isDark ? 'bg-[#15162e]/90 border-[#323367]' : 'bg-white/90 border-gray-200'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 relative">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                                <span className="material-symbols-outlined text-white text-[20px]">link</span>
                            </div>
                            <span className={`font-bold text-lg tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>CPA LinkGen</span>
                        </div>
                        <button onClick={toggleTheme} className={`transition-colors ${isDark ? 'text-[#9293c9] hover:text-white' : 'text-gray-500 hover:text-gray-900'}`} title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
                            <span className="material-symbols-outlined">{isDark ? 'light_mode' : 'dark_mode'}</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="layout-container flex flex-col flex-1">
                <GeneratorNavigation />


                <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-5 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Generator Card */}
                        <div className={`lg:col-span-2 rounded-3xl shadow-xl border p-8 transition-all hover:shadow-2xl ${isDark ? 'bg-[#1e1e2d] border-[#2d2d42] shadow-black/30 ring-1 ring-white/5' : 'bg-white border-gray-100 shadow-gray-200/50 ring-1 ring-gray-100'}`}>

                            {/* Header: Domain Config & User Badge */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                                <div>
                                    <h2 className={`text-xs font-bold tracking-wider uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                        Domain Configuration
                                    </h2>
                                </div>
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-xl blur opacity-60 group-hover:opacity-100 animate-pulse" style={{ animation: 'rgb-rotate 3s linear infinite' }}></div>
                                    <div className={`relative flex items-center gap-2 px-4 py-2 rounded-xl border ${isDark ? 'bg-[#16172b] border-transparent text-slate-300' : 'bg-white border-transparent text-gray-700'}`}>
                                        <span className="material-symbols-outlined text-[18px]">person</span>
                                        <span className="font-medium text-sm">{trackerId}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Domain Selection Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                {/* Global Domain */}
                                <div className="relative group">
                                    <select
                                        className={`w-full appearance-none rounded-xl border-none px-4 py-3.5 pr-10 text-sm font-medium transition-all cursor-pointer outline-none ${isDark
                                            ? 'bg-[#16172b] text-white shadow-lg shadow-black/20 hover:bg-[#1a1b32]'
                                            : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                                            }`}
                                        value={selectedDomain}
                                        onChange={(e) => setSelectedDomain(e.target.value)}
                                    >
                                        <option value="">Select Domain...</option>
                                        {domains
                                            .map(domain => (
                                                <option key={domain.dbId} value={domain.title}>
                                                    {domain.title} {domain.status !== 'Active' ? `(${domain.status})` : ''} {domain.group !== 'Global Domain' ? `[${domain.group}]` : ''}
                                                </option>
                                            ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                                        <span className="material-symbols-outlined text-[20px]">expand_more</span>
                                    </div>
                                </div>

                                {/* Custom Domain */}
                                <div className="relative group">
                                    <select className={`w-full appearance-none rounded-xl border-none px-4 py-3.5 pr-10 text-sm font-medium transition-all cursor-pointer outline-none ${isDark
                                        ? 'bg-[#16172b] text-white shadow-lg shadow-black/20 hover:bg-[#1a1b32]'
                                        : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                                        }`}>
                                        <option>Select Custom Domain...</option>
                                        <option>None</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                                        <span className="material-symbols-outlined text-[20px]">expand_more</span>
                                    </div>
                                </div>
                            </div>

                            {/* Affiliate Network Selection */}
                            <div className="mb-8 text-center">
                                <h2 className={`text-xs font-bold tracking-wider uppercase mb-4 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                    Affiliate Network
                                </h2>
                                <div className="flex flex-wrap gap-3 justify-center">
                                    {['iMonetizeit', 'Lospollos', 'Clickdealer', 'Trafee'].map((network) => (
                                        <button
                                            key={network}
                                            onClick={() => setSelectedNetwork(network)}
                                            className={`px-6 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all transform active:scale-95 ${selectedNetwork === network
                                                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                                : isDark
                                                    ? 'bg-[#16172b] text-slate-400 hover:bg-[#1a1b32] hover:text-white'
                                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                                }`}
                                        >
                                            {network}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Canonical URL Input */}
                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className={`text-xs font-bold tracking-wider uppercase ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                        Canonical URL
                                    </h2>
                                    <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>The destination offer URL</span>
                                </div>

                                <div className={`flex items-center rounded-xl overflow-hidden transition-all focus-within:ring-2 focus-within:ring-primary ${isDark ? 'bg-[#16172b]' : 'bg-gray-50'
                                    }`}>
                                    <div className="pl-4 pr-3 text-slate-500">
                                        <span className="material-symbols-outlined text-[20px]">link</span>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="{canonical_URL}"
                                        className={`w-full py-3.5 bg-transparent border-none outline-none text-sm font-medium ${isDark ? 'text-white placeholder-slate-600' : 'text-gray-900 placeholder-gray-400'
                                            }`}
                                    />
                                </div>
                            </div>

                            {/* Advanced Params Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                {/* Branch Key */}
                                <div className="flex flex-col gap-2">
                                    <h2 className={`text-xs font-bold tracking-wider uppercase ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                        Branch Key
                                    </h2>
                                    <input
                                        type="text"
                                        placeholder="e.g. key_live_ka9..."
                                        className={`w-full px-4 py-3 rounded-xl border-none outline-none text-sm transition-all focus:ring-2 focus:ring-primary ${isDark
                                            ? 'bg-[#16172b] text-white placeholder-slate-600'
                                            : 'bg-gray-50 text-gray-900 placeholder-gray-400'
                                            }`}
                                    />
                                </div>

                                {/* Branch Off */}
                                <div className="flex flex-col gap-2">
                                    <h2 className={`text-xs font-bold tracking-wider uppercase ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                        Branch Off
                                    </h2>
                                    <div className="relative">
                                        <select className={`w-full appearance-none rounded-xl border-none px-4 py-3 pr-10 text-sm font-medium transition-all cursor-pointer outline-none ${isDark
                                            ? 'bg-[#16172b] text-white'
                                            : 'bg-gray-50 text-gray-900'
                                            }`}>
                                            <option>Enabled</option>
                                            <option>Disabled</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                                            <span className="material-symbols-outlined text-[20px]">expand_more</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Domain Shortener */}
                                <div className="flex flex-col gap-2">
                                    <h2 className={`text-xs font-bold tracking-wider uppercase ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                        Domain Shortener
                                    </h2>
                                    <div className="relative">
                                        <select className={`w-full appearance-none rounded-xl border-none px-4 py-3 pr-10 text-sm font-medium transition-all cursor-pointer outline-none ${isDark
                                            ? 'bg-[#16172b] text-white'
                                            : 'bg-gray-50 text-gray-900'
                                            }`}>
                                            <option>None (Direct)</option>
                                            <option>Bit.ly</option>
                                            <option>TinyURL</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                                            <span className="material-symbols-outlined text-[20px]">expand_more</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Generate Button */}
                            <button
                                onClick={handleGenerate}
                                className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl shadow-xl shadow-primary/25 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.98]"
                            >
                                <span className="material-symbols-outlined">bolt</span>
                                GENERATE URL
                            </button>

                            {/* Results */}
                            <div className="mt-8">
                                <h2 className={`text-xs font-bold tracking-wider uppercase mb-2 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                    Generated Short URL
                                </h2>
                                <div className={`h-16 rounded-xl border-2 border-dashed flex items-center justify-center relative group overflow-hidden ${isDark ? 'border-[#2d2d42] bg-[#16172b]/50' : 'border-gray-200 bg-gray-50'
                                    }`}>
                                    {generatedUrl ? (
                                        <div className="flex items-center gap-3 w-full px-6">
                                            <span className="material-symbols-outlined text-primary text-xl flex-shrink-0">link</span>
                                            <span className={`text-sm font-mono truncate flex-grow ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                {generatedUrl}
                                            </span>
                                            <button
                                                onClick={() => navigator.clipboard.writeText(generatedUrl)}
                                                className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                                title="Copy to clipboard"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">content_copy</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="material-symbols-outlined text-3xl text-primary/50">qr_code_2</span>
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* Right Siderbar for Live Traffic */}
                        <div className="flex flex-col gap-6">
                            <LiveTraffic />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
