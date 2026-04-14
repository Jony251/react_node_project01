import React, { useState, useCallback } from 'react';
import styles from '../GameUI.module.css';

const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function makeQ() {
  const letter = ALPHA[Math.floor(Math.random() * ALPHA.length)];
  const lower = letter.toLowerCase();
  const pool = ALPHA.filter(l => l !== letter).sort(() => Math.random() - 0.5).slice(0, 3).map(l => l.toLowerCase());
  const opts = [lower, ...pool].sort(() => Math.random() - 0.5);
  return { letter, ans: lower, opts };
}

export default function UpperLower({ onScore }) {
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
      <p className={styles.question}>Find the lowercase version of:</p>
      <p style={{ fontSize: '5rem', fontWeight: 900, margin: '0.5rem 0 1.5rem', color: '#4ecdc4' }}>{q.letter}</p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {q.opts.map(o => (
          <button
            key={o}
            className={`${styles.choice} ${chosen ? (o === q.ans ? styles.correct : o === chosen ? styles.wrong : '') : ''}`}
            style={{ fontSize: '2.5rem', width: 80, height: 80 }}
            onClick={() => pick(o)}
          >{o}</button>
        ))}
      </div>
    </div>
  );
}
