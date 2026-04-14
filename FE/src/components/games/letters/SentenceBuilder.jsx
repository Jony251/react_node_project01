import React, { useState, useCallback } from 'react';
import styles from '../GameUI.module.css';

const SENTENCES = [
  { words: ['The', 'cat', 'sat', 'on', 'the', 'mat.'], sentence: 'The cat sat on the mat.' },
  { words: ['I', 'like', 'to', 'eat', 'pizza.'], sentence: 'I like to eat pizza.' },
  { words: ['The', 'dog', 'ran', 'fast.'], sentence: 'The dog ran fast.' },
  { words: ['She', 'has', 'a', 'red', 'ball.'], sentence: 'She has a red ball.' },
  { words: ['Birds', 'can', 'fly', 'high.'], sentence: 'Birds can fly high.' },
  { words: ['We', 'go', 'to', 'school', 'every', 'day.'], sentence: 'We go to school every day.' },
];

function makeQ() {
  const s = SENTENCES[Math.floor(Math.random() * SENTENCES.length)];
  const shuffled = [...s.words].sort(() => Math.random() - 0.5);
  return { ...s, shuffled, placed: [] };
}

export default function SentenceBuilder({ onScore }) {
  const [q, setQ] = useState(makeQ);
  const [pool, setPool] = useState(() => makeQ().shuffled);
  const [placed, setPlaced] = useState([]);
  const [fb, setFb] = useState('');

  const reset = useCallback(() => {
    const nq = makeQ();
    setQ(nq);
    setPool(nq.shuffled);
    setPlaced([]);
    setFb('');
  }, []);

  const pick = useCallback(w => {
    setPlaced(p => [...p, w]);
    setPool(p => {
      const idx = p.indexOf(w);
      return [...p.slice(0, idx), ...p.slice(idx + 1)];
    });
  }, []);

  const remove = useCallback(i => {
    const w = placed[i];
    setPlaced(p => p.filter((_, idx) => idx !== i));
    setPool(p => [...p, w]);
  }, [placed]);

  const check = useCallback(() => {
    const built = placed.join(' ');
    if (built === q.sentence) {
      setFb('✅ Perfect sentence!');
      onScore(15);
      setTimeout(reset, 1300);
    } else {
      setFb('❌ Not quite! Try again.');
    }
  }, [placed, q, onScore, reset]);

  return (
    <div className={styles.game}>
      <p className={styles.question}>Build a sentence by tapping the words!</p>

      <div style={{
        minHeight: 56, background: '#e8f4ff', borderRadius: 12, padding: '0.75rem',
        display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem',
        border: '2px dashed #b3d7ff', alignContent: 'flex-start'
      }}>
        {placed.length === 0 && <span style={{ color: '#b3d7ff', fontSize: '0.95rem' }}>Tap words below…</span>}
        {placed.map((w, i) => (
          <button
            key={i}
            onClick={() => remove(i)}
            style={{
              background: '#4ecdc4', color: '#fff', border: 'none', borderRadius: 8,
              padding: '0.35rem 0.7rem', fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
              fontFamily: 'var(--font-family)',
            }}
          >{w} ✕</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginBottom: '1rem' }}>
        {pool.map((w, i) => (
          <button
            key={i}
            onClick={() => pick(w)}
            style={{
              background: '#f0f4ff', border: '2px solid #c5d0ff', borderRadius: 8,
              padding: '0.35rem 0.7rem', fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
              fontFamily: 'var(--font-family)',
            }}
          >{w}</button>
        ))}
      </div>

      <button
        className={styles.submitBtn}
        onClick={check}
        disabled={pool.length > 0}
      >Check Sentence</button>

      {fb && (
        <div className={`${styles.feedback} ${fb.startsWith('✅') ? styles.ok : styles.no}`}>{fb}</div>
      )}
    </div>
  );
}
