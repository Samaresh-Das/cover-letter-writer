'use client';

import { Toaster } from 'react-hot-toast';

export default function AppToaster() {
  return (
    <Toaster
      position="top-center"
      gutter={12}
      containerStyle={{ top: 24 }}
      toastOptions={{
        duration: 3000,
        style: {
          background: '#1a1a2e',
          color: '#f0f0f5',
          fontSize: '14px',
          fontWeight: '500',
          borderRadius: '12px',
          padding: '14px 22px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          maxWidth: '440px',
          lineHeight: '1.5',
          letterSpacing: '-0.01em',
        },
        success: {
          iconTheme: {
            primary: '#22c55e',
            secondary: '#1a1a2e',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#1a1a2e',
          },
        },
      }}
    />
  );
}
