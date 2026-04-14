import React, { useState, useCallback } from 'react';
import styles from '../GameUI.module.css';

const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function makeQ() {
  const start = Math.floor(Math.random() * 20);
  const seq = ALPHA.slice(start, start + 5);
  const hole = 1 + Math.floor(Math.random() * 3);
  const ans = seq[hole];
  const display = seq.map((l, i) => (i === hole ? '?' : l));
  const opts = new Set([ans]);
  while (opts.size < 4) {
    const idx = Math.floor(Math.random() * ALPHA.length);
    opts.add(ALPHA[idx]);
  }
  return { display, ans, opts: [...opts].sort(() => Math.random() - 0.5) };
}

export default function AbcOrder({ onScore }) {
  const [q, setQ] = useState(makeQ);
  const [chosen, setChosen] = useState(null);

  const pick = useCallback(opt => {
    if (chosen) return;
    setChosen(opt);
    if (opt === q.ans) onScore(10);
    setTimeout(() => { setQ(makeQ()); setChosen(null); }, 1100);
  }, [chosen, q, onScore]);

  return (
    <div className={styles.game}>
      <p className={styles.question}>Fill in the missing letter!</p>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', margin: '1.2rem 0' }}>
        {q.display.map((l, i) => (
          <span key={i} style={{
            fontSize: '2rem', fontWeight: 900, width: 56, height: 56,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 12, background: l === '?' ? '#ffe66d' : '#e8f4ff',
            border: '3px solid', borderColor: l === '?' ? '#f39c12' : '#b3d7ff',
          }}>{l}</span>
        ))}
      </div>
      <div className={styles.choices}>
        {q.opts.map(o => (
          <button
            key={o}
            className={`${styles.choice} ${chosen ? (o === q.ans ? styles.correct : o === chosen ? styles.wrong : '') : ''}`}
            onClick={() => pick(o)}
          >{o}</button>
        ))}
      </div>
    </div>
  );
}
