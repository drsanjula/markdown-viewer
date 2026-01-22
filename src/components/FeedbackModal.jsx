import React, { useState } from 'react';
import { X, Send, Github, MessageSquare, Bug, Lightbulb } from 'lucide-react';
import '../App.css';

const FeedbackModal = ({ isOpen, onClose }) => {
    const [type, setType] = useState('feature');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const repoUrl = 'https://github.com/drsanjula/markdown-viewer/issues/new';
        const body = encodeURIComponent(`**Type:** ${type}\n\n**Description:**\n${description}`);
        const encodedTitle = encodeURIComponent(`[${type.toUpperCase()}] ${title}`);

        // Open GitHub new issue in new tab
        window.open(`${repoUrl}?title=${encodedTitle}&body=${body}`, '_blank');
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3><MessageSquare size={20} className="text-secondary" /> Send Feedback</h3>
                    <button className="icon-btn close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="feedback-form">
                    <div className="form-group">
                        <label>Feedback Type</label>
                        <div className="type-selector">
                            <button
                                type="button"
                                className={`type-btn ${type === 'feature' ? 'active' : ''}`}
                                onClick={() => setType('feature')}
                            >
                                <Lightbulb size={16} /> Feature Request
                            </button>
                            <button
                                type="button"
                                className={`type-btn ${type === 'bug' ? 'active' : ''}`}
                                onClick={() => setType('bug')}
                            >
                                <Bug size={16} /> Bug Report
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Short summary..."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="desc">Description</label>
                        <textarea
                            id="desc"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Detailed explanation..."
                            rows={4}
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <p className="note">This will open a GitHub issue draft.</p>
                        <button type="submit" className="glass-button primary-btn">
                            <Github size={16} />
                            Continue to GitHub
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FeedbackModal;
