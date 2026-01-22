import React, { useState } from 'react';
import { X, Send, MessageSquare } from 'lucide-react';
import '../App.css';

const FeedbackModal = ({ isOpen, onClose }) => {
    const [message, setMessage] = useState('');

    if (!isOpen) return null;

    const handleSend = () => {
        const subject = encodeURIComponent('Feedback for Markdown Viewer');
        const body = encodeURIComponent(message);
        window.location.href = `mailto:sanjulajayasinghe1@gmail.com?subject=${subject}&body=${body}`;
        onClose();
        setMessage('');
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3><MessageSquare size={18} /> Send Feedback</h3>
                    <button className="icon-btn" onClick={onClose}><X size={18} /></button>
                </div>
                <div className="modal-body">
                    <textarea
                        className="feedback-textarea"
                        placeholder="What do you think? Report bugs or suggest features..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        autoFocus
                    />
                </div>
                <div className="modal-footer">
                    <button className="glass-button" onClick={onClose}>Cancel</button>
                    <button className="glass-button active" onClick={handleSend}>
                        <Send size={16} /> Send Email
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackModal;
