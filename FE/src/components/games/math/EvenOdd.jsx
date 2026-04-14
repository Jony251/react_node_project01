import React, { useState, useCallback } from 'react';
import styles from '../GameUI.module.css';

const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

function makeQ() {
  const n = rand(1, 50);
  return { n, ans: n % 2 === 0 ? 'Even' : 'Odd' };
}

export default function EvenOdd({ onScore }) {
  const [q, setQ] = useState(makeQ);
  const [chosen, setChosen] = useState(null);
  const [round, setRound] = useState(1);

  const pick = useCallback(opt => {
    if (chosen !== null) return;
    setChosen(opt);
    if (opt === q.ans) onScore(10);
    setTimeout(() => { setQ(makeQ()); setChosen(null); setRound(r => r + 1); }, 1100);
  }, [chosen, q, onScore]);

  return (
    <div className={styles.game}>
      <p className={styles.progress}>Round {round}</p>
      <p className={styles.question}>Is this number Even or Odd?</p>
      <p className={styles.big} style={{ margin: '1.2rem 0' }}>{q.n}</p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        {['Even', 'Odd'].map(opt => (
          <button
            key={opt}
            className={`${styles.choice} ${chosen !== null ? (opt === q.ans ? styles.correct : opt === chosen ? styles.wrong : '') : ''}`}
            style={{ fontSize: '1.4rem', padding: '0.8rem 2.5rem' }}
            onClick={() => pick(opt)}
          >{opt}</button>
        ))}
      </div>
    </div>
  );
}
