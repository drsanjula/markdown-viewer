import React from 'react';
import '../App.css';

const Footer = ({ content }) => {
    const wordCount = content.split(/\s+/).filter(Boolean).length;
    const charCount = content.length;
    const readTime = Math.ceil(wordCount / 200);

    return (
        <footer className="footer">
            <div className="stats-container">
                <div className="stats-item">
                    <span>Words:</span> {wordCount}
                </div>
                <div className="stats-item">
                    <span>Chars:</span> {charCount}
                </div>
                <div className="stats-item">
                    <span>Reading Time:</span> {readTime} min
                </div>
            </div>
            <div className="branding">
                Made by <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>Sanju</span>
            </div>
        </footer>
    );
};

export default Footer;
