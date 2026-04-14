import React, { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GAMES, CATEGORIES } from '../../data/gamesRegistry';

/* ── Lazy game map ─────────────────────────────────────── */
import CountStars       from '../games/math/CountStars';
import AdditionQuest    from '../games/math/AdditionQuest';
import SubtractionHero  from '../games/math/SubtractionHero';
import MultiplyRocket   from '../games/math/MultiplyRocket';
import NumberBalloons   from '../games/math/NumberBalloons';
import CompareNumbers   from '../games/math/CompareNumbers';
import MissingNumber    from '../games/math/MissingNumber';
import ShapeCount       from '../games/math/ShapeCount';
import EvenOdd          from '../games/math/EvenOdd';
import FractionFinder   from '../games/math/FractionFinder';
import TellTime         from '../games/math/TellTime';
import DivisionDash     from '../games/math/DivisionDash';

import AbcOrder         from '../games/letters/AbcOrder';
import WordMatch        from '../games/letters/WordMatch';
import SpellIt          from '../games/letters/SpellIt';
import MissingLetter    from '../games/letters/MissingLetter';
import UpperLower       from '../games/letters/UpperLower';
import RhymeTime        from '../games/letters/RhymeTime';
import VowelHunt        from '../games/letters/VowelHunt';
import WordScramble     from '../games/letters/WordScramble';
import FirstSound       from '../games/letters/FirstSound';
import WordBuilder      from '../games/letters/WordBuilder';
import SentenceBuilder  from '../games/letters/SentenceBuilder';

import FlagQuiz         from '../games/logic/FlagQuiz';
import WorldCapitals    from '../games/logic/WorldCapitals';
import ContinentSort    from '../games/logic/ContinentSort';
import PatternMaster    from '../games/logic/PatternMaster';
import MemoryMatch      from '../games/logic/MemoryMatch';
import MazeRunner       from '../games/logic/MazeRunner';
import ColorSort        from '../games/logic/ColorSort';
import WhatComesNext    from '../games/logic/WhatComesNext';
import TrueFalse        from '../games/logic/TrueFalse';
import OddOneOut        from '../games/logic/OddOneOut';
import CountryMatch     from '../games/logic/CountryMatch';
import RiverCountry     from '../games/logic/RiverCountry';

import styles from './GameShell.module.css';

const GAME_COMPONENTS = {
  CountStars, AdditionQuest, SubtractionHero, MultiplyRocket,
  NumberBalloons, CompareNumbers, MissingNumber, ShapeCount,
  EvenOdd, FractionFinder, TellTime, DivisionDash,
  AbcOrder, WordMatch, SpellIt, MissingLetter, UpperLower,
  RhymeTime, VowelHunt, WordScramble, FirstSound, WordBuilder, SentenceBuilder,
  FlagQuiz, WorldCapitals, ContinentSort, PatternMaster, MemoryMatch,
  MazeRunner, ColorSort, WhatComesNext, TrueFalse, OddOneOut,
  CountryMatch, RiverCountry,
};

function GameShell() {
  const { id } = useParams();
  const game = GAMES.find(g => g.id === id);
  const [key, setKey] = useState(0);
  const [score, setScore] = useState(0);

  const handleScore = useCallback(pts => setScore(s => s + pts), []);
  const restart = () => { setKey(k => k + 1); setScore(0); };

  if (!game) {
    return (
      <div className={styles.notFound}>
        <h2>Game not found 😕</h2>
        <Link to="/games">← Back to games</Link>
      </div>
    );
  }

  const cat = CATEGORIES[game.category];
  const GameComponent = GAME_COMPONENTS[game.component];

  return (
    <main className={styles.shell} style={{ '--cat-color': cat.color }}>
      <div className={styles.topBar} style={{ background: cat.color }}>
        <Link to="/games" className={styles.backBtn}>← Games</Link>
        <div className={styles.gameInfo}>
          <span className={styles.gameEmoji}>{game.emoji}</span>
          <span className={styles.gameTitle}>{game.title}</span>
        </div>
        <div className={styles.scoreBox}>⭐ {score}</div>
      </div>

      <div className={styles.gameArea}>
        {GameComponent ? (
          <GameComponent key={key} onScore={handleScore} />
        ) : (
          <p className={styles.comingSoon}>🚧 Game coming soon!</p>
        )}
      </div>

      <div className={styles.bottomBar}>
        <button className={styles.restartBtn} onClick={restart}>🔄 Restart</button>
        <Link to="/games" className={styles.allGamesBtn}>🎮 All Games</Link>
      </div>
    </main>
  );
}

export default GameShell;
