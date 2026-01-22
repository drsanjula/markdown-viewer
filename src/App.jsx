import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FileText, Eye, Code, Copy, Check, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const defaultMarkdown = `# Welcome to Modern Markdown
Start typing to see the magic happen...

## Features
- **Live Preview**: See changes instantly
- **Syntax Highlighting**:
\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`
- **GitHub Flavored**: Tables, tasks, and more!
- **Glassmorphism UI**: Beautiful, modern design.

## Try it out
| Feature | Status |
| :--- | :--- |
| Modern UI | ✅ Ready |
| Animations | ✅ Smooth |
| Dark Mode | ✅ Native |

> "Clean code always looks like it was written by someone who cares."
`;

function App() {
  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Save to local storage
    const saved = localStorage.getItem('mk-content');
    if (saved) setMarkdown(saved);
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setMarkdown(val);
    localStorage.setItem('mk-content', val);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear the editor?')) {
      setMarkdown('');
      localStorage.setItem('mk-content', '');
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="brand">
          <FileText className="text-indigo-400" size={24} />
          <span>Markdown<span style={{ color: 'var(--accent-primary)' }}>View</span></span>
        </div>

        <div className="action-bar">
          <button className="glass-button" onClick={handleCopy}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy Markdown'}
          </button>
          <button className="glass-button" onClick={handleClear} style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
            <Trash2 size={16} />
            Clear
          </button>
        </div>
      </header>

      <main className="main-content">
        <motion.div
          className="pane editor-pane"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="pane-header">
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Code size={16} color="var(--accent-secondary)" /> EDITOR
            </span>
            <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>{markdown.length} chars</span>
          </div>
          <textarea
            className="editor-textarea"
            value={markdown}
            onChange={handleChange}
            placeholder="Type your markdown here..."
            spellCheck="false"
          />
        </motion.div>

        <motion.div
          className="pane preview-pane"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="pane-header">
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={16} color="var(--accent-primary)" /> PREVIEW
            </span>
          </div>
          <div className="preview-content">
            <ReactMarkdown
              children={markdown}
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
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
        </motion.div>
      </main>
    </div>
  );
}

export default App;
