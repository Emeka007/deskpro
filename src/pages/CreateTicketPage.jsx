import React from 'react';
import CreateWizard from '../components/CreateWizard/CreateWizard';

export default function CreateTicketPage() {
  return (
    <main className="page-content" aria-label="Create new ticket">
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>New ticket</h1>
      <p style={{ fontSize: 13, color: '#888780', marginBottom: 20 }}>
        Complete the form below to log a new support request.
      </p>
      <CreateWizard />
    </main>
  );
}
