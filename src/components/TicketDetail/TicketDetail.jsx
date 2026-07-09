import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MessageSquare, User, Tag } from 'lucide-react';
import { useTickets } from '../../hooks/useTickets';
import { statusBadgeClass, priorityBadgeClass, fmtDateTime, fmtRelative } from '../../utils/helpers';
import { AGENTS, STATUSES } from '../../data/mockData';
import { addComment } from '../../services/ticketService';
import { useDispatch } from 'react-redux';
import { showToast } from '../../store/uiSlice';
import './TicketDetail.css';

const TL_COLORS = { created: '#185FA5', assigned: '#1D9E75', status: '#BA7517', comment: '#534AB7' };

export default function TicketDetail({ ticket }) {
  const navigate        = useNavigate();
  const dispatch        = useDispatch();
  const { updateStatus, updateAgent } = useTickets();
  const [note,  setNote]  = useState('');
  const [saving, setSaving] = useState(false);

  const handleStatusChange = (status) => updateStatus(ticket.id, status);
  const handleAgentChange  = (e)      => updateAgent(ticket.id, e.target.value);

  const handleAddNote = async () => {
    if (!note.trim()) return;
    setSaving(true);
    try {
      await addComment(ticket.id, note);
      dispatch(showToast({ message: 'Note added to timeline', type: 'success' }));
      setNote('');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="detail-layout">
      {/* Back */}
      <button className="back-btn btn btn-ghost btn-sm" onClick={() => navigate('/tickets')}>
        <ArrowLeft size={14} aria-hidden="true" /> Back to tickets
      </button>

      <div className="detail-grid">
        {/* Main column */}
        <div className="detail-main">
          {/* Header */}
          <div className="card detail-card">
            <div className="detail-badges">
              <span className="tid-label">{ticket.id}</span>
              <span className={statusBadgeClass(ticket.status)}>{ticket.status}</span>
              <span className={priorityBadgeClass(ticket.priority)}>{ticket.priority}</span>
              <span className="badge badge-cat">{ticket.category}</span>
            </div>
            <h1 className="detail-title">{ticket.title}</h1>
            <p className="detail-meta-line">
              <User size={13} aria-hidden="true" /> {ticket.requester}
              <span className="meta-dot" aria-hidden="true">·</span>
              <Clock size={13} aria-hidden="true" /> {fmtDateTime(ticket.created)}
            </p>

            {ticket.description && (
              <blockquote className="detail-desc">{ticket.description}</blockquote>
            )}

            {/* Status actions */}
            <div className="action-bar" role="group" aria-label="Update ticket status">
              {STATUSES.filter(s => s !== ticket.status).map(s => (
                <button
                  key={s}
                  className={`btn btn-sm ${s === 'Closed' ? 'btn-danger' : 'btn-secondary'}`}
                  onClick={() => handleStatusChange(s)}
                >
                  {s === 'Resolved' ? '✓ ' : s === 'Closed' ? '✕ ' : ''}{s}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="card detail-card">
            <h2 className="card-title">
              <MessageSquare size={14} aria-hidden="true" style={{ verticalAlign: '-2px', marginRight: 6 }} />
              Activity timeline
            </h2>
            <ol className="timeline" aria-label="Ticket timeline">
              {ticket.timeline.map((entry, i) => (
                <li key={i} className="tl-item">
                  <div
                    className="tl-dot"
                    style={{ background: TL_COLORS[entry.type] || '#888780' }}
                    aria-hidden="true"
                  />
                  <div className="tl-content">
                    <p className="tl-text">{entry.text}</p>
                    <time className="tl-time" dateTime={entry.time}>{fmtRelative(entry.time)}</time>
                  </div>
                </li>
              ))}
            </ol>

            {/* Add note */}
            <div className="add-note">
              <label className="form-label" htmlFor="agent-note">Add internal note</label>
              <textarea
                id="agent-note"
                className="form-control"
                rows={3}
                placeholder="Visible to agents only…"
                value={note}
                onChange={e => setNote(e.target.value)}
              />
              <button
                className="btn btn-primary btn-sm"
                style={{ marginTop: 8 }}
                onClick={handleAddNote}
                disabled={!note.trim() || saving}
                aria-busy={saving}
              >
                {saving ? 'Saving…' : 'Save note'}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="detail-sidebar" aria-label="Ticket details sidebar">
          {/* Agent */}
          <div className="card detail-card">
            <h2 className="card-title">Assigned agent</h2>
            <div className="agent-info">
              <div
                className="avatar avatar-md"
                style={{ background: ticket.agent.color, color: ticket.agent.textColor }}
                aria-label={ticket.agent.name}
              >
                {ticket.agent.initials}
              </div>
              <div>
                <p className="agent-name">{ticket.agent.name}</p>
                <p className="agent-role">Support agent</p>
              </div>
            </div>
            <div className="form-group" style={{ marginTop: 14, marginBottom: 0 }}>
              <label className="form-label" htmlFor="reassign-select">Reassign to</label>
              <select
                id="reassign-select"
                className="form-control"
                value={ticket.agent.id}
                onChange={handleAgentChange}
              >
                {AGENTS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
          </div>

          {/* Meta */}
          <div className="card detail-card">
            <h2 className="card-title">
              <Tag size={14} aria-hidden="true" style={{ verticalAlign: '-2px', marginRight: 6 }} />
              Details
            </h2>
            <dl className="meta-list">
              {[
                { term: 'Created',      desc: fmtDateTime(ticket.created) },
                { term: 'Last updated', desc: fmtDateTime(ticket.updated) },
                { term: 'Category',     desc: ticket.category             },
                { term: 'Comments',     desc: `${ticket.comments} replies` },
              ].map(({ term, desc }) => (
                <div key={term} className="meta-item">
                  <dt className="meta-key">{term}</dt>
                  <dd className="meta-val">{desc}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}
