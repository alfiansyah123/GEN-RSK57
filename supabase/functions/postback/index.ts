import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Country Code Mapping (ISO Alpha-3 to Alpha-2 and common typos)
const COUNTRY_MAPPING = {
    'USA': 'US', 'UK': 'GB', 'UN': 'US', 'EN': 'GB', 'GREAT BRITAIN': 'GB',
    'UKR': 'UA', 'UKRAINE': 'UA', 'RUS': 'RU', 'RUSSIA': 'RU',
    'VNM': 'VN', 'VIETNAM': 'VN', 'IDN': 'ID', 'INDONESIA': 'ID',
    'BRA': 'BR', 'BRAZIL': 'BR', 'THA': 'TH', 'THAILAND': 'TH',
    'DEU': 'DE', 'GERMANY': 'DE', 'FRA': 'FR', 'FRANCE': 'FR',
    'ESP': 'ES', 'SPAIN': 'ES', 'ITA': 'IT', 'ITALY': 'IT',
    'NLD': 'NL', 'HOLLAND': 'NL', 'NETHERLANDS': 'NL',
    'SGP': 'SG', 'SINGAPORE': 'SG', 'MYS': 'MY', 'MALAYSIA': 'MY',
    'PHL': 'PH', 'PHILIPPINES': 'PH', 'KOR': 'KR', 'SOUTH KOREA': 'KR',
    'JPN': 'JP', 'JAPAN': 'JP', 'CHN': 'CN', 'CHINA': 'CN',
    'IND': 'IN', 'INDIA': 'IN', 'CAN': 'CA', 'CANADA': 'CA',
    'AUS': 'AU', 'AUSTRALIA': 'AU', 'MEX': 'MX', 'MEXICO': 'MX',
    'ARG': 'AR', 'ARGENTINA': 'AR', 'COL': 'CO', 'COLOMBIA': 'CO',
    'ZAF': 'ZA', 'SOUTH AFRICA': 'ZA', 'EGY': 'EG', 'EGYPT': 'EG',
    'SAU': 'SA', 'SAUDI ARABIA': 'SA', 'ARE': 'AE', 'UAE': 'AE',
    'TUR': 'TR', 'TURKEY': 'TR', 'PAK': 'PK', 'PAKISTAN': 'PK',
    'NGA': 'NG', 'NIGERIA': 'NG', 'KEN': 'KE', 'KENYA': 'KE',
    'GHA': 'GH', 'GHANA': 'GH', 'MAR': 'MA', 'MOROCCO': 'MA',
    'DZA': 'DZ', 'ALGERIA': 'DZ', 'TUN': 'TN', 'TUNISIA': 'TN',
    'PER': 'PE', 'PERU': 'PE', 'CHL': 'CL', 'CHILE': 'CL',
    'VEN': 'VE', 'VENEZUELA': 'VE', 'ECU': 'EC', 'ECUADOR': 'EC',
    'DOM': 'DO', 'DOMINICAN REPUBLIC': 'DO', 'CUB': 'CU', 'CUBA': 'CU',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const url = new URL(req.url)
        const params = Object.fromEntries(url.searchParams.entries())

        // 1. Initialize Supabase Client
        // Must use Service Role Key to bypass RLS for inserts/upserts
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        const supabase = createClient(supabaseUrl, supabaseKey)

        // 2. Extract & Normalize Parameters
        const clickId = params.clickid || params.click_id || params.cid || null
        const payout = parseFloat(params.payout || params.sum || '0.00')
        // Map 'os' to traffic_type for backward compatibility, and truncate to 5 chars (WEB/WAP)
        let rawTraffic = params.traffic || params.traffic_type || params.os || 'WEB'
        const trafficType = rawTraffic.toUpperCase().substring(0, 5)

        // Smartlink/SubID logic 
        let subId = (params.smartlink || params.subid || params.sub_id || params.subsource || params.tracker || params.campaign || '').trim()
        if (!subId || subId === '' || subId === 'NULL') subId = 'UNKNOWN'
        
        let network = (params.network || params.source || params.net || '').trim()
        if (!network || network === '' || network === 'NULL') network = 'UNKNOWN'

        // Click ID / SubID fallback logic
        if (!clickId && subId === 'UNKNOWN') {
            return new Response(JSON.stringify({ error: 'Missing clickid or smartlink' }), {
                status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
        }

        // If clickId is missing, generate one or use subId
        const finalClickId = clickId || subId || `gen-${crypto.randomUUID()}`

        // IP Address
        let ip = params.ip || params.user_ip || params.uip || req.headers.get('x-forwarded-for') || '0.0.0.0'
        if (ip.includes(',')) ip = ip.split(',')[0].trim()

        // User Agent
        const userAgent = params.ua || params.user_agent || req.headers.get('user-agent') || ''

        // Country Logic
        let countryParam = (params.country || params.geo || params.cc || 'XX').toUpperCase()
        let countryCode = COUNTRY_MAPPING[countryParam] || (countryParam.length === 2 ? countryParam : 'XX')

        // GeoIP Fallback
        if (countryCode === 'XX' && ip !== '0.0.0.0') {
            try {
                const geoResp = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`)
                const geoData = await geoResp.json()
                if (geoData && geoData.countryCode) {
                    countryCode = geoData.countryCode
                }
            } catch (e) {
                console.error('GeoIP lookup failed:', e)
            }
        }

        // 2.2 Optional: Fetch Metadata from 'clicks' table if clickId is provided
        let detectedOs = trafficType
        let detectedBrowser = 'Unknown'
        let friendlyName = subId
        let finalNetwork = network
        let finalIp = ip
        let finalUA = userAgent
        let finalCountry = countryCode

        if (clickId) {
            const { data: clickData } = await supabase
                .from('clicks')
                .select('os, browser, tracker_name, s3, ip_address, user_agent, country')
                .or(`click_id.eq.${clickId},slug.eq.${clickId}`)
                .order('created_at', { ascending: false })
                .limit(1)

            const clickMeta = clickData && clickData.length > 0 ? clickData[0] : null

            if (clickMeta) {
                detectedOs = clickMeta.os || detectedOs
                detectedBrowser = clickMeta.browser || detectedBrowser
                // HANYA timpa jika data dari DB valid dan bukan 'UNKNOWN'
                if (clickMeta.tracker_name && clickMeta.tracker_name !== 'UNKNOWN') {
                    friendlyName = clickMeta.tracker_name.trim()
                }
                if (clickMeta.s3 && clickMeta.s3 !== 'UNKNOWN') {
                    finalNetwork = clickMeta.s3.trim()
                }
                finalIp = clickMeta.ip_address || finalIp
                finalUA = clickMeta.user_agent || finalUA
                finalCountry = clickMeta.country || finalCountry
            }
        }

        const countryName = finalCountry !== 'XX' ? finalCountry : 'Unknown'

        // 3. Insert into 'conversions' table
        const conversionData = {
            click_id: finalClickId,
            sub_id: friendlyName, // Use friendly name for subId
            network: finalNetwork,
            country: finalCountry,
            country_name: countryName,
            traffic_type: detectedOs, // Store detected OS here
            browser: detectedBrowser, // New field (needs column)
            earning: payout,
            ip_address: finalIp,
            user_agent: finalUA,
            created_at: new Date().toISOString()
        }

        const { error: convError } = await supabase
            .from('conversions')
            .insert(conversionData)

        if (convError) {
            throw new Error(`Conversion insert failed: ${convError.message}`)
        }

        // 4. Upsert into 'daily_reports' table
        // Unique key is (date, smartlink, network)
        const today = new Date().toISOString().split('T')[0]

        // Call an RPC for the stats update to be safe and atomic
        const { error: rpcError } = await supabase.rpc('increment_daily_report', {
            report_date: today,
            report_smartlink: friendlyName, // Gunakan friendlyName (Tracker Name)
            report_network: finalNetwork,   // Gunakan finalNetwork
            report_payout: payout
        })

        // Fallback if RPC fails (temporary until user runs migration): Fetch -> Calculate -> Upsert
        if (rpcError) {
            console.warn('RPC increment_daily_report failed, falling back to fetch-upsert', rpcError)

            const { data: existing } = await supabase
                .from('daily_reports')
                .select('*')
                .eq('date', today)
                .eq('smartlink', friendlyName)
                .eq('network', finalNetwork)
                .single()

            const newStats = {
                date: today,
                smartlink: friendlyName,
                network: finalNetwork,
                leads: (existing?.leads || 0) + 1,
                payout: (existing?.payout || 0) + payout
            }

            const { error: upsertError } = await supabase
                .from('daily_reports')
                .upsert(newStats, { onConflict: 'date, smartlink, network' })

            if (upsertError) console.error('Daily report upsert failed:', upsertError)
        }

        return new Response(
            JSON.stringify({ success: true, message: 'Conversion recorded', id: finalClickId }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        console.error('Postback error:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
