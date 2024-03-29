import { useChallenge } from "../../contexts/ChallengesContext";
import { useCountdown } from "../../contexts/CountdownContext";

import styles from "../../styles/components/ChallengeBox.module.css";

export function ChallengeBox() {
  const { activeChallenge, resetChallenge, completeChallenge } = useChallenge();
  const { resetCountdown } = useCountdown();

  function handleChallengeFailed() {
    resetChallenge();
    resetCountdown();
  }

  function handleChallengeSucceeded() {
    completeChallenge();
    resetCountdown();
  }

  return (
    <div className={styles.challengeBoxContainer}>
      {activeChallenge ? (
        <div className={styles.challengeActive}>
          <header>Ganhe {activeChallenge?.amount} px</header>

          <main>
            <img src={`icons/${activeChallenge?.type}.svg`} />
            <strong>Novo desafio</strong>
            <p>{activeChallenge?.description}</p>
          </main>

          <footer>
            <button
              type="button"
              className={styles.challengeFailedButton}
              onClick={handleChallengeFailed}
            >
              Falhei
            </button>
            <button
              type="button"
              className={styles.challengeSucceededButton}
              onClick={handleChallengeSucceeded}
            >
              Completei
            </button>
          </footer>
        </div>
      ) : (
        <div className={styles.challengeNotActive}>
          <strong>Finalize um ciclo para receber um desafio.</strong>
          <p>
            <img src="icons/level-up.svg" alt="Level up" />
            Avance de level completando desafios.
          </p>
        </div>
      )}
    </div>
  );
}
