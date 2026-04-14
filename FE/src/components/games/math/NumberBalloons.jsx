import React, { useState, useCallback } from 'react';
import styles from '../GameUI.module.css';

const COLORS = ['#ff6b35','#4ecdc4','#ffe66d','#9b59b6','#2ecc71','#e74c3c'];
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

function makeQ() {
  const a = rand(1, 15), b = rand(1, 15);
  const ans = a + b;
  const opts = new Set([ans]);
  while (opts.size < 4) opts.add(rand(Math.max(2, ans - 8), ans + 8));
  return { a, b, ans, opts: [...opts].sort(() => Math.random() - 0.5) };
}

export default function NumberBalloons({ onScore }) {
  const [q, setQ] = useState(makeQ);
  const [chosen, setChosen] = useState(null);

  const pop = useCallback(opt => {
    if (chosen !== null) return;
    setChosen(opt);
    if (opt === q.ans) onScore(10);
    setTimeout(() => { setQ(makeQ()); setChosen(null); }, 1100);
  }, [chosen, q, onScore]);

  return (
    <div className={styles.game}>
      <p className={styles.question}>Pop the balloon with the right answer!</p>
      <p className={styles.big} style={{ marginBottom: '1.5rem' }}>{q.a} + {q.b}</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        {q.opts.map((o, i) => (
          <button
            key={o}
            onClick={() => pop(o)}
            style={{
              fontSize: '1.4rem',
              fontWeight: 900,
              width: 90,
              height: 90,
              borderRadius: '50%',
              border: 'none',
              background: chosen !== null ? (o === q.ans ? '#2ecc71' : o === chosen ? '#e74c3c' : COLORS[i % COLORS.length]) : COLORS[i % COLORS.length],
              color: '#fff',
              cursor: chosen ? 'default' : 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
              transform: chosen === o ? 'scale(0.88)' : 'scale(1)',
              transition: 'all 0.2s',
              fontFamily: 'var(--font-family)',
            }}
          >
            🎈<br />{o}
          </button>
        ))}
      </div>
    </div>
  );
}
