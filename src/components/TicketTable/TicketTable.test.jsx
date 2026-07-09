import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

import TicketTable from './TicketTable';

const MOCK = [
  { id:'TKT-1000', title:'Cannot login after password reset', requester:'alice@acme.com',
    status:'Open', priority:'P2 - High', category:'Account',
    agent:{ id:'a1', name:'Sarah Chen', initials:'SC', color:'#E6F1FB', textColor:'#0C447C' },
    created: new Date().toISOString(), updated: new Date().toISOString(), comments:3, timeline:[] },
  { id:'TKT-1001', title:'Invoice shows wrong amount', requester:'bob@startup.io',
    status:'Resolved', priority:'P3 - Medium', category:'Billing',
    agent:{ id:'a2', name:'Marcus Torres', initials:'MT', color:'#EAF3DE', textColor:'#27500A' },
    created: new Date().toISOString(), updated: new Date().toISOString(), comments:1, timeline:[] },
];

describe('TicketTable', () => {
  test('renders support tickets table', () => {
    render(<TicketTable tickets={MOCK} loading={false} />);
    expect(screen.getByRole('table', { name: /support tickets/i })).toBeInTheDocument();
  });
  test('renders all ticket titles', () => {
    render(<TicketTable tickets={MOCK} loading={false} />);
    expect(screen.getByText('Cannot login after password reset')).toBeInTheDocument();
    expect(screen.getByText('Invoice shows wrong amount')).toBeInTheDocument();
  });
  test('renders status badges correctly', () => {
    render(<TicketTable tickets={MOCK} loading={false} />);
    expect(screen.getAllByText('Open').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Resolved').length).toBeGreaterThan(0);
  });
  test('renders ticket IDs', () => {
    render(<TicketTable tickets={MOCK} loading={false} />);
    expect(screen.getByText('TKT-1000')).toBeInTheDocument();
    expect(screen.getByText('TKT-1001')).toBeInTheDocument();
  });
  test('shows empty state when ticket list is empty', () => {
    render(<TicketTable tickets={[]} loading={false} />);
    expect(screen.getByText(/no tickets found/i)).toBeInTheDocument();
  });
  test('shows loading skeleton when loading is true', () => {
    const { container } = render(<TicketTable tickets={[]} loading={true} />);
    expect(container.querySelectorAll('.skeleton').length).toBeGreaterThan(0);
  });
  test('shows requester email as subtitle', () => {
    render(<TicketTable tickets={MOCK} loading={false} />);
    expect(screen.getByText('alice@acme.com')).toBeInTheDocument();
  });
  test('table columns headers are present', () => {
    render(<TicketTable tickets={MOCK} loading={false} />);
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Priority')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
  });
});
