import { useEffect, useState } from 'react';

export default function ErrorOverlay() {
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    function onError(e: ErrorEvent) {
      setMsg(`${e.message} at ${e.filename}:${e.lineno}:${e.colno}`);
      // also log stack if available
      // eslint-disable-next-line no-console
      console.error(e.error || e.message);
    }
    function onRejection(e: PromiseRejectionEvent) {
      setMsg(String(e.reason));
      // eslint-disable-next-line no-console
      console.error(e.reason);
    }
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection as any);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection as any);
    };
  }, []);

  if (!msg) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'start', justifyContent: 'center', padding: 20 }}>
      <div style={{ maxWidth: 900, width: '100%', background: 'rgba(17,23,38,0.95)', color: '#E6EAF2', padding: 20, borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.6)', fontFamily: 'monospace' }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Runtime error detected</div>
        <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{msg}</pre>
        <div style={{ marginTop: 12, textAlign: 'right' }}>
          <button onClick={() => location.reload()} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #28343f', background: '#111726', color: '#cfe5ff' }}>Reload</button>
        </div>
      </div>
    </div>
  );
}
