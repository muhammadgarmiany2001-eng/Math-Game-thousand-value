
import { GoogleGenAI, Type } from "@google/genai";
import { MathProblem } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const schema = {
  type: Type.OBJECT,
  properties: {
    question: { 
      type: Type.STRING, 
      description: 'The question text to display to the user. For example: "What is 1,234 in word form?"' 
    },
    standardForm: { 
      type: Type.STRING, 
      description: 'The number in standard form, e.g., "1234".' 
    },
    options: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'An array of four possible answers, one of which is correct.'
    },
    correctAnswer: { 
      type: Type.STRING, 
      description: 'The correct answer, which must be one of the strings in the options array.' 
    }
  },
  required: ['question', 'standardForm', 'options', 'correctAnswer']
};


export const generateMathProblem = async (): Promise<MathProblem> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Create a 3rd-grade math question about place value for a number between 1000 and 9999. The question must be multiple choice with four options. The question must be one of these four types, chosen randomly: 1. Given standard form, find the word form. 2. Given word form, find the standard form. 3. Given standard form, find the expanded form. 4. Given expanded form, find the standard form. Ensure one option is correct and the other three are plausible distractors. The number must be clearly identifiable in standard form.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const jsonText = response.text.trim();
    const problem = JSON.parse(jsonText);
    
    // Basic validation
    if (
      !problem.question || 
      !problem.standardForm || 
      !Array.isArray(problem.options) || 
      problem.options.length !== 4 ||
      !problem.correctAnswer
    ) {
      throw new Error("Invalid problem structure received from API");
    }
    
    return problem as MathProblem;

  } catch (error) {
    console.error("Error generating math problem:", error);
    // Fallback to a predefined problem in case of API failure
    return {
      question: "What is 2,345 in expanded form?",
      standardForm: "2345",
      options: [
        "2000 + 300 + 40 + 5",
        "200 + 300 + 40 + 5",
        "2000 + 30 + 4 + 5",
        "Two thousand three hundred forty-five",
      ],
      correctAnswer: "2000 + 300 + 40 + 5",
    };
  }
};
