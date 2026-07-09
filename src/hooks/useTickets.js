import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
  selectAllTickets, selectFilteredTickets, selectSelectedTicket,
  selectLoading, selectError, selectStats, selectFilters, selectSubmitting,
  loadTickets, changeStatus, reassign, submitTicket,
  setSelected, setFilter, clearFilters,
} from '../store/ticketsSlice';
import { showToast } from '../store/uiSlice';

/**
 * useTickets — single hook that gives pages everything they need.
 * Mirrors the pattern of an Angular service injected via DI.
 */
export function useTickets() {
  const dispatch = useDispatch();

  const tickets         = useSelector(selectAllTickets);
  const filtered        = useSelector(selectFilteredTickets);
  const selected        = useSelector(selectSelectedTicket);
  const loading         = useSelector(selectLoading);
  const error           = useSelector(selectError);
  const stats           = useSelector(selectStats);
  const filters         = useSelector(selectFilters);
  const submitting      = useSelector(selectSubmitting);

  const load = useCallback(() => dispatch(loadTickets()), [dispatch]);

  const select = useCallback((ticket) => dispatch(setSelected(ticket)), [dispatch]);

  const updateStatus = useCallback(async (id, status) => {
    const result = await dispatch(changeStatus({ id, status }));
    if (changeStatus.fulfilled.match(result)) {
      dispatch(showToast({ message: `Status updated to "${status}"`, type: 'success' }));
    } else {
      dispatch(showToast({ message: 'Failed to update status', type: 'error' }));
    }
  }, [dispatch]);

  const updateAgent = useCallback(async (id, agentId) => {
    const result = await dispatch(reassign({ id, agentId }));
    if (reassign.fulfilled.match(result)) {
      dispatch(showToast({ message: 'Ticket reassigned', type: 'success' }));
    }
  }, [dispatch]);

  const create = useCallback(async (formData) => {
    const result = await dispatch(submitTicket(formData));
    if (submitTicket.fulfilled.match(result)) {
      dispatch(showToast({ message: `Ticket ${result.payload.id} created`, type: 'success' }));
      return result.payload;
    }
    dispatch(showToast({ message: 'Failed to create ticket', type: 'error' }));
    return null;
  }, [dispatch]);

  const filter = useCallback((key, value) => dispatch(setFilter({ key, value })), [dispatch]);
  const resetFilters = useCallback(() => dispatch(clearFilters()), [dispatch]);

  return {
    tickets, filtered, selected, loading, error, stats, filters, submitting,
    load, select, updateStatus, updateAgent, create, filter, resetFilters,
  };
}
