import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import { useTheme } from '../context/ThemeContext';
import GeneratorNavigation from '../components/GeneratorNavigation';
import LiveTraffic from '../components/LiveTraffic';
import { supabase } from '../lib/supabaseClient';

export default function Generator() {
    const { trackerId } = useParams();
    const { isDark, toggleTheme } = useTheme();
    const [selectedNetwork, setSelectedNetwork] = useState('iMonetizeit');
    const [campaigns, setCampaigns] = useState([]);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDomain, setSelectedDomain] = useState('random');
    const [generatedUrl, setGeneratedUrl] = useState('');
    const [generatedUrls, setGeneratedUrls] = useState([]); // For multiple links
    const [numberOfLinks, setNumberOfLinks] = useState(1);
    const [branchKey, setBranchKey] = useState('');
    const [branchEnabled, setBranchEnabled] = useState(false);
    const [useLandingPage, setUseLandingPage] = useState(false);

    // Anti-Spam (Safe Page) State
    const [ogTitle, setOgTitle] = useState('');
    const [ogDescription, setOgDescription] = useState('');
    const [ogImage, setOgImage] = useState('');

    const [domains, setDomains] = useState([]);

    // Fetch campaigns and domains from Supabase
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Campaigns
                const { data: campaignsData, error: campaignsError } = await supabase
                    .from('campaign')
                    .select('*')
                    .order('createdAt', { ascending: false });

                if (campaignsError) throw campaignsError;
                setCampaigns(campaignsData || []);

                // Fetch Domains
                const { data: domainsData, error: domainsError } = await supabase
                    .from('domain')
                    .select('*')
                    .order('addedAt', { ascending: false });

                if (domainsError) throw domainsError;
                // Add title property for compatibility with existing code if needed, 
                // but schema has 'name'. Let's map name to title if component uses title.
                // Looking at original code: finalDomain = activeDomains[randomIdx].title;
                // So the domain object needs a 'title' property.
                // In Supabase schema it is 'name'.
                const formattedDomains = (domainsData || []).map(d => ({
                    ...d,
                    title: d.name // Map name to title
                }));
                setDomains(formattedDomains);

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Auto-select campaign based on selected network
    useEffect(() => {
        if (campaigns.length > 0 && selectedNetwork) {
            const matched = campaigns.find(c =>
                c.network && c.network.toLowerCase() === selectedNetwork.toLowerCase()
            );
            setSelectedCampaign(matched || null);
        }
    }, [campaigns, selectedNetwork]);

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
        if (!selectedCampaign) {
            alert('No campaign found for this network. Please create one first.');
            return;
        }

        if (!selectedDomain || selectedDomain === 'Select Global Domain...' || selectedDomain === 'Select Custom Domain...') {
            alert('Please select a domain first.');
            return;
        }

        setIsLoading(true);
        setGeneratedUrls([]); // Clear previous results
        setGeneratedUrl('');

        const newLinksPayload = [];
        const newGeneratedUrls = [];

        try {
            for (let i = 0; i < numberOfLinks; i++) {
                // Generate Unique Click ID (Slug)
                const clickId = generateClickId();

                // Prepare Payload for Backend
                let resolvedTargetUrl = selectedCampaign.offerName; // Note: using offerName as targetUrl base? 
                // Original code: resolvedTargetUrl = selectedCampaign.offerName;
                // Wait, campaign table has "offerName" and "urlTemplate". 
                // Usually target URL comes from template? 
                // But original code used offerName. I will stick to original logic.
                resolvedTargetUrl = resolvedTargetUrl.replace('{sub_id}', trackerId);

                // Resolve Domain (Handle Random)
                let finalDomain = selectedDomain;
                if (selectedDomain === 'random') {
                    const activeDomains = domains.filter(d => d.status === 'Active');
                    if (activeDomains.length > 0) {
                        const randomIdx = Math.floor(Math.random() * activeDomains.length);
                        finalDomain = activeDomains[randomIdx].title;
                    } else {
                        alert('No active domains available for random selection.');
                        setIsLoading(false);
                        return;
                    }
                }

                newLinksPayload.push({
                    slug: clickId,
                    "targetUrl": resolvedTargetUrl,
                    domain: finalDomain,
                    "trackerId": trackerId,
                    network: selectedNetwork,
                    // branchKey: branchEnabled && branchKey ? branchKey : null, // Omitted as not in schema
                    "useLandingPage": useLandingPage,
                    "ogTitle": ogTitle,
                    "ogDescription": ogDescription,
                    "ogImage": ogImage
                });

                newGeneratedUrls.push(`https://${finalDomain}/${clickId}`);
            }

            // Bulk Insert into Supabase
            const { error } = await supabase
                .from('link')
                .insert(newLinksPayload);

            if (error) throw error;

            setGeneratedUrls(newGeneratedUrls);

            // If only 1 link, also set single URL for backwards compatibility
            if (newGeneratedUrls.length === 1) {
                setGeneratedUrl(newGeneratedUrls[0]);
            }

            // Auto-Copy all links to Clipboard
            const allLinksText = newGeneratedUrls.join('\n');
            navigator.clipboard.writeText(allLinksText).catch(err => console.error('Failed to copy:', err));

        } catch (error) {
            console.error('Error generating link:', error);
            alert('Failed to generate link. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`font-display flex flex-col min-h-screen overflow-y-auto transition-colors ${isDark ? 'bg-transparent text-white' : 'bg-gray-50 text-gray-900'}`}>

            <main className="flex-1 w-full max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 pb-10 pt-4 md:pt-16 relative z-10">
                <div className="w-full space-y-8">

                    {/* Main Interaction Area */}
                    <div className="space-y-8">

                        {/* Generator Hub Card */}
                        <div className={`relative overflow-hidden rounded-[2rem] border transition-all duration-500 ${isDark
                            ? 'glass-panel border-white/20 shadow-2xl shadow-purple-900/20'
                            : 'bg-white border-gray-300 shadow-xl shadow-gray-200/50'
                            }`}>

                            <div className="p-4 md:p-10 relative">

                                {/* Logo Banner */}
                                <div className="mb-4 md:mb-8 rounded-2xl overflow-hidden shadow-lg">
                                    <img
                                        src="/logo.png"
                                        alt="Banner"
                                        className="w-full h-auto object-cover"
                                    />
                                </div>

                                {/* Navigation & Tracker ID */}
                                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
                                    <GeneratorNavigation />

                                    <div className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl border ${isDark
                                        ? 'bg-[#16172b] border-[#323367] text-indigo-300'
                                        : 'bg-indigo-50 border-indigo-100 text-indigo-600'
                                        }`}>
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        <span className="text-sm font-semibold tracking-wide uppercase">Tracker: {trackerId}</span>
                                    </div>
                                </div>

                                {/* Section 2: Network Selection */}
                                <div className="mb-10">
                                    <label className={`block text-xs font-bold tracking-wider uppercase mb-4 pl-1 ${isDark ? 'text-slate-300' : 'text-gray-400'}`}>
                                        Select Network
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {['iMonetizeit', 'Lospollos', 'Clickdealer', 'Trafee'].map((network) => (
                                            <button
                                                key={network}
                                                onClick={() => setSelectedNetwork(network)}
                                                className={`group relative py-3 px-2 rounded-xl transition-all duration-300 overflow-hidden ${selectedNetwork === network
                                                    ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-transparent'
                                                    : 'hover:bg-white/10'
                                                    } ${isDark ? 'glass-card' : 'bg-gray-50 border border-transparent'}`}
                                            >
                                                {selectedNetwork === network && (
                                                    <div className="absolute inset-0 bg-indigo-500/20"></div>
                                                )}
                                                <span className={`relative text-sm font-semibold transition-colors ${selectedNetwork === network
                                                    ? 'text-indigo-300'
                                                    : isDark ? 'text-slate-300' : 'text-gray-600'
                                                    }`}>
                                                    {network}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Section 3: Configuration Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-10">

                                    {/* Domain Select */}
                                    <div className="space-y-3">
                                        <label className={`text-xs font-bold tracking-wider uppercase pl-1 ${isDark ? 'text-slate-300' : 'text-gray-400'}`}>Domain</label>
                                        <div className="relative group">
                                            <select
                                                className={`w-full appearance-none rounded-xl border px-5 py-4 pr-12 text-sm font-medium outline-none transition-all duration-300 cursor-pointer ${isDark
                                                    ? 'glass-input text-white focus:border-indigo-500'
                                                    : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-500 focus:bg-white'
                                                    }`}
                                                value={selectedDomain}
                                                onChange={(e) => setSelectedDomain(e.target.value)}
                                            >
                                                <option value="" className="text-black">Select Domain...</option>
                                                <option value="random" className="text-black">Random Domain</option>
                                                {domains.map(domain => (
                                                    <option key={domain.dbId} value={domain.title} className="text-black">
                                                        {domain.title} {domain.status !== 'Active' ? `(${domain.status})` : ''}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors">
                                                <span className="material-symbols-outlined">expand_more</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Number of Links */}
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
                                            className={`w-full rounded-xl border px-5 py-4 text-sm font-medium outline-none transition-all duration-300 ${isDark
                                                ? 'glass-input text-white focus:border-indigo-500'
                                                : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-500 focus:bg-white'
                                                }`}
                                            placeholder="1"
                                        />
                                    </div>
                                </div>

                                {/* Section 4: Advanced Params */}
                                <div className={`rounded-xl p-5 mb-10 transition-colors ${isDark ? 'glass-card' : 'bg-gray-50'}`}>
                                    <div className="flex items-center gap-2 mb-6">
                                        <span className="material-symbols-outlined text-indigo-500 text-[20px]">tune</span>
                                        <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Advanced Parameters</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label className={`block text-xs font-bold tracking-wider uppercase mb-2 ${isDark ? 'text-slate-300' : 'text-gray-400'}`}>Canonical URL</label>
                                            <input
                                                type="text"
                                                placeholder="{canonical_URL}"
                                                className={`w-full px-4 py-3 rounded-lg border-none text-sm font-medium transition-all ${isDark ? 'glass-input text-white placeholder-slate-400' : 'bg-white text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-gray-200'
                                                    }`}
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-bold tracking-wider uppercase mb-2 ${isDark ? 'text-slate-300' : 'text-gray-400'}`}>Branch Key</label>
                                            <input
                                                type="text"
                                                value={branchKey}
                                                onChange={(e) => setBranchKey(e.target.value)}
                                                placeholder="e.g. key_live_..."
                                                className={`w-full px-4 py-3 rounded-lg border-none text-sm font-medium transition-all ${isDark ? 'glass-input text-white placeholder-slate-400' : 'bg-white text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-gray-200'
                                                    }`}
                                            />
                                        </div>
                                    </div>

                                    {/* Anti-Spam / Safe Page Section */}
                                    <div className={`p-4 rounded-xl border ${isDark ? 'border-white/5 bg-white/5' : 'border-gray-100 bg-gray-50'}`}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="md:col-span-2">
                                                <label className={`block text-xs font-bold tracking-wider uppercase mb-2 ${isDark ? 'text-slate-300' : 'text-gray-400'}`}>OG Title (Safe Title)</label>
                                                <input
                                                    type="text"
                                                    value={ogTitle}
                                                    onChange={(e) => setOgTitle(e.target.value)}
                                                    placeholder="e.g. Viral Video 2024"
                                                    className={`w-full px-4 py-3 rounded-lg border-none text-sm font-medium transition-all ${isDark ? 'glass-input text-white placeholder-slate-400' : 'bg-white text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-gray-200'}`}
                                                />
                                            </div>
                                            <div>
                                                <label className={`block text-xs font-bold tracking-wider uppercase mb-2 ${isDark ? 'text-slate-300' : 'text-gray-400'}`}>OG Description</label>
                                                <input
                                                    type="text"
                                                    value={ogDescription}
                                                    onChange={(e) => setOgDescription(e.target.value)}
                                                    placeholder="e.g. Watch full video here..."
                                                    className={`w-full px-4 py-3 rounded-lg border-none text-sm font-medium transition-all ${isDark ? 'glass-input text-white placeholder-slate-400' : 'bg-white text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-gray-200'}`}
                                                />
                                            </div>
                                            <div>
                                                <label className={`block text-xs font-bold tracking-wider uppercase mb-2 ${isDark ? 'text-slate-300' : 'text-gray-400'}`}>OG Image URL</label>
                                                <input
                                                    type="text"
                                                    value={ogImage}
                                                    onChange={(e) => setOgImage(e.target.value)}
                                                    placeholder="https://example.com/image.jpg"
                                                    className={`w-full px-4 py-3 rounded-lg border-none text-sm font-medium transition-all ${isDark ? 'glass-input text-white placeholder-slate-400' : 'bg-white text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-gray-200'}`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Bar - Form Style */}
                                <div className={`flex flex-col md:flex-row items-stretch md:items-center gap-2 p-2 rounded-xl border ${isDark
                                    ? 'glass-card border-white/10'
                                    : 'bg-gray-50 border-gray-200'
                                    }`}>

                                    {/* Link Input Group */}
                                    <div className="flex items-center gap-2 flex-grow w-full md:w-auto">
                                        <div className={`flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0 ${isDark ? 'bg-white/10 text-indigo-400' : 'bg-white text-indigo-500'}`}>
                                            <span className="material-symbols-outlined text-[20px]">link</span>
                                        </div>
                                        <input
                                            type="text"
                                            value={generatedUrls.length > 1 ? `${generatedUrls.length} links generated (click to copy all)` : generatedUrl}
                                            readOnly
                                            placeholder="{shorturl}"
                                            onClick={() => {
                                                if (generatedUrls.length > 0) {
                                                    navigator.clipboard.writeText(generatedUrls.join('\n'));
                                                    alert(`${generatedUrls.length} link(s) copied to clipboard!`);
                                                }
                                            }}
                                            className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium border-none outline-none cursor-pointer ${isDark
                                                ? 'bg-transparent text-white placeholder-slate-400'
                                                : 'bg-transparent text-gray-900 placeholder-gray-400'
                                                } ${generatedUrls.length > 0 ? 'text-green-400' : ''}`}
                                        />
                                    </div>

                                    {/* Action Group (Dropdowns + Button) */}
                                    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                                        {/* Branch Dropdown */}
                                        <select
                                            value={branchEnabled ? 'on' : 'off'}
                                            onChange={(e) => setBranchEnabled(e.target.value === 'on')}
                                            className={`w-full sm:w-auto px-3 py-2.5 rounded-lg text-sm font-medium border outline-none cursor-pointer ${isDark
                                                ? 'glass-input text-white'
                                                : 'bg-white border-gray-200 text-gray-900'
                                                }`}>
                                            <option value="off" className="text-black">Branch OFF</option>
                                            <option value="on" className="text-black">Branch ON</option>
                                        </select>

                                        {/* Landing Page Dropdown */}
                                        <select
                                            value={useLandingPage ? 'landing' : 'no-landing'}
                                            onChange={(e) => setUseLandingPage(e.target.value === 'landing')}
                                            className={`w-full sm:w-auto px-3 py-2.5 rounded-lg text-sm font-medium border outline-none cursor-pointer ${isDark
                                                ? 'glass-input text-white'
                                                : 'bg-white border-gray-200 text-gray-900'
                                                }`}>
                                            <option value="no-landing" className="text-black">No Landing Page</option>
                                            <option value="landing" className="text-black">Landing Page</option>
                                        </select>

                                        {/* Short URL Button */}
                                        <button
                                            onClick={handleGenerate}
                                            disabled={isLoading}
                                            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${isLoading
                                                ? 'opacity-70 cursor-not-allowed'
                                                : 'hover:opacity-90 shadow-lg shadow-indigo-500/30'
                                                } ${isDark
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-indigo-600 text-white'
                                                }`}
                                        >
                                            <span className="material-symbols-outlined text-[18px]">content_copy</span>
                                            {isLoading ? 'Processing...' : 'Generate'}
                                        </button>
                                    </div>

                                </div>
                            </div>

                            {/* Generated Links Section - Only show when multiple links generated */}
                            {generatedUrls.length > 1 && (
                                <div className={`mx-4 md:mx-10 mb-6 md:mb-10 rounded-xl border transition-colors ${isDark ? 'glass-card border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                    <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-indigo-500 text-[20px]">link</span>
                                            <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                Generated Links ({generatedUrls.length})
                                            </h3>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(generatedUrls.join('\n'));
                                                    alert(`${generatedUrls.length} links copied to clipboard!`);
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
                                            <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-gray-100'}`}>
                                                {generatedUrls.map((url, idx) => (
                                                    <tr key={idx} className={`group transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}>
                                                        <td className={`px-4 py-3 text-xs font-medium w-10 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                                                            {idx + 1}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <a
                                                                href={url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className={`text-sm font-medium hover:underline truncate block max-w-[400px] ${isDark ? 'text-green-400' : 'text-green-600'}`}
                                                            >
                                                                {url}
                                                            </a>
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            <button
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText(url);
                                                                }}
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
            </main>
        </div>
    );
}
