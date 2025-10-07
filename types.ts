
export enum GameState {
  Start,
  Playing,
  Feedback,
  End,
}

export interface MathProblem {
  question: string;
  standardForm: string;
  options: string[];
  correctAnswer: string;
}
