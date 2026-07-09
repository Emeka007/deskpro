import React, { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useTickets } from '../hooks/useTickets';
import { useDebounce } from '../hooks/useDebounce';
import TicketTable from '../components/TicketTable/TicketTable';
import { STATUSES, PRIORITIES, CATEGORIES } from '../data/mockData';
import './TicketList.css';

export default function TicketList() {
  const { filtered, loading, filters, filter, resetFilters, load } = useTickets();
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => { load(); }, [load]);

  // Push debounced search value into Redux
  useEffect(() => {
    filter('search', debouncedSearch);
  }, [debouncedSearch, filter]);

  const hasActiveFilters = filters.status || filters.priority || filters.category || filters.search;

  return (
    <main className="page-content" aria-label="Ticket list">
      <div className="list-header">
        <h1 className="page-title">All tickets</h1>
        <span className="ticket-count" aria-live="polite" aria-atomic="true">
          {filtered.length} ticket{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Filter bar */}
      <div className="filter-bar" role="search" aria-label="Filter tickets">
        <div className="search-wrap">
          <Search size={14} className="search-icon" aria-hidden="true" />
          <input
            type="search"
            className="form-control search-input"
            placeholder="Search by title, ID or requester…"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            aria-label="Search tickets"
          />
          {searchInput && (
            <button className="search-clear" onClick={() => { setSearchInput(''); }} aria-label="Clear search">
              <X size={13} />
            </button>
          )}
        </div>

        <SlidersHorizontal size={15} style={{ color: '#888780', flexShrink: 0 }} aria-hidden="true" />

        <select
          className="form-control filter-select"
          value={filters.status || ''}
          onChange={e => filter('status', e.target.value)}
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select
          className="form-control filter-select"
          value={filters.priority || ''}
          onChange={e => filter('priority', e.target.value)}
          aria-label="Filter by priority"
        >
          <option value="">All priorities</option>
          {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        <select
          className="form-control filter-select"
          value={filters.category || ''}
          onChange={e => filter('category', e.target.value)}
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {hasActiveFilters && (
          <button className="btn btn-ghost btn-sm clear-btn" onClick={() => { resetFilters(); setSearchInput(''); }}>
            <X size={13} aria-hidden="true" /> Clear
          </button>
        )}
      </div>

      <TicketTable tickets={filtered} loading={loading} />
    </main>
  );
}
