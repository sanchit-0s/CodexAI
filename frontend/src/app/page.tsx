"use client";

import { useState } from 'react';
import CodeInputBox from '@/components/CodeInputBox';
import RepoInputBox from '@/components/RepoInputBox';
import ChatPanel from '@/components/ChatPanel';

export default function Home() {
  const [dbStatus, setDbStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleIndexSuccess = (message: string) => {
    setDbStatus('success');
    setStatusMessage(message);
    setTimeout(() => {
      setDbStatus('idle');
      setStatusMessage('');
    }, 5000);
  };

  const handleIndexError = (message: string) => {
    setDbStatus('error');
    setStatusMessage(message);
  };

  return (
    <>
      <div className="top-bar">
        <h2>Dashboard</h2>
        {dbStatus !== 'idle' && (
          <div className={`status-badge ${dbStatus}`}>
            {statusMessage}
          </div>
        )}
      </div>

      <div className="content-area">
        <div className="input-panel">
          <RepoInputBox
            onSuccess={handleIndexSuccess}
            onError={handleIndexError}
          />
          <CodeInputBox
            onSuccess={handleIndexSuccess}
            onError={handleIndexError}
          />
        </div>

        <div className="review-panel">
          <ChatPanel />
        </div>
      </div>
    </>
  );
}
