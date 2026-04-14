import React, { useState, useEffect, useCallback } from 'react';
import styles from '../GameUI.module.css';

const SIZE = 7;
const CELL = 48;

function createMaze() {
  const grid = Array.from({ length: SIZE }, (_, r) =>
    Array.from({ length: SIZE }, (_, c) => ({
      r, c, walls: { top: true, right: true, bottom: true, left: true },
      visited: false,
    }))
  );

  const stack = [];
  const start = grid[0][0];
  start.visited = true;
  stack.push(start);

  const dirs = [
    { dr: -1, dc: 0, wall: 'top',    opp: 'bottom' },
    { dr: 0,  dc: 1, wall: 'right',  opp: 'left' },
    { dr: 1,  dc: 0, wall: 'bottom', opp: 'top' },
    { dr: 0,  dc: -1, wall: 'left',  opp: 'right' },
  ];

  while (stack.length) {
    const cur = stack[stack.length - 1];
    const neighbors = dirs
      .map(d => ({ ...d, nr: cur.r + d.dr, nc: cur.c + d.dc }))
      .filter(d => d.nr >= 0 && d.nr < SIZE && d.nc >= 0 && d.nc < SIZE && !grid[d.nr][d.nc].visited);
    if (neighbors.length === 0) { stack.pop(); continue; }
    const chosen = neighbors[Math.floor(Math.random() * neighbors.length)];
    cur.walls[chosen.wall] = false;
    grid[chosen.nr][chosen.nc].walls[chosen.opp] = false;
    grid[chosen.nr][chosen.nc].visited = true;
    stack.push(grid[chosen.nr][chosen.nc]);
  }
  return grid;
}

export default function MazeRunner({ onScore }) {
  const [maze, setMaze] = useState(createMaze);
  const [pos, setPos] = useState({ r: 0, c: 0 });
  const [won, setWon] = useState(false);

  const move = useCallback(dir => {
    if (won) return;
    const cell = maze[pos.r][pos.c];
    const map = { ArrowUp: { dr: -1, dc: 0, wall: 'top' }, ArrowDown: { dr: 1, dc: 0, wall: 'bottom' }, ArrowLeft: { dr: 0, dc: -1, wall: 'left' }, ArrowRight: { dr: 0, dc: 1, wall: 'right' } };
    const d = map[dir];
    if (!d || cell.walls[d.wall]) return;
    const nr = pos.r + d.dr, nc = pos.c + d.dc;
    if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) return;
    setPos({ r: nr, c: nc });
    if (nr === SIZE - 1 && nc === SIZE - 1) {
      setWon(true);
      onScore(20);
    }
  }, [pos, maze, won, onScore]);

  useEffect(() => {
    const handler = e => {
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) {
        e.preventDefault();
        move(e.key);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [move]);

  const restart = () => { setMaze(createMaze()); setPos({ r: 0, c: 0 }); setWon(false); };

  return (
    <div className={styles.game}>
      <p className={styles.question}>Guide the 🐭 to the cheese 🧀!</p>
      <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem' }}>Use arrow keys or buttons below</p>
      <div style={{ display: 'inline-block', border: '3px solid #9b59b6', borderRadius: 8, overflow: 'hidden', background: '#f5eeff' }}>
        {maze.map((row, r) => (
          <div key={r} style={{ display: 'flex' }}>
            {row.map((cell, c) => {
              const isPlayer = pos.r === r && pos.c === c;
              const isGoal = r === SIZE - 1 && c === SIZE - 1;
              return (
                <div
                  key={c}
                  style={{
                    width: CELL, height: CELL,
                    borderTop: cell.walls.top ? '2px solid #9b59b6' : '2px solid transparent',
                    borderRight: cell.walls.right ? '2px solid #9b59b6' : '2px solid transparent',
                    borderBottom: cell.walls.bottom ? '2px solid #9b59b6' : '2px solid transparent',
                    borderLeft: cell.walls.left ? '2px solid #9b59b6' : '2px solid transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.4rem',
                    background: isPlayer ? '#ffe66d' : 'transparent',
                  }}
                >{isPlayer ? '🐭' : isGoal ? '🧀' : ''}</div>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', marginTop: '1rem' }}>
        <button className={styles.submitBtn} style={{ padding: '0.4rem 1.4rem' }} onClick={() => move('ArrowUp')}>▲</button>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className={styles.submitBtn} style={{ padding: '0.4rem 1.4rem' }} onClick={() => move('ArrowLeft')}>◄</button>
          <button className={styles.submitBtn} style={{ padding: '0.4rem 1.4rem' }} onClick={() => move('ArrowDown')}>▼</button>
          <button className={styles.submitBtn} style={{ padding: '0.4rem 1.4rem' }} onClick={() => move('ArrowRight')}>►</button>
        </div>
      </div>
      {won && (
        <div style={{ marginTop: '1rem' }}>
          <p style={{ fontSize: '1.4rem', fontWeight: 900, color: '#2ecc71' }}>🎉 You made it!</p>
          <button className={styles.submitBtn} onClick={restart}>Play Again</button>
        </div>
      )}
    </div>
  );
}
