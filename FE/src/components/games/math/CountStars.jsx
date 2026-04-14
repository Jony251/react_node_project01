import React, { useState, useCallback } from 'react';
import styles from '../GameUI.module.css';

const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

function makeQ() {
  const count = rand(1, 15);
  return { count, stars: '⭐'.repeat(count) };
}

export default function CountStars({ onScore }) {
  const [q, setQ] = useState(makeQ);
  const [input, setInput] = useState('');
  const [fb, setFb] = useState('');
  const [round, setRound] = useState(1);

  const check = useCallback(() => {
    if (parseInt(input) === q.count) {
      setFb('✅ Correct!');
      onScore(10);
    } else {
      setFb(`❌ It was ${q.count}`);
    }
    setTimeout(() => {
      setQ(makeQ());
      setInput('');
      setFb('');
      setRound(r => r + 1);
    }, 1200);
  }, [input, q, onScore]);

  return (
    <div className={styles.game}>
      <p className={styles.progress}>Round {round}</p>
      <p className={styles.question}>How many stars?</p>
      <div style={{ fontSize: '1.6rem', wordBreak: 'break-all', letterSpacing: '2px', margin: '1rem 0' }}>
        {q.stars}
      </div>
      <input
        className={styles.input}
        type="number"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && input && check()}
        min={1} max={20}
        autoFocus
      />
      <br />
      <button className={styles.submitBtn} onClick={check} disabled={!input}>Check</button>
      <div className={`${styles.feedback} ${fb.startsWith('✅') ? styles.ok : fb ? styles.no : ''}`}>{fb}</div>
    </div>
  );
}
