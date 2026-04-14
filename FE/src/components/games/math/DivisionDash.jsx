import React, { useState, useCallback } from 'react';
import styles from '../GameUI.module.css';

const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

function makeQ() {
  const ans = rand(1, 10);
  const b = rand(2, 10);
  const a = ans * b;
  const opts = new Set([ans]);
  while (opts.size < 4) opts.add(rand(Math.max(1, ans - 5), ans + 5));
  return { a, b, ans, opts: [...opts].sort(() => Math.random() - 0.5) };
}

export default function DivisionDash({ onScore }) {
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
      <p className={styles.question}><span className={styles.big}>{q.a} ÷ {q.b} = ?</span></p>
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
