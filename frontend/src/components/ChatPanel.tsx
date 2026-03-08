"use client";

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Message = {
    role: 'user' | 'ai';
    content: string;
};

export default function ChatPanel() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'ai', content: 'Hello! I am CodexAI, your RAG-powered code reviewer. Once you have indexed some code or a repository, ask me to review it, find bugs, or explain functions!' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);

        try {
            const res = await fetch('http://localhost:8000/ask-review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: userMsg })
            });
            const data = await res.json();

            if (res.ok) {
                setMessages(prev => [...prev, { role: 'ai', content: data.response }]);
            } else {
                setMessages(prev => [...prev, { role: 'ai', content: `Error: ${data.detail || 'Failed to get response'}` }]);
            }
        } catch (e) {
            setMessages(prev => [...prev, { role: 'ai', content: `Network Error: Could not connect to API server. Ensure the FastAPI backend is running.` }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="chat-container">
                {messages.map((m, i) => (
                    <div key={i} className={`message ${m.role}`}>
                        {m.role === 'ai' ? (
                            <div className="markdown-content">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {m.content}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            <div>{m.content}</div>
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="message ai">
                        <span className="loader" style={{ width: '1rem', height: '1rem', borderWidth: '2px', marginRight: '0.5rem' }}></span>
                        <span style={{ verticalAlign: 'top', color: 'var(--text-secondary)' }}>Analyzing context...</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
                <div className="chat-input-wrapper">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask a question or request a review..."
                        disabled={isLoading}
                    />
                    <button onClick={handleSend} disabled={isLoading || !input.trim()}>
                        Send Review Query
                    </button>
                </div>
            </div>
        </>
    );
}
