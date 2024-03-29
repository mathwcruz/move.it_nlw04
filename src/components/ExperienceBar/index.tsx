import { useChallenge } from "../../contexts/ChallengesContext";

import styles from "../../styles/components/ExperienceBar.module.css";

export function ExperienceBar() {
  const { currentExperience, experienceToNextLevel } = useChallenge();

  const percentToNextLevel =
    Math.round(currentExperience * 100) / experienceToNextLevel;

  return (
    <header className={styles.experienceBar}>
      <span>0 xp</span>
      <div>
        <div style={{ width: `${percentToNextLevel}%` }} />
        {currentExperience > 0 && (
          <span
            style={{ left: `${percentToNextLevel}%` }}
            className={styles.currentExperience}
          >
            {currentExperience} xp
          </span>
        )}
      </div>
      <span>{experienceToNextLevel} xp</span>
    </header>
  );
}
