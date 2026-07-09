import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { selectToast, clearToast } from '../../store/uiSlice';

const ICONS = {
  success: <CheckCircle size={16} aria-hidden="true" />,
  error:   <XCircle    size={16} aria-hidden="true" />,
  info:    <Info       size={16} aria-hidden="true" />,
};

export default function Toast() {
  const dispatch = useDispatch();
  const toast    = useSelector(selectToast);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => dispatch(clearToast()), 3000);
    return () => clearTimeout(timer);
  }, [toast, dispatch]);

  if (!toast) return null;

  return (
    <div className="toast-container" role="status" aria-live="polite">
      <div className={`toast toast-${toast.type || 'success'}`}>
        {ICONS[toast.type || 'success']}
        <span>{toast.message}</span>
        <button
          onClick={() => dispatch(clearToast())}
          style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', padding: 0 }}
          aria-label="Dismiss notification"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
