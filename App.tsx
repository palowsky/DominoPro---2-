
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { League } from './views/League';
import { LiveTable } from './views/LiveTable';
import { Summary } from './views/Summary';
import { Admin } from './views/Admin';
import { GamificationOverlay } from './components/GamificationOverlay';
import { LeagueProvider, useLeague } from './contexts/LeagueContext';

const AppContent: React.FC = () => {
  const { isLoading, activeAchievement, clearAchievement } = useLeague();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<League />} />
        <Route path="/play" element={<LiveTable />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <GamificationOverlay event={activeAchievement} onComplete={clearAchievement} />
    </>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <LeagueProvider>
        <Layout>
          <AppContent />
        </Layout>
      </LeagueProvider>
    </HashRouter>
  );
};

export default App;
