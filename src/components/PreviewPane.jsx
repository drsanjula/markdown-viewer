import React, { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Eye } from 'lucide-react';
import Mermaid from './Mermaid';
import '../App.css';

const PreviewPane = ({ content, scrollRef, onScroll }) => {
    return (
        <div className="pane preview-pane">
            <div className="pane-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Eye size={16} color="var(--accent-primary)" /> PREVIEW
                </span>
            </div>
            <div
                className="preview-content"
                ref={scrollRef}
                onScroll={onScroll}
            >
                <ReactMarkdown
                    children={content}
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                        code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '')
                            if (!inline && match && match[1] === 'mermaid') {
                                return <Mermaid chart={String(children).replace(/\n$/, '')} />;
                            }
                            return !inline && match ? (
                                <SyntaxHighlighter
                                    {...props}
                                    children={String(children).replace(/\n$/, '')}
                                    style={vscDarkPlus}
                                    language={match[1]}
                                    PreTag="div"
                                    customStyle={{
                                        background: 'transparent',
                                        padding: '1.5em',
                                        borderRadius: '0.5em',
                                        border: '1px solid var(--border-color)',
                                    }}
                                />
                            ) : (
                                <code {...props} className={className}>
                                    {children}
                                </code>
                            )
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default PreviewPane;
