import React, { useState, useCallback } from 'react';
import styles from '../GameUI.module.css';

const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

function makeQ() {
  const a = rand(1, 50), b = rand(1, 50);
  return { a, b, ans: a > b ? '>' : a < b ? '<' : '=' };
}

export default function CompareNumbers({ onScore }) {
  const [q, setQ] = useState(makeQ);
  const [chosen, setChosen] = useState(null);
  const [round, setRound] = useState(1);

  const pick = useCallback(sym => {
    if (chosen !== null) return;
    setChosen(sym);
    if (sym === q.ans) onScore(10);
    setTimeout(() => { setQ(makeQ()); setChosen(null); setRound(r => r + 1); }, 1100);
  }, [chosen, q, onScore]);

  return (
    <div className={styles.game}>
      <p className={styles.progress}>Round {round}</p>
      <p className={styles.question}>Which sign goes in the middle?</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', margin: '1rem 0' }}>
        <span style={{ fontSize: '3rem', fontWeight: 900 }}>{q.a}</span>
        <span style={{ fontSize: '3rem', fontWeight: 900, color: '#9b59b6', minWidth: 60, textAlign: 'center' }}>
          {chosen ? q.ans : '?'}
        </span>
        <span style={{ fontSize: '3rem', fontWeight: 900 }}>{q.b}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
        {['<', '=', '>'].map(s => (
          <button
            key={s}
            className={`${styles.choice} ${chosen !== null ? (s === q.ans ? styles.correct : s === chosen ? styles.wrong : '') : ''}`}
            style={{ fontSize: '2rem', width: 70, height: 70 }}
            onClick={() => pick(s)}
          >{s}</button>
        ))}
      </div>
    </div>
  );
}
