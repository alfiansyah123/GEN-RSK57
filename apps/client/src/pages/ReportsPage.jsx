import Header from '../components/Header/Header.jsx';
import ReportsTable from '../components/Table/ReportsTable.jsx';
import { useState, useMemo, useEffect } from 'react';

import { supabase } from '../lib/supabaseClient';

const ReportsPage = ({ onLogout, currency, setCurrency, currencyRate, setCurrencyRate, isDarkMode, toggleTheme }) => {
    // Helper function - returns "yesterday" if before 7am WIB, otherwise today
    const getWIBDateString = () => {
        const now = new Date();
        const wibHour = now.getHours(); // Local hour (WIB)

        // If before 7am, use yesterday's date for reporting
        let targetDate = now;
        if (wibHour < 7) {
            targetDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Subtract 1 day
        }

        const year = targetDate.getFullYear();
        const month = String(targetDate.getMonth() + 1).padStart(2, '0');
        const day = String(targetDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [startDate, setStartDate] = useState(getWIBDateString);
    const [endDate, setEndDate] = useState(getWIBDateString);

    const [searchQuery, setSearchQuery] = useState('');
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchReports = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('daily_reports')
                .select('*')
                .gte('date', startDate)
                .lte('date', endDate)
                .order('date', { ascending: false });

            if (error) throw error;
            setData(data || []);
        } catch (err) {
            console.error("Failed to fetch reports", err);
            setData([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [startDate, endDate]);

    const totalPayout = useMemo(() => {
        return data.reduce((acc, curr) => acc + (parseFloat(curr.payouts) || 0), 0);
    }, [data]);

    const filteredData = useMemo(() => {
        if (!searchQuery) return data;
        const query = searchQuery.toLowerCase();
        return data.filter(item =>
            (item.smartlink && item.smartlink.toLowerCase().includes(query)) ||
            (item.network && item.network.toLowerCase().includes(query))
        );
    }, [data, searchQuery]);

    return (
        <div className="flex flex-col h-full gap-4 overflow-hidden relative">
            <Header
                selectedView="reports"
                onSearch={setSearchQuery}
                onRefresh={fetchReports}
                startDate={startDate}
                endDate={endDate}
                onDateRangeChange={(start, end) => {
                    setStartDate(start);
                    setEndDate(end);
                }}
                currency={currency}
                onCurrencyChange={setCurrency}
                currencyRate={currencyRate}
                onCurrencyRateChange={setCurrencyRate}
                totalPayout={totalPayout}
                itemCount={data.length}
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
                onLogout={onLogout}
            />

            <div className="flex-1 min-h-0 overflow-hidden rounded-2xl border border-border-light dark:border-border-dark shadow-sm bg-surface-light dark:bg-surface-dark">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <ReportsTable
                        data={filteredData}
                        currency={currency}
                        currencyRate={currencyRate}
                    />
                )}
            </div>
        </div>
    );
};

export default ReportsPage;