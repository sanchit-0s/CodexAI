"use client";

import { useEffect, useState } from 'react';

type Session = {
    id: number;
    question: string;
    response: string;
    timestamp: string;
};

export default function Sidebar() {
    const [history, setHistory] = useState<Session[]>([]);

    useEffect(() => {
        fetchHistory();
        const interval = setInterval(fetchHistory, 10000); // refresh every 10s
        return () => clearInterval(interval);
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await fetch('http://localhost:8000/history');
            if (res.ok) {
                const data = await res.json();
                setHistory(data.history);
            }
        } catch (e) {
            console.error("Failed to fetch history.");
        }
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h1 className="sidebar-title">CodexAI</h1>
                <p className="sidebar-subtitle">RAG AI Code Reviewer</p>
            </div>
            <div className="sidebar-content">
                <div className="section-title" style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                    Review History
                </div>
                {history.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No past reviews yet.</p>
                ) : (
                    history.map((session) => (
                        <div key={session.id} className="history-item">
                            <div className="history-question">{session.question}</div>
                            <div className="history-time">{new Date(session.timestamp).toLocaleString(undefined, {
                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}</div>
                        </div>
                    ))
                )}
            </div>
        </aside>
    );
}
