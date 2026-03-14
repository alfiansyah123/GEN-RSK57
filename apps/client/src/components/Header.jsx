import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
    const { isDark, toggleTheme } = useTheme();
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    return (
        <header className={`w-full border-b border-solid px-6 py-4 sticky top-0 z-50 transition-colors duration-300 ${isDark ? 'glass-panel border-white/10' : 'bg-white/80 backdrop-blur-md border-gray-200 shadow-sm'}`}>
            <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <img 
                        src="/logo.png" 
                        alt="D87" 
                        className="h-8 md:h-10 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" 
                    />
                    <h2 className={`text-lg md:text-xl font-black italic tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        D87 <span className="opacity-50 font-medium not-italic px-1">|</span> <span className="text-sm md:text-base uppercase tracking-widest font-black opacity-80">BOLO WOLU PITU</span>
                    </h2>
                </div>
                <nav className="hidden md:flex flex-1 justify-center">
                    <div className={`flex items-center gap-1 p-1 rounded-full border ${isDark ? 'bg-[#16172b]/50 border-[#323367]' : 'bg-gray-100 border-gray-200'}`}>
                        <NavLink
                            to="/"
                            className={({ isActive }) => `px-4 py-2 rounded-full text-sm font-medium transition-colors ${isActive ? 'text-white bg-primary shadow-lg shadow-primary/25' : isDark ? 'text-[#9293c9] hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'}`}
                        >
                            Dashboard
                        </NavLink>
                        <NavLink
                            to="/campaigns"
                            className={({ isActive }) => `px-4 py-2 rounded-full text-sm font-medium transition-colors ${isActive ? 'text-white bg-primary shadow-lg shadow-primary/25' : isDark ? 'text-[#9293c9] hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'}`}
                        >
                            Campaigns
                        </NavLink>
                        <NavLink
                            to="/addon-domains"
                            className={({ isActive }) => `px-4 py-2 rounded-full text-sm font-medium transition-colors ${isActive ? 'text-white bg-primary shadow-lg shadow-primary/25' : isDark ? 'text-[#9293c9] hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'}`}
                        >
                            Addon Domain
                        </NavLink>
                        <NavLink
                            to="/reports"
                            className={({ isActive }) => `px-4 py-2 rounded-full text-sm font-medium transition-colors ${isActive ? 'text-white bg-primary shadow-lg shadow-primary/25' : isDark ? 'text-[#9293c9] hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'}`}
                        >
                            Reports
                        </NavLink>
                    </div>
                </nav>
                <div className="flex items-center justify-end gap-6 flex-1 md:flex-none">
                    <div className="flex items-center gap-3">
                        <button onClick={toggleTheme} className={`transition-colors ${isDark ? 'text-[#9293c9] hover:text-white' : 'text-gray-500 hover:text-gray-900'}`} title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
                            <span className="material-symbols-outlined">{isDark ? 'light_mode' : 'dark_mode'}</span>
                        </button>
                        <button onClick={handleLogout} className={`transition-colors ${isDark ? 'text-[#9293c9] hover:text-red-500' : 'text-gray-500 hover:text-red-600'}`} title="Logout">
                            <span className="material-symbols-outlined">logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
