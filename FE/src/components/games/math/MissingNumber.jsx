import React, { useState, useCallback } from 'react';
import styles from '../GameUI.module.css';

const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

function makeQ() {
  const start = rand(1, 30);
  const step = rand(1, 5);
  const seq = [0, 1, 2, 3, 4].map(i => start + i * step);
  const hole = rand(1, 3);
  const ans = seq[hole];
  const display = seq.map((v, i) => (i === hole ? '?' : v));
  const opts = new Set([ans]);
  while (opts.size < 4) opts.add(rand(Math.max(1, ans - step * 3), ans + step * 3));
  return { display, ans, opts: [...opts].sort(() => Math.random() - 0.5) };
}

export default function MissingNumber({ onScore }) {
  const [q, setQ] = useState(makeQ);
  const [chosen, setChosen] = useState(null);

  const pick = useCallback(opt => {
    if (chosen !== null) return;
    setChosen(opt);
    if (opt === q.ans) onScore(10);
    setTimeout(() => { setQ(makeQ()); setChosen(null); }, 1100);
  }, [chosen, q, onScore]);

  return (
    <div className={styles.game}>
      <p className={styles.question}>Find the missing number!</p>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', margin: '1.2rem 0', flexWrap: 'wrap' }}>
        {q.display.map((v, i) => (
          <span
            key={i}
            style={{
              fontSize: '2rem',
              fontWeight: 900,
              width: 60,
              height: 60,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 12,
              background: v === '?' ? '#ffe66d' : '#f0f4ff',
              border: '3px solid',
              borderColor: v === '?' ? '#f39c12' : '#c5d0ff',
            }}
          >{v}</span>
        ))}
      </div>
      <div className={styles.choices}>
        {q.opts.map(o => (
          <button
            key={o}
            className={`${styles.choice} ${chosen !== null ? (o === q.ans ? styles.correct : o === chosen ? styles.wrong : '') : ''}`}
            onClick={() => pick(o)}
          >{o}</button>
        ))}
      </div>
    </div>
  );
}
