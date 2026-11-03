// Toast Notification Component
import React from 'react';

const Toast = ({ toasts = [], onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast ${t.type === 'error' ? 'toast-error' : 'toast-success'}`}
          onClick={() => onDismiss(t.id)}
        >
          <span>{t.type === 'error' ? '⚠️' : '✓'}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
};

export default Toast;

