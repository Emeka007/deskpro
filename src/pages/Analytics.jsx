import React, { useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid,
} from 'recharts';
import { useTickets } from '../hooks/useTickets';
import StatCard from '../components/StatCard/StatCard';
import { STATUSES, CATEGORIES, AGENTS } from '../data/mockData';
import { statusColor } from '../utils/helpers';
import './Analytics.css';

export default function Analytics() {
  const { tickets, load } = useTickets();

  useEffect(() => { load(); }, [load]);

  const statusData   = STATUSES.map(s => ({ name: s,             value: tickets.filter(t => t.status === s).length,   fill: statusColor(s) }));
  const categoryData = CATEGORIES.map(c => ({ name: c,           value: tickets.filter(t => t.category === c).length }));

  const trendData = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (13 - i));
    return {
      day: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      created:  Math.floor(Math.random() * 8) + 2,
      resolved: Math.floor(Math.random() * 6) + 1,
    };
  });

  const agentData = AGENTS.map(a => ({ name: a.name.split(' ')[0], resolved: a.resolved }))
    .sort((a, b) => b.resolved - a.resolved);

  const avgResolution = 8.4;
  const csat = 94;
  const firstContact = 61;

  return (
    <main className="page-content" aria-label="Analytics">
      <h1 style={{ fontSize: 20, fontWeight: 700 }}>Analytics</h1>

      {/* KPI strip */}
      <div className="stats-grid">
        <StatCard label="Total tickets"     value={tickets.length} sub="All time"                  accent="#185FA5" />
        <StatCard label="Avg resolution"    value={`${avgResolution}h`} sub="Last 30 days"         accent="#1D9E75" />
        <StatCard label="CSAT score"        value={`${csat}%`}    sub="Based on 38 ratings"        accent="#534AB7" />
        <StatCard label="First contact res" value={`${firstContact}%`} sub="Resolved in one reply" accent="#BA7517" />
      </div>

      {/* Trend chart */}
      <div className="card">
        <h2 className="card-title">Created vs resolved — last 14 days</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,.06)" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#888780' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#888780' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '0.5px solid rgba(0,0,0,.10)' }} />
            <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="created"  stroke="#185FA5" strokeWidth={2} dot={false} name="Created"  />
            <Line type="monotone" dataKey="resolved" stroke="#1D9E75" strokeWidth={2} dot={false} name="Resolved" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom charts row */}
      <div className="analytics-row">
        <div className="card">
          <h2 className="card-title">By status</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={statusData} dataKey="value" cx="50%" cy="50%" outerRadius={65} paddingAngle={2} nameKey="name">
                {statusData.map(e => <Cell key={e.name} fill={e.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '0.5px solid rgba(0,0,0,.10)' }} />
              <Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="card-title">By category</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={categoryData} layout="vertical" barSize={14}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#5F5E5A' }} axisLine={false} tickLine={false} width={90} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '0.5px solid rgba(0,0,0,.10)' }} />
              <Bar dataKey="value" fill="#185FA5" radius={[0, 4, 4, 0]} name="Tickets" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="card-title">Agents by resolved</h2>
          <div className="agent-leaderboard">
            {agentData.map((a, i) => (
              <div key={a.name} className="agent-row">
                <span className="rank">{i + 1}</span>
                <span className="a-name">{a.name}</span>
                <div className="progress-track" style={{ flex: 1 }}>
                  <div
                    className="progress-fill"
                    style={{ width: `${Math.round(a.resolved / agentData[0].resolved * 100)}%`, background: '#185FA5' }}
                    role="progressbar"
                    aria-valuenow={a.resolved}
                    aria-valuemax={agentData[0].resolved}
                    aria-label={`${a.name}: ${a.resolved} resolved`}
                  />
                </div>
                <span className="a-count">{a.resolved}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
