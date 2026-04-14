import React, { useState, useCallback } from 'react';
import styles from '../GameUI.module.css';

const EMOJIS = ['🐱','🐶','🦊','🐸','🦁','🐯','🐨','🦄'];

function makeBoard() {
  const pairs = [...EMOJIS, ...EMOJIS].sort(() => Math.random() - 0.5);
  return pairs.map((e, i) => ({ id: i, emoji: e, revealed: false, matched: false }));
}

export default function MemoryMatch({ onScore }) {
  const [cards, setCards] = useState(makeBoard);
  const [open, setOpen] = useState([]);
  const [lock, setLock] = useState(false);
  const [moves, setMoves] = useState(0);

  const flip = useCallback(id => {
    if (lock) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.revealed || card.matched) return;

    const next = cards.map(c => c.id === id ? { ...c, revealed: true } : c);
    setCards(next);

    if (open.length === 0) {
      setOpen([id]);
    } else if (open.length === 1) {
      setMoves(m => m + 1);
      const first = next.find(c => c.id === open[0]);
      const second = next.find(c => c.id === id);
      if (first.emoji === second.emoji) {
        const matched = next.map(c => (c.id === open[0] || c.id === id) ? { ...c, matched: true } : c);
        setCards(matched);
        setOpen([]);
        onScore(5);
      } else {
        setLock(true);
        setTimeout(() => {
          setCards(c => c.map(x => (x.id === open[0] || x.id === id) ? { ...x, revealed: false } : x));
          setOpen([]);
          setLock(false);
        }, 900);
      }
    }
  }, [lock, cards, open, onScore]);

  const allDone = cards.every(c => c.matched);

  return (
    <div className={styles.game}>
      <p className={styles.question}>Find the matching pairs!</p>
      <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>Moves: {moves}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
        {cards.map(c => (
          <button
            key={c.id}
            onClick={() => flip(c.id)}
            style={{
              height: 70, fontSize: '2rem',
              border: '3px solid',
              borderColor: c.matched ? '#2ecc71' : c.revealed ? '#9b59b6' : '#c5d0ff',
              borderRadius: 12,
              background: c.matched ? '#d4f8e8' : c.revealed ? '#f5eeff' : '#e8f4ff',
              cursor: c.matched || c.revealed ? 'default' : 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'var(--font-family)',
            }}
          >{c.revealed || c.matched ? c.emoji : '❓'}</button>
        ))}
      </div>
      {allDone && <p style={{ marginTop: '1rem', fontSize: '1.3rem', fontWeight: 900, color: '#2ecc71' }}>🎉 All matched in {moves} moves!</p>}
    </div>
  );
}
