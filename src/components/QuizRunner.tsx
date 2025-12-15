import QuizPlayer from "./QuizPlayer";
import ConceptQuizPlayer from "./ConceptQuizPlayer";

export default function QuizRunner({ quiz, profile, onExit }: any) {
  if (quiz.type === "concept-journey") {
    return (
      <ConceptQuizPlayer
        quiz={quiz}
        profile={profile}
        onExit={onExit}
      />
    );
  }

  return (
    <QuizPlayer
      quiz={quiz}
      profile={profile}
      onExit={onExit}
    />
  );
}
