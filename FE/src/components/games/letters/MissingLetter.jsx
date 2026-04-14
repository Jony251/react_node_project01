import React, { useState, useCallback } from 'react';
import styles from '../GameUI.module.css';

const WORDS = ['CAT','DOG','SUN','FUN','BIG','RUN','PIG','HIT','MAP','RED','CUP','HEN','JAM','LIT','POT','TUB','WIG','YAK','ZIP','FOX'];

function makeQ() {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)];
  const hole = Math.floor(Math.random() * word.length);
  const ans = word[hole];
  const display = word.split('').map((l, i) => (i === hole ? '_' : l));
  const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(l => l !== ans);
  const wrong = pool.sort(() => Math.random() - 0.5).slice(0, 3);
  const opts = [ans, ...wrong].sort(() => Math.random() - 0.5);
  return { word, display, ans, opts };
}

export default function MissingLetter({ onScore }) {
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
      <p className={styles.question}>Fill the missing letter!</p>
      <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', margin: '1.2rem 0' }}>
        {q.display.map((l, i) => (
          <span key={i} style={{
            fontSize: '2.5rem', fontWeight: 900, width: 54, height: 60,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 10, background: l === '_' ? '#ffe66d' : '#e8f4ff',
            border: '3px solid', borderColor: l === '_' ? '#f39c12' : '#b3d7ff',
          }}>{l === '_' ? '?' : l}</span>
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
