import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAllTickets, updateTicketStatus, reassignTicket, createNewTicket } from '../services/ticketService';

// Async thunks (mirrors Angular NgRx Effects)
export const loadTickets = createAsyncThunk('tickets/load', async () => {
  return await fetchAllTickets();
});

export const changeStatus = createAsyncThunk('tickets/changeStatus', async ({ id, status }) => {
  return await updateTicketStatus(id, status);
});

export const reassign = createAsyncThunk('tickets/reassign', async ({ id, agentId }) => {
  return await reassignTicket(id, agentId);
});

export const submitTicket = createAsyncThunk('tickets/submit', async (formData) => {
  return await createNewTicket(formData);
});

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState: {
    list:       [],
    selected:   null,
    filters:    { search: '', status: '', priority: '', category: '' },
    loading:    false,
    error:      null,
    submitting: false,
  },
  reducers: {
    setSelected(state, action) {
      state.selected = action.payload;
    },
    setFilter(state, action) {
      const { key, value } = action.payload;
      state.filters[key] = value;
    },
    clearFilters(state) {
      state.filters = { search: '', status: '', priority: '', category: '' };
    },
    addTimelineEntry(state, action) {
      const { id, entry } = action.payload;
      const ticket = state.list.find(t => t.id === id);
      if (ticket) ticket.timeline.push(entry);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTickets.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(loadTickets.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(loadTickets.rejected,  (state, action) => { state.loading = false; state.error = action.error.message; })

      .addCase(changeStatus.fulfilled, (state, action) => {
        const idx = state.list.findIndex(t => t.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
        if (state.selected?.id === action.payload.id) state.selected = action.payload;
      })

      .addCase(reassign.fulfilled, (state, action) => {
        const idx = state.list.findIndex(t => t.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
        if (state.selected?.id === action.payload.id) state.selected = action.payload;
      })

      .addCase(submitTicket.pending,   (state) => { state.submitting = true; })
      .addCase(submitTicket.fulfilled, (state, action) => {
        state.submitting = false;
        state.list.unshift(action.payload);
      })
      .addCase(submitTicket.rejected,  (state) => { state.submitting = false; });
  },
});

// Selectors
export const selectAllTickets    = (state) => state.tickets.list;
export const selectFilters       = (state) => state.tickets.filters;
export const selectSelectedTicket = (state) => state.tickets.selected;
export const selectLoading       = (state) => state.tickets.loading;
export const selectError         = (state) => state.tickets.error;
export const selectSubmitting    = (state) => state.tickets.submitting;

export const selectFilteredTickets = (state) => {
  const { list, filters } = state.tickets;
  const q = filters.search.toLowerCase();
  return list.filter(t =>
    (!q || t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.requester.toLowerCase().includes(q)) &&
    (!filters.status   || t.status   === filters.status) &&
    (!filters.priority || t.priority === filters.priority) &&
    (!filters.category || t.category === filters.category)
  );
};

export const selectStats = (state) => {
  const list = state.tickets.list;
  return {
    total:    list.length,
    open:     list.filter(t => t.status === 'Open').length,
    inProg:   list.filter(t => t.status === 'In Progress').length,
    resolved: list.filter(t => t.status === 'Resolved').length,
    critical: list.filter(t => t.priority === 'P1 - Critical').length,
    waiting:  list.filter(t => t.status === 'Waiting').length,
  };
};

export const { setSelected, setFilter, clearFilters, addTimelineEntry } = ticketsSlice.actions;
export default ticketsSlice.reducer;
