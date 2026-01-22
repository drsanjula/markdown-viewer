import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    securityLevel: 'strict',
    fontFamily: 'Inter, sans-serif'
});

const Mermaid = ({ chart }) => {
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current && chart) {
            const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
            mermaid.render(id, chart).then(({ svg }) => {
                if (ref.current) {
                    ref.current.innerHTML = svg;
                }
            }).catch((error) => {
                console.error('Mermaid render error:', error);
                if (ref.current) {
                    ref.current.innerHTML = `<div style="color: #ef4444; padding: 1rem; border: 1px solid #ef4444; border-radius: 0.5rem;">Failed to render diagram: ${error.message}</div>`;
                }
            });
        }
    }, [chart]);

    return <div className="mermaid-diagram" ref={ref} style={{ textAlign: 'center', margin: '1.5rem 0' }} />;
};

export default Mermaid;
