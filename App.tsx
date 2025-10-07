
import React, { useState, useEffect, useCallback } from 'react';
import { GameState, MathProblem } from './types';
import { generateMathProblem } from './services/geminiService';
import { PlaceValueVisualizer } from './components/PlaceValueVisualizer';
import { CheckIcon, CrossIcon, SparkleIcon } from './components/icons';

const TOTAL_QUESTIONS = 5;

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.Start);
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNewProblem = useCallback(async () => {
    setIsLoading(true);
    setSelectedAnswer(null);
    setIsCorrect(null);
    const problem = await generateMathProblem();
    setCurrentProblem(problem);
    setIsLoading(false);
  }, []);

  const handleStartGame = () => {
    setQuestionNumber(1);
    setScore(0);
    setGameState(GameState.Playing);
    fetchNewProblem();
  };
  
  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer) return;

    const correct = answer === currentProblem?.correctAnswer;
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    if (correct) {
      setScore(prev => prev + 1);
    }
    setGameState(GameState.Feedback);

    setTimeout(() => {
      if (questionNumber < TOTAL_QUESTIONS) {
        setQuestionNumber(prev => prev + 1);
        setGameState(GameState.Playing);
        fetchNewProblem();
      } else {
        setGameState(GameState.End);
      }
    }, 2000);
  };

  const StartScreen: React.FC = () => (
    <div className="text-center">
      <h1 className="text-6xl font-bold text-blue-600 mb-4 drop-shadow-lg">Math Whiz</h1>
      <p className="text-2xl text-gray-700 mb-8">Thousands Adventure!</p>
      <button
        onClick={handleStartGame}
        className="px-12 py-4 bg-green-500 text-white font-bold text-2xl rounded-full shadow-lg hover:bg-green-600 transform hover:scale-105 transition-transform duration-300"
      >
        Start Game
      </button>
    </div>
  );

  const EndScreen: React.FC = () => (
    <div className="text-center p-8 bg-white rounded-2xl shadow-2xl">
      <h2 className="text-5xl font-bold text-yellow-500 mb-4">Great Job!</h2>
      <p className="text-2xl text-gray-700 mb-6">You scored</p>
      <p className="text-7xl font-bold text-blue-600 mb-8">{score} / {TOTAL_QUESTIONS}</p>
      <button
        onClick={handleStartGame}
        className="px-12 py-4 bg-blue-500 text-white font-bold text-2xl rounded-full shadow-lg hover:bg-blue-600 transform hover:scale-105 transition-transform duration-300"
      >
        Play Again
      </button>
    </div>
  );

  const GameScreen: React.FC = () => {
    if (isLoading || !currentProblem) {
      return (
        <div className="text-center">
          <SparkleIcon className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-600">Generating a new challenge...</p>
        </div>
      );
    }

    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-4">
            <div className="text-xl font-bold text-blue-700">Question: {questionNumber}/{TOTAL_QUESTIONS}</div>
            <div className="text-xl font-bold text-green-700">Score: {score}</div>
        </div>
        <div className="w-full bg-white p-6 rounded-2xl shadow-lg mb-6">
            <p className="text-3xl font-semibold text-gray-800 text-center">{currentProblem.question}</p>
        </div>
        
        {currentProblem.standardForm && <PlaceValueVisualizer numberStr={currentProblem.standardForm} />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 w-full">
          {currentProblem.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrectAnswer = option === currentProblem.correctAnswer;
            
            let buttonClass = 'bg-white text-blue-800 hover:bg-blue-100';
            if (gameState === GameState.Feedback) {
              if (isCorrectAnswer) {
                buttonClass = 'bg-green-500 text-white';
              } else if (isSelected) {
                buttonClass = 'bg-red-500 text-white';
              } else {
                buttonClass = 'bg-gray-300 text-gray-500 opacity-70';
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={gameState === GameState.Feedback}
                className={`p-4 rounded-lg shadow-md text-lg font-medium transition-all duration-300 transform ${buttonClass} ${gameState !== GameState.Feedback && 'hover:scale-105'}`}
              >
                {option}
              </button>
            );
          })}
        </div>
        {gameState === GameState.Feedback && (
          <div className="mt-6 flex items-center justify-center text-4xl font-bold animate-pulse">
            {isCorrect ? (
              <div className="flex items-center text-green-600">
                <CheckIcon className="w-12 h-12 mr-2" /> Correct!
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <CrossIcon className="w-12 h-12 mr-2" /> Not quite...
              </div>
            )}
          </div>
        )}
      </div>
    );
  };
  
  const renderContent = () => {
    switch (gameState) {
      case GameState.Start:
        return <StartScreen />;
      case GameState.Playing:
      case GameState.Feedback:
        return <GameScreen />;
      case GameState.End:
        return <EndScreen />;
      default:
        return <StartScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-cyan-200 flex flex-col items-center justify-center p-4 font-sans">
      {renderContent()}
    </div>
  );
};

export default App;
