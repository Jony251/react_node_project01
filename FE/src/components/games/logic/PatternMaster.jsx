import React, { useState, useCallback } from 'react';
import styles from '../GameUI.module.css';

const PATTERNS = [
  { seq: ['🔴','🔵','🔴','🔵','🔴'], ans: '🔵' },
  { seq: ['⭐','🌙','⭐','🌙','⭐'], ans: '🌙' },
  { seq: ['🟡','🟡','🔴','🟡','🟡'], ans: '🔴' },
  { seq: ['🐱','🐶','🐱','🐶','🐱'], ans: '🐶' },
  { seq: ['🍎','🍊','🍋','🍎','🍊'], ans: '🍋' },
  { seq: ['🔺','🔶','🔺','🔶','🔺'], ans: '🔶' },
  { seq: ['1️⃣','2️⃣','3️⃣','1️⃣','2️⃣'], ans: '3️⃣' },
  { seq: ['🏠','🚗','🏠','🚗','🏠'], ans: '🚗' },
];

function makeQ() {
  const p = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];
  const pool = PATTERNS.map(x => x.ans).filter(a => a !== p.ans);
  const opts = [p.ans, ...pool.sort(() => Math.random() - 0.5).slice(0, 3)].sort(() => Math.random() - 0.5);
  return { ...p, opts };
}

export default function PatternMaster({ onScore }) {
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
      <p className={styles.question}>What comes next?</p>
      <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap', margin: '1rem 0' }}>
        {q.seq.map((s, i) => (
          <span key={i} style={{ fontSize: '2.4rem' }}>{s}</span>
        ))}
        <span style={{ fontSize: '2.4rem', background: '#ffe66d', borderRadius: 10, padding: '0 8px' }}>?</span>
      </div>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {q.opts.map(o => (
          <button
            key={o}
            className={`${styles.choice} ${chosen ? (o === q.ans ? styles.correct : o === chosen ? styles.wrong : '') : ''}`}
            style={{ fontSize: '2.2rem', width: 76, height: 76 }}
            onClick={() => pick(o)}
          >{o}</button>
        ))}
      </div>
    </div>
  );
}
