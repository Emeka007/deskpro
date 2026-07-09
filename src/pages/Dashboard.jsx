import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useTickets } from '../hooks/useTickets';
import StatCard from '../components/StatCard/StatCard';
import TicketTable from '../components/TicketTable/TicketTable';
import { statusColor, priorityColor } from '../utils/helpers';
import { STATUSES, PRIORITIES } from '../data/mockData';
import './Dashboard.css';

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
function volumeData() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return { day: DAYS[d.getDay()], count: Math.floor(Math.random() * 9) + 2 };
  });
}

export default function Dashboard() {
  const { tickets, loading, stats, load } = useTickets();

  useEffect(() => { load(); }, [load]);

  const statusData = STATUSES.map(s => ({
    name: s, value: tickets.filter(t => t.status === s).length,
  })).filter(d => d.value > 0);

  const priorityData = PRIORITIES.map(p => ({
    name: p.split(' - ')[0], value: tickets.filter(t => t.priority === p).length, color: priorityColor(p),
  }));

  const recent = tickets.slice(0, 8);

  return (
    <main className="page-content" aria-label="Dashboard">
      {/* Stats row */}
      <div className="stats-grid" role="region" aria-label="Summary statistics">
        <StatCard label="Open"        value={stats.open}     sub="Awaiting action"     accent="#185FA5" />
        <StatCard label="In progress" value={stats.inProg}   sub="Being worked on"     accent="#BA7517" />
        <StatCard label="Resolved"    value={stats.resolved} sub="Last 30 days"         accent="#1D9E75" />
        <StatCard label="Critical P1" value={stats.critical} sub="Needs immediate action" accent="#E24B4A" />
      </div>

      {/* Charts row */}
      <div className="charts-row" role="region" aria-label="Charts">
        <div className="card chart-card">
          <h2 className="card-title">Ticket volume — last 7 days</h2>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={volumeData()} barSize={24}>
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#888780' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '0.5px solid rgba(0,0,0,.10)', boxShadow: 'none' }}
                cursor={{ fill: '#f5f4f0' }}
              />
              <Bar dataKey="count" fill="#185FA5" radius={[4, 4, 0, 0]} name="Tickets" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-card chart-card-sm">
          <h2 className="card-title">By status</h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={statusData} dataKey="value" cx="50%" cy="50%" outerRadius={60} paddingAngle={2}>
                {statusData.map(entry => (
                  <Cell key={entry.name} fill={statusColor(entry.name)} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '0.5px solid rgba(0,0,0,.10)' }} />
              <Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-card chart-card-sm">
          <h2 className="card-title">By priority</h2>
          <div className="priority-bars">
            {priorityData.map(p => (
              <div key={p.name} className="priority-row">
                <span className="p-name">{p.name}</span>
                <div className="progress-track" style={{ flex: 1 }}>
                  <div
                    className="progress-fill"
                    style={{
                      width: tickets.length ? `${Math.round(p.value / tickets.length * 100)}%` : '0%',
                      background: p.color,
                    }}
                    role="progressbar"
                    aria-valuenow={p.value}
                    aria-valuemax={tickets.length}
                    aria-label={`${p.name}: ${p.value} tickets`}
                  />
                </div>
                <span className="p-count">{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent tickets */}
      <section aria-label="Recent tickets">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600 }}>Recent tickets</h2>
          <button className="btn btn-ghost btn-sm" onClick={() => {}}>View all →</button>
        </div>
        <TicketTable tickets={recent} loading={loading} />
      </section>
    </main>
  );
}
