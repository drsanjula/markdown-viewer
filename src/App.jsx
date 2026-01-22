import { useState, useEffect, useRef } from 'react';
import { fileOpen, fileSave } from 'browser-fs-access';
import html2pdf from 'html2pdf.js';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FileText, Eye, Code, Copy, Check, Trash2, FolderOpen, Save, Download, FileCode } from 'lucide-react';
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
  const editorRef = useRef(null);
  const previewRef = useRef(null);
  const scrollingSource = useRef(null);
  const timeoutRef = useRef(null);

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

  const syncScroll = (source) => {
    const editor = editorRef.current;
    const preview = previewRef.current;
    if (!editor || !preview) return;

    if (scrollingSource.current && scrollingSource.current !== source) return;
    scrollingSource.current = source;

    if (source === 'editor') {
      const percentage = editor.scrollTop / (editor.scrollHeight - editor.clientHeight);
      preview.scrollTop = percentage * (preview.scrollHeight - preview.clientHeight);
    } else {
      const percentage = preview.scrollTop / (preview.scrollHeight - preview.clientHeight);
      editor.scrollTop = percentage * (editor.scrollHeight - editor.clientHeight);
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      scrollingSource.current = null;
    }, 100);
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

  const handleOpen = async () => {
    try {
      const blob = await fileOpen({
        mimeTypes: ['text/markdown', 'text/plain'],
        extensions: ['.md', '.markdown', '.txt'],
        description: 'Markdown Files',
      });
      const text = await blob.text();
      setMarkdown(text);
      localStorage.setItem('mk-content', text);
    } catch (err) {
      if (err.name !== 'AbortError') console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      const blob = new Blob([markdown], { type: 'text/markdown' });
      await fileSave(blob, {
        fileName: 'document.md',
        extensions: ['.md', '.markdown'],
        description: 'Markdown File',
      });
    } catch (err) {
      if (err.name !== 'AbortError') console.error(err);
    }
  };

  const handleExportHTML = () => {
    const element = document.querySelector('.preview-content');
    if (!element) return;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Exported Markdown</title>
<style>
body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 2rem; color: #333; }
img { max-width: 100%; border-radius: 8px; }
pre { background: #f4f4f5; padding: 1rem; border-radius: 4px; overflow-x: auto; }
code { background: #f4f4f5; padding: 0.2rem 0.4rem; border-radius: 4px; font-family: monospace; }
blockquote { border-left: 4px solid #e5e7eb; margin: 0; padding-left: 1rem; color: #6b7280; }
table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
th, td { border: 1px solid #e5e7eb; padding: 0.5rem; text-align: left; }
th { background: #f9fafb; }
a { color: #6366f1; text-decoration: none; }
a:hover { text-decoration: underline; }
</style>
</head>
<body>
${element.innerHTML}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const element = document.querySelector('.preview-content');
    const opt = {
      margin: 1,
      filename: 'document.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="brand">
          <FileText className="text-indigo-400" size={24} />
          <span>Markdown<span style={{ color: 'var(--accent-primary)' }}>View</span></span>
        </div>

        <div className="action-bar">
          <button className="glass-button" onClick={handleOpen}>
            <FolderOpen size={16} />
            Open
          </button>
          <button className="glass-button" onClick={handleSave}>
            <Save size={16} />
            Save
          </button>
          <button className="glass-button" onClick={handleExportPDF}>
            <Download size={16} />
            PDF
          </button>
          <button className="glass-button" onClick={handleExportHTML}>
            <FileCode size={16} />
            HTML
          </button>
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
            ref={editorRef}
            onScroll={() => syncScroll('editor')}
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
          <div
            className="preview-content"
            ref={previewRef}
            onScroll={() => syncScroll('preview')}
          >
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
