import React, { useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
import { Code, Bold, Italic, List, ListOrdered, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import '../App.css';

const EditorPane = ({ content, onChange, scrollRef, onScroll, insertText }) => {
    return (
        <div className="pane editor-pane">
            <div className="pane-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Code size={16} color="var(--accent-secondary)" /> EDITOR
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                    <button className="icon-btn" onClick={() => insertText('**', '**')} title="Bold"><Bold size={14} /></button>
                    <button className="icon-btn" onClick={() => insertText('*', '*')} title="Italic"><Italic size={14} /></button>
                    <button className="icon-btn" onClick={() => insertText('- ')} title="List"><List size={14} /></button>
                    <button className="icon-btn" onClick={() => insertText('1. ')} title="Ordered List"><ListOrdered size={14} /></button>
                    <button className="icon-btn" onClick={() => insertText('[', '](url)')} title="Link"><LinkIcon size={14} /></button>
                    <button className="icon-btn" onClick={() => insertText('![alt](', ')')} title="Image"><ImageIcon size={14} /></button>
                </div>
                <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>{content.length} chars</span>
            </div>
            <div className="editor-container" ref={scrollRef} onScroll={onScroll} style={{ height: '100%', overflow: 'auto' }}>
                <textarea
                    className="editor-textarea"
                    value={content}
                    onChange={onChange}
                    placeholder="Type your markdown here..."
                    spellCheck="false"
                />
            </div>
        </div>
    );
};

export default EditorPane;
