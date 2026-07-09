import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, ChevronRight } from 'lucide-react';
import { statusBadgeClass, priorityBadgeClass, fmtRelative } from '../../utils/helpers';
import './TicketTable.css';

function TicketRow({ ticket }) {
  const navigate = useNavigate();

  return (
    <tr
      className="ticket-row"
      onClick={() => navigate(`/tickets/${ticket.id}`)}
      role="button"
      tabIndex={0}
      aria-label={`View ticket ${ticket.id}: ${ticket.title}`}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/tickets/${ticket.id}`)}
    >
      <td className="cell-id">{ticket.id}</td>
      <td className="cell-title">
        <div className="ticket-title">{ticket.title}</div>
        <div className="ticket-sub">{ticket.requester}</div>
      </td>
      <td><span className={statusBadgeClass(ticket.status)}>{ticket.status}</span></td>
      <td><span className={priorityBadgeClass(ticket.priority)}>{ticket.priority.split(' - ')[0]}</span></td>
      <td className="cell-cat">{ticket.category}</td>
      <td className="cell-agent">
        <div
          className="avatar avatar-sm"
          style={{ background: ticket.agent.color, color: ticket.agent.textColor }}
          title={ticket.agent.name}
        >
          {ticket.agent.initials}
        </div>
        <span className="agent-name">{ticket.agent.name.split(' ')[0]}</span>
      </td>
      <td className="cell-time">{fmtRelative(ticket.updated)}</td>
      <td className="cell-comments">
        {ticket.comments > 0 && (
          <span className="comment-count">
            <MessageSquare size={12} aria-hidden="true" /> {ticket.comments}
          </span>
        )}
      </td>
      <td className="cell-chevron"><ChevronRight size={14} color="#B4B2A9" aria-hidden="true" /></td>
    </tr>
  );
}

export default function TicketTable({ tickets, loading }) {
  if (loading) {
    return (
      <div className="ticket-table-wrap card" aria-busy="true" aria-label="Loading tickets">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 48, marginBottom: 1 }} />
        ))}
      </div>
    );
  }

  if (!tickets.length) {
    return (
      <div className="ticket-table-wrap card">
        <div className="empty-state">
          <h3>No tickets found</h3>
          <p>Try adjusting your filters or create a new ticket.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ticket-table-wrap card">
      <table className="ticket-table" role="table" aria-label="Support tickets">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Title</th>
            <th scope="col">Status</th>
            <th scope="col">Priority</th>
            <th scope="col">Category</th>
            <th scope="col">Agent</th>
            <th scope="col">Updated</th>
            <th scope="col"><span className="sr-only">Comments</span></th>
            <th scope="col"><span className="sr-only">Open</span></th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(t => <TicketRow key={t.id} ticket={t} />)}
        </tbody>
      </table>
    </div>
  );
}
