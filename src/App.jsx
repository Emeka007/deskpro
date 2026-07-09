import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TopBar from './components/TopBar/TopBar';
import Toast from './components/Toast/Toast';
import Dashboard from './pages/Dashboard';
import TicketList from './pages/TicketList';
import TicketDetailPage from './pages/TicketDetailPage';
import CreateTicketPage from './pages/CreateTicketPage';
import Analytics from './pages/Analytics';
import './styles/globals.css';

export default function App() {
  return (
    <div className="app-shell">
      <TopBar />
      <Routes>
        <Route path="/"               element={<Dashboard />} />
        <Route path="/tickets"        element={<TicketList />} />
        <Route path="/tickets/:id"    element={<TicketDetailPage />} />
        <Route path="/create"         element={<CreateTicketPage />} />
        <Route path="/analytics"      element={<Analytics />} />
        <Route path="*"               element={<Navigate to="/" replace />} />
      </Routes>
      <Toast />
    </div>
  );
}
