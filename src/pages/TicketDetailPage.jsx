import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTickets } from '../hooks/useTickets';
import TicketDetail from '../components/TicketDetail/TicketDetail';

export default function TicketDetailPage() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { tickets, selected, select, load, loading } = useTickets();

  useEffect(() => {
    if (!tickets.length) load();
  }, [tickets.length, load]);

  useEffect(() => {
    const ticket = tickets.find(t => t.id === id);
    if (ticket) select(ticket);
    else if (!loading && tickets.length) navigate('/tickets', { replace: true });
  }, [id, tickets, select, navigate, loading]);

  if (loading || !selected) {
    return (
      <main className="page-content">
        <div className="skeleton" style={{ height: 200, borderRadius: 12 }} aria-label="Loading ticket" />
      </main>
    );
  }

  return (
    <main className="page-content">
      <TicketDetail ticket={selected} />
    </main>
  );
}
