import React, { useState, useCallback } from 'react';
import styles from '../GameUI.module.css';

const FACTS = [
  { fact: 'The Earth is round.', ans: true },
  { fact: 'Fish can breathe underwater.', ans: true },
  { fact: 'The sun is a planet.', ans: false },
  { fact: 'Dolphins are mammals.', ans: true },
  { fact: 'Spiders are insects.', ans: false },
  { fact: 'The moon produces its own light.', ans: false },
  { fact: 'Water boils at 100°C.', ans: true },
  { fact: 'Antarctica is the largest continent.', ans: false },
  { fact: 'Camels store water in their humps.', ans: false },
  { fact: 'Africa is the largest continent by area.', ans: false },
  { fact: 'Asia is the largest continent by area.', ans: true },
  { fact: 'The Amazon is the longest river in the world.', ans: false },
  { fact: 'The Nile is a river in Africa.', ans: true },
  { fact: 'Paris is the capital of Germany.', ans: false },
  { fact: 'Tokyo is the capital of Japan.', ans: true },
];

function makeQ() {
  return FACTS[Math.floor(Math.random() * FACTS.length)];
}

export default function TrueFalse({ onScore }) {
  const [q, setQ] = useState(makeQ);
  const [chosen, setChosen] = useState(null);
  const [round, setRound] = useState(1);

  const pick = useCallback(val => {
    if (chosen !== null) return;
    setChosen(val);
    if (val === q.ans) onScore(10);
    setTimeout(() => { setQ(makeQ()); setChosen(null); setRound(r => r + 1); }, 1200);
  }, [chosen, q, onScore]);

  return (
    <div className={styles.game}>
      <p className={styles.progress}>Round {round}</p>
      <p className={styles.question} style={{ fontSize: '1.3rem' }}>{q.fact}</p>
      <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '1.5rem' }}>
        {[true, false].map(val => (
          <button
            key={String(val)}
            className={`${styles.choice} ${chosen !== null ? (val === q.ans ? styles.correct : val === chosen ? styles.wrong : '') : ''}`}
            style={{ fontSize: '1.4rem', padding: '0.8rem 2.5rem', background: val ? '#d4f8e8' : '#ffe0e0', borderColor: val ? '#2ecc71' : '#e74c3c' }}
            onClick={() => pick(val)}
          >{val ? '✅ True' : '❌ False'}</button>
        ))}
      </div>
    </div>
  );
}
