import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Toolbar({ onOpenCreateModal }) {
    const { isDark } = useTheme();
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
            <div className="lg:col-span-5 xl:col-span-6">
                <label className="flex w-full">
                    <div className={`flex w-full items-stretch rounded-lg h-11 group focus-within:ring-2 focus-within:ring-primary/50 transition-all ${isDark ? 'bg-secondary' : 'bg-white border border-gray-200'}`}>
                        <div className={`flex items-center justify-center pl-4 pr-2 ${isDark ? 'text-text-muted' : 'text-gray-400'}`}>
                            <span className="material-symbols-outlined">search</span>
                        </div>
                        <input className={`w-full bg-transparent border-none focus:ring-0 text-sm h-full outline-none ${isDark ? 'text-white placeholder:text-text-muted' : 'text-gray-900 placeholder:text-gray-400'}`} placeholder="Search by Empid or Tracker ID" />
                    </div>
                </label>
            </div>
            <div className="lg:col-span-7 xl:col-span-6 flex flex-wrap sm:flex-nowrap justify-end gap-3">
                <button className={`flex items-center justify-center gap-2 h-11 px-5 rounded-lg text-sm font-bold transition-all border w-full sm:w-auto ${isDark ? 'bg-secondary hover:bg-secondary/80 text-white border-transparent hover:border-primary/50' : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'}`}>
                    <span className="material-symbols-outlined text-[20px]">refresh</span>
                    <span>Refresh</span>
                </button>
                <button
                    onClick={onOpenCreateModal}
                    className="flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all w-full sm:w-auto cursor-pointer"
                >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    <span className="whitespace-nowrap">Create Generate</span>
                </button>
            </div>
        </div>
    );
}
