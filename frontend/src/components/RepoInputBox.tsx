"use client";

import { useState } from 'react';

export default function RepoInputBox({
    onSuccess,
    onError
}: {
    onSuccess: (msg: string) => void,
    onError: (msg: string) => void
}) {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!url.trim()) return;
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:8000/analyze-repo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });
            const data = await res.json();
            if (res.ok) {
                onSuccess(data.message || 'Repository successfully indexed!');
                setUrl('');
            } else {
                onError(data.detail || 'Failed to analyze repository');
            }
        } catch (e) {
            onError('Error connecting to backend API. Is the server running?');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="card">
            <div className="section-title">GitHub Repository</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Clone a public repository to index its entire source code.
            </p>
            <div className="input-group">
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://github.com/username/repo"
                />
            </div>
            <button
                onClick={handleSubmit}
                disabled={isLoading || !url.trim()}
                style={{ width: '100%', marginTop: '0.5rem' }}
            >
                {isLoading ? <span className="loader"></span> : 'Clone & Analyze'}
            </button>
        </div>
    );
}
