import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Campaigns from './pages/Campaigns';
import AddonDomains from './pages/AddonDomains';
import Generator from './pages/Generator';

import BulkUrl from './pages/BulkUrl';
import GeneratorAddonDomain from './pages/GeneratorAddonDomain';
import TrackerAuthGuard from './components/TrackerAuthGuard';


function AppContent() {
  const location = useLocation();
  const { isDark } = useTheme();
  const path = location.pathname;

  const isDashboard = path === '/';
  const isCampaigns = path.startsWith('/campaigns');
  const isAddonDomains = path.startsWith('/addon-domains');


  const isGeneratorPage = !isDashboard && !isCampaigns && !isAddonDomains;

  return (
    <div className={`min-h-screen flex flex-col overflow-x-hidden transition-colors ${isDark ? 'bg-[#111122]' : 'bg-gray-50'}`}>
      {!isGeneratorPage && <Header />}

      <main className={`flex-grow w-full ${!isGeneratorPage ? 'px-6 py-8' : ''}`}>
        <div className={!isGeneratorPage ? "max-w-[1440px] mx-auto flex flex-col h-full" : "w-full h-full"}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/addon-domains" element={<AddonDomains />} />

            {/* Tracker Routes Protected by Password Guard */}
            <Route element={<TrackerAuthGuard />}>
              <Route path="/:trackerId" element={<Generator />} />

              <Route path="/:trackerId/bulk-url" element={<BulkUrl />} />
              <Route path="/:trackerId/addon-domain" element={<GeneratorAddonDomain />} />
            </Route>
          </Routes>



        </div>
      </main >
    </div >
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
