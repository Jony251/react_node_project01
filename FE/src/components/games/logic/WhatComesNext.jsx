import React, { useState, useCallback } from 'react';
import styles from '../GameUI.module.css';

const SEQS = [
  { seq: [1, 2, 3, 4, 5], ans: 6, wrongs: [7, 8, 9] },
  { seq: [2, 4, 6, 8, 10], ans: 12, wrongs: [11, 13, 14] },
  { seq: [1, 3, 5, 7, 9], ans: 11, wrongs: [10, 12, 13] },
  { seq: [5, 10, 15, 20, 25], ans: 30, wrongs: [28, 32, 35] },
  { seq: [1, 4, 9, 16, 25], ans: 36, wrongs: [30, 49, 32] },
  { seq: [2, 4, 8, 16, 32], ans: 64, wrongs: [48, 60, 66] },
  { seq: [100, 90, 80, 70, 60], ans: 50, wrongs: [40, 55, 45] },
  { seq: [3, 6, 9, 12, 15], ans: 18, wrongs: [16, 19, 20] },
];

function makeQ() {
  const s = SEQS[Math.floor(Math.random() * SEQS.length)];
  const opts = [s.ans, ...s.wrongs].sort(() => Math.random() - 0.5);
  return { ...s, opts };
}

export default function WhatComesNext({ onScore }) {
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
      <p className={styles.question}>What number comes next?</p>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', margin: '1rem 0' }}>
        {q.seq.map((n, i) => (
          <span key={i} style={{
            fontSize: '1.8rem', fontWeight: 900,
            width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#e8f4ff', borderRadius: 12, border: '2px solid #b3d7ff',
          }}>{n}</span>
        ))}
        <span style={{
          fontSize: '1.8rem', fontWeight: 900, width: 56, height: 56,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#ffe66d', borderRadius: 12, border: '2px solid #f39c12',
        }}>?</span>
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
