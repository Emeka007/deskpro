import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Ticket, BarChart2, Plus } from 'lucide-react';
import './TopBar.css';

export default function TopBar() {
  const navigate = useNavigate();

  return (
    <header className="topbar" role="banner">
      <div className="topbar-brand">
        Desk<span className="brand-accent">Pro</span>
      </div>

      <nav className="topbar-nav" role="navigation" aria-label="Main navigation">
        <NavLink to="/"        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
          <LayoutDashboard size={15} aria-hidden="true" /> Dashboard
        </NavLink>
        <NavLink to="/tickets" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Ticket size={15} aria-hidden="true" /> Tickets
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <BarChart2 size={15} aria-hidden="true" /> Analytics
        </NavLink>
      </nav>

      <div className="topbar-actions">
        <button
          className="btn btn-primary btn-sm"
          onClick={() => navigate('/create')}
          aria-label="Create new ticket"
        >
          <Plus size={14} aria-hidden="true" /> New ticket
        </button>
      </div>
    </header>
  );
}
