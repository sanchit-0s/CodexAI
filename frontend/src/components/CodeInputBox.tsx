"use client";

import { useState, useRef } from 'react';

export default function CodeInputBox({
    onSuccess,
    onError
}: {
    onSuccess: (msg: string) => void,
    onError: (msg: string) => void
}) {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async () => {
        if (!code.trim()) return;
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:8000/upload-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            });
            const data = await res.json();
            if (res.ok) {
                onSuccess(data.message || 'Code embedded successfully!');
                setCode('');
            } else {
                onError(data.detail || 'Failed to upload code');
            }
        } catch (e) {
            onError('Error connecting to backend API. Is the server running?');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            const separator = code.trim() ? '\n\n' : '';
            setCode(prev => prev + separator + `// File: ${file.name}\n` + content);
        };
        reader.readAsText(file);

        // reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="section-title">Upload / Paste Code</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Paste code snippets or upload a file directly to the RAG context.
            </p>
            <div className="input-group" style={{ flex: 1 }}>
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="// Paste your code here..."
                    style={{ flex: 1, minHeight: '200px' }}
                />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={handleSubmit} disabled={isLoading || !code.trim()} style={{ flex: 1 }}>
                    {isLoading ? <span className="loader"></span> : 'Index Context'}
                </button>

                <div className="file-upload-wrapper" style={{ flex: 1 }}>
                    <button className="secondary" style={{ width: '100%', pointerEvents: 'none' }}>
                        Upload File
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept=".py,.js,.ts,.tsx,.jsx,.md,.txt,.json,.html,.css,.java,.c,.cpp"
                    />
                </div>
            </div>
        </div>
    );
}
