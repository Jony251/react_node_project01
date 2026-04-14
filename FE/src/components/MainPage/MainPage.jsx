import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./MainPage.module.css";
import Age from "../Age/Age";
import { GAME_IDEAS, SUBJECTS } from "../../data/subjectGameIdeas";

/**
 * MainPage component - displays a list of games with links.
 * @returns {JSX.Element}
 */
function MainPage() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSubject, setActiveSubject] = useState("all");

    useEffect(() => {
        fetchGames();
    }, []);
    
    /**
     * Fetches all games from the server and updates the component state
     * Sets loading true while fetching and false when done
     * If there's an error, sets the error state
     */
    const fetchGames = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("/api/games");

        // Images are already in base64 format from backend
        const gamesWithImages = response.data.map((game) => ({
          ...game,
          imageUrl: game.image ? `data:image/jpeg;base64,${game.image}` : null,
        }));

        setGames(gamesWithImages);
      } catch (requestError) {
        console.error("Error fetching games:", requestError);
        setError("Failed to load games. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const conceptGames = useMemo(() => {
      if (activeSubject === "all") {
        return SUBJECTS.flatMap((subject) =>
          GAME_IDEAS[subject.id].map((idea) => ({
            ...idea,
            subjectTitle: subject.title,
            accent: subject.accent,
          }))
        );
      }

      const selectedSubject = SUBJECTS.find((subject) => subject.id === activeSubject);

      return GAME_IDEAS[activeSubject].map((idea) => ({
        ...idea,
        subjectTitle: selectedSubject?.title,
        accent: selectedSubject?.accent || "#2563eb",
      }));
    }, [activeSubject]);

    if (loading) {
      return (
        <div className={styles.mainPage}>
          <div className={styles.container}>
            <div className={styles.loading}>Loading games...</div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className={styles.mainPage}>
          <div className={styles.container}>
            <div className={styles.error}>
              <h2>Error</h2>
              <p>{error}</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.mainPage}>
        <section className={styles.hero}>
          <div className={styles.container}>
            <h1 className={styles.mainPageTitle}>Learning Arcade</h1>
            <p className={styles.heroText}>
              Browse live games from your API and explore the new curriculum
              concept library with 30 structured ideas.
            </p>
          </div>
        </section>

        <section className={styles.subjectSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <h2>Game Concept Library</h2>
              <p>At least 10 ideas per required subject: Math, Letters, and Logic + Geography.</p>
            </div>

            <div className={styles.subjectFilters}>
              <button
                type="button"
                className={`${styles.filterButton} ${activeSubject === "all" ? styles.filterButtonActive : ""}`}
                onClick={() => setActiveSubject("all")}
              >
                All Concepts ({Object.values(GAME_IDEAS).flat().length})
              </button>
              {SUBJECTS.map((subject) => (
                <button
                  key={subject.id}
                  type="button"
                  className={`${styles.filterButton} ${activeSubject === subject.id ? styles.filterButtonActive : ""}`}
                  onClick={() => setActiveSubject(subject.id)}
                >
                  {subject.title} ({GAME_IDEAS[subject.id].length})
                </button>
              ))}
            </div>

            <div className={styles.ideaGrid}>
              {conceptGames.map((idea) => (
                <article
                  key={idea.id}
                  className={styles.ideaCard}
                  style={{ borderTopColor: idea.accent }}
                >
                  <p className={styles.ideaSubject}>{idea.subjectTitle}</p>
                  <h3>{idea.title}</h3>
                  <p className={styles.ideaConcept}>{idea.concept}</p>
                  <p className={styles.ideaAge}>Suggested ages: {idea.ageGroup}</p>
                  <ul className={styles.skillList}>
                    {idea.skills.map((skill) => (
                      <li key={`${idea.id}-${skill}`}>{skill}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.liveGamesSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <h2>Published Games (API Data)</h2>
              <p>These cards are loaded from your backend database.</p>
            </div>

            <div className={styles.gameContainer}>
              {games.length === 0 ? (
                <p className={styles.emptyState}>No published games yet. Add one from the admin panel.</p>
              ) : (
                games.map((game) => (
                  <div key={game.id} className={styles.gameCard}>
                    <div className={styles.ageWrapper}>
                      <Age ageRating={game.ageRating} />
                    </div>
                    {game.imageUrl && (
                      <img
                        src={game.imageUrl}
                        alt={game.title}
                        className={styles.gameImage}
                      />
                    )}
                    <h3 className={styles.gameTitle}>{game.title}</h3>
                    <Link
                      to={`/game/${game.id}`}
                      state={{ post: game }}
                      className={styles.viewButton}
                    >
                      View Game
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    );
}

export default MainPage;
