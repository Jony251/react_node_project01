import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { GAME_IDEAS, SUBJECTS } from "../../data/subjectGameIdeas";

const Home = () => {
  return (
    <main className="home-page">
      <section className="hero">
        <div className="hero__content">
          <p className="hero__eyebrow">ABCya-inspired learning portal</p>
          <h1>Play, Learn, and Grow Every Day</h1>
          <p className="hero__description">
            A colorful game hub for kids that blends fun gameplay with real
            learning goals across Math, Letters, and Logic + Geography.
          </p>
          <div className="hero__actions">
            <Link to="/games" className="hero__button hero__button--primary">
              Explore Game Library
            </Link>
            <Link to="/contact" className="hero__button hero__button--secondary">
              Contact Team
            </Link>
          </div>
        </div>
      </section>

      <section className="subject-overview">
        <div className="section-header">
          <h2>Core Subjects</h2>
          <p>
            Built around the concept you requested: playful learning with clear
            educational outcomes.
          </p>
        </div>
        <div className="subject-grid">
          {SUBJECTS.map((subject) => (
            <article
              key={subject.id}
              className="subject-card"
              style={{ borderTopColor: subject.accent }}
            >
              <h3>{subject.title}</h3>
              <p>{subject.description}</p>
              <div className="subject-card__meta">
                <span>{GAME_IDEAS[subject.id].length} concept games</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="preview-section">
        <div className="section-header">
          <h2>Featured Concepts</h2>
          <p>Each subject includes at least 10 ideas ready for implementation.</p>
        </div>
        <div className="preview-grid">
          {SUBJECTS.map((subject) =>
            GAME_IDEAS[subject.id].slice(0, 2).map((idea) => (
              <article key={idea.id} className="preview-card">
                <p className="preview-card__subject">{subject.title}</p>
                <h3>{idea.title}</h3>
                <p>{idea.concept}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
};

export default Home;
