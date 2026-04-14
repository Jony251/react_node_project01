import React, { useState, useCallback } from 'react';
import styles from '../GameUI.module.css';

const RHYMES = [
  { word: 'CAT', correct: 'HAT', wrongs: ['DOG','SUN','MAP'] },
  { word: 'FUN', correct: 'RUN', wrongs: ['CAT','BOX','PIG'] },
  { word: 'TREE', correct: 'BEE', wrongs: ['CAR','MOP','JAM'] },
  { word: 'CAKE', correct: 'LAKE', wrongs: ['CUP','HEN','FOX'] },
  { word: 'STAR', correct: 'CAR', wrongs: ['DOG','PIG','BEE'] },
  { word: 'BLUE', correct: 'SHOE', wrongs: ['RED','CAT','MOP'] },
  { word: 'KING', correct: 'RING', wrongs: ['LOG','CAP','JET'] },
  { word: 'BALL', correct: 'WALL', wrongs: ['DOG','CUP','FLY'] },
  { word: 'NIGHT', correct: 'LIGHT', wrongs: ['DAY','CAR','MAP'] },
  { word: 'BEAR', correct: 'PEAR', wrongs: ['CAT','FLY','BOX'] },
];

function makeQ() {
  const r = RHYMES[Math.floor(Math.random() * RHYMES.length)];
  const opts = [r.correct, ...r.wrongs].sort(() => Math.random() - 0.5);
  return { ...r, opts };
}

export default function RhymeTime({ onScore }) {
  const [q, setQ] = useState(makeQ);
  const [chosen, setChosen] = useState(null);

  const pick = useCallback(opt => {
    if (chosen) return;
    setChosen(opt);
    if (opt === q.correct) onScore(10);
    setTimeout(() => { setQ(makeQ()); setChosen(null); }, 1100);
  }, [chosen, q, onScore]);

  return (
    <div className={styles.game}>
      <p className={styles.question}>Which word rhymes with:</p>
      <p style={{ fontSize: '3.5rem', fontWeight: 900, color: '#4ecdc4', margin: '0.5rem 0 1.5rem' }}>{q.word}</p>
      <div className={styles.choices}>
        {q.opts.map(o => (
          <button
            key={o}
            className={`${styles.choice} ${chosen ? (o === q.correct ? styles.correct : o === chosen ? styles.wrong : '') : ''}`}
            onClick={() => pick(o)}
          >{o}</button>
        ))}
      </div>
    </div>
  );
}
