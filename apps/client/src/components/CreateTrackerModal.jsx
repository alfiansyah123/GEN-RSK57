import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function CreateTrackerModal({ isOpen, onClose, trackerToEdit }) {
    if (!isOpen) return null;

    const [name, setName] = useState('');
    const [team, setTeam] = useState('ADMIN');
    const [password, setPassword] = useState('');

    // Effect to populate form when editing
    useEffect(() => {
        if (trackerToEdit) {
            setName(trackerToEdit.name);
            setTeam(trackerToEdit.team);
            setPassword(trackerToEdit.password || '');
        } else {
            // Reset form for create mode
            setName('');
            setTeam('ADMIN');
            setPassword('');
        }
    }, [trackerToEdit, isOpen]);

    const handleSubmit = async () => {
        // Auto-generate slug from name (replace spaces with dashes)
        const slug = name.trim().replace(/\s+/g, '-');

        if (!name) {
            alert('Please fill in Tracker Name');
            return;
        }

        try {
            let error;

            if (trackerToEdit) {
                // Update
                const { error: updateError } = await supabase
                    .from('tracker')
                    .update({ name, team, password, slug })
                    .eq('id', trackerToEdit.id);
                error = updateError;
            } else {
                // Create
                const { error: insertError } = await supabase
                    .from('tracker')
                    .insert([{ name, team, password, slug }]);
                error = insertError;
            }

            if (!error) {
                alert(`Tracker ${trackerToEdit ? 'Updated' : 'Created'} Successfully! 🚀`);
                onClose();
            } else {
                alert('Error: ' + error.message);
            }
        } catch (err) {
            alert('Failed to connect to server');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
            {/* Blurred Overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-[#1e1e2d] shadow-2xl transition-all border border-[#2d2d42]">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#2d2d42] px-6 py-5">
                    <div>
                        <h2 className="text-xl font-semibold leading-6 text-white tracking-tight">{trackerToEdit ? 'Edit Tracker' : 'Create New Tracker'}</h2>
                        <p className="mt-1 text-sm text-slate-400"></p>
                    </div>
                    <button
                        className="group rounded-full p-1 text-slate-400 hover:bg-[#2d2d42] hover:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        onClick={onClose}
                        type="button"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Form Body */}
                <div className="p-6 space-y-6">
                    {/* Tracker Name Field */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-200" htmlFor="tracker-name">Tracker Name</label>
                        <input
                            className="w-full rounded-xl border-none bg-input-dark px-4 py-3.5 text-base text-white placeholder-slate-500 focus:ring-2 focus:ring-primary shadow-sm transition-all outline-none"
                            id="tracker-name"
                            placeholder="Tracker Name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* Team Dropdown */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-200" htmlFor="team-select">Team</label>
                        <div className="relative">
                            <select
                                className="w-full appearance-none rounded-xl border-none bg-input-dark px-4 py-3.5 pr-10 text-base text-white focus:ring-2 focus:ring-primary shadow-sm transition-all cursor-pointer outline-none"
                                id="team-select"
                                value={team}
                                onChange={(e) => setTeam(e.target.value)}
                            >
                                <option value="ADMIN">Admin</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                                <span className="material-symbols-outlined text-[20px]">expand_more</span>
                            </div>
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-200" htmlFor="password">Password</label>
                        <div className="relative flex items-center rounded-xl bg-input-dark shadow-sm focus-within:ring-2 focus-within:ring-primary transition-all">
                            <input
                                className="flex-1 border-none bg-transparent px-4 py-3.5 text-base text-white placeholder-slate-500 focus:ring-0 outline-none"
                                id="password"
                                placeholder="••••••••"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button className="flex items-center justify-center px-4 text-slate-400 hover:text-white focus:outline-none" type="button">
                                <span className="material-symbols-outlined text-[20px]">visibility</span>
                            </button>
                        </div>
                    </div>

                    {/* Generate URL Field (Read Only) - Only shown when password is entered */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-200" htmlFor="url">Generate URL</label>
                        <div className="relative flex items-center rounded-xl bg-[#232448] shadow-sm transition-all group">
                            <input
                                className={`flex-1 border-none bg-transparent px-4 py-3.5 text-base focus:ring-0 outline-none cursor-default ${password ? 'text-primary' : 'text-slate-500'}`}
                                id="url"
                                type="text"
                                readOnly
                                value={password ? `${window.location.origin}/${name.trim().replace(/\s+/g, '-')}` : 'Enter password first...'}
                            />
                            <div className="flex items-center justify-center px-4 text-slate-500">
                                <span className="material-symbols-outlined text-[20px]">{password ? 'lock_open' : 'lock'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer / Actions */}
                <div className="flex items-center justify-end gap-3 bg-[#171725] px-6 py-4 border-t border-[#2d2d42]">
                    <button
                        className="rounded-lg px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-[#2d2d42] focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                        type="button"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary/25 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#1e1e2d] transition-all"
                        type="button"
                        onClick={handleSubmit}
                    >
                        <span>{trackerToEdit ? 'Save Changes' : 'Create Tracker'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
