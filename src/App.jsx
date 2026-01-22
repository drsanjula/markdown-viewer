import { useState, useEffect, useRef } from 'react';
import { fileOpen, fileSave } from 'browser-fs-access';
import html2pdf from 'html2pdf.js';
import { FileText, Code, Check, Trash2, FolderOpen, Save, Download, FileCode, Columns, PenTool, Palette, Eye, Copy as CopyIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import EditorPane from './components/EditorPane';
import PreviewPane from './components/PreviewPane';
import Footer from './components/Footer';
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
- **Mermaid Diagrams**:
\`\`\`mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
\`\`\`
- **Math Equations**: $E = mc^2$
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
  const [viewMode, setViewMode] = useState('split');
  const [theme, setTheme] = useState('dark');
  const editorRef = useRef(null);
  const previewRef = useRef(null);
  const scrollingSource = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Save to local storage
    const saved = localStorage.getItem('mk-content');
    if (saved) setMarkdown(saved);
    const savedTheme = localStorage.getItem('mk-theme') || 'dark';
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mk-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const themes = ['dark', 'light', 'cyberpunk'];
    const nextTheme = themes[(themes.indexOf(theme) + 1) % themes.length];
    setTheme(nextTheme);
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setMarkdown(val);
    localStorage.setItem('mk-content', val);
  };

  const syncScroll = (source) => {
    const editor = editorRef.current?.querySelector('.editor-container') || editorRef.current;

    // For editor pane component, we might need to drill down or pass ref correctly
    // If using CodeMirror, scrolling is handled differently. Sticking to textarea for now via EditorPane passthrough

    // In our refactored component, editorRef is passed to the container div or textarea.
    // Let's assume editorRef points to the scrollable element in EditorPane

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

  const insertText = (before, after = '') => {
    // We need access to the textarea element. 
    // Since we refactored, we need to ensure editorRef points to the textarea
    // Currently editorRef is passed to EditorPane scrollRef.
    // Let's modify getting the textarea from the ref container

    const container = editorRef.current;
    if (!container) return;
    const textarea = container.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = markdown;
    const beforeText = text.substring(0, start);
    const selectText = text.substring(start, end);
    const afterText = text.substring(end);

    const newText = beforeText + before + selectText + after + afterText;
    setMarkdown(newText);
    localStorage.setItem('mk-content', newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
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
    const element = previewRef.current; // Ref now points to preview-content div
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
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
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
    const element = previewRef.current;
    if (!element) return;
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
          <div className="view-toggles" style={{ display: 'flex', gap: '4px', borderRight: '1px solid var(--glass-border)', paddingRight: '12px', marginRight: '4px' }}>
            <button className={`glass-button ${viewMode === 'editor' ? 'active' : ''}`} onClick={() => setViewMode('editor')} title="Editor Only">
              <PenTool size={16} />
            </button>
            <button className={`glass-button ${viewMode === 'split' ? 'active' : ''}`} onClick={() => setViewMode('split')} title="Split View">
              <Columns size={16} />
            </button>
            <button className={`glass-button ${viewMode === 'preview' ? 'active' : ''}`} onClick={() => setViewMode('preview')} title="Preview Only">
              <Eye size={16} />
            </button>
          </div>
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
            {copied ? <Check size={16} /> : <CopyIcon size={16} />}
            {copied ? 'Copied' : 'Copy Mardown'}
          </button>
          <button className="glass-button" onClick={toggleTheme} title={`Theme: ${theme}`}>
            <Palette size={16} />
          </button>
          <button className="glass-button" onClick={handleClear} style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
            <Trash2 size={16} />
            Clear
          </button>
        </div>
      </header>

      <main className="main-content">
        {(viewMode === 'split' || viewMode === 'editor') && (
          <motion.div
            className="pane-wrapper"
            style={{ flex: 1, display: 'flex', overflow: 'hidden' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <EditorPane
              content={markdown}
              onChange={handleChange}
              scrollRef={editorRef}
              onScroll={() => syncScroll('editor')}
              insertText={insertText}
            />
          </motion.div>
        )}

        {(viewMode === 'split' || viewMode === 'preview') && (
          <motion.div
            className="pane-wrapper"
            style={{ flex: 1, display: 'flex', overflow: 'hidden' }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <PreviewPane
              content={markdown}
              scrollRef={previewRef}
              onScroll={() => syncScroll('preview')}
            />
          </motion.div>
        )}
      </main>
      <Footer content={markdown} />
    </div>
  );
}

export default App;
