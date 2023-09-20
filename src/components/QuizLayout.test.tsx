import React from 'react';
import { render } from '@testing-library/react';
import QuizLayout from './QuizLayout';
import { useQuizFSM } from '../hooks/useQuizFSM';

// Mock the useQuizFSM hook
jest.mock('../hooks/useQuizFSM');

describe('QuizLayout component', () => {
    it('renders the Quiz component with currentState="start"', () => {
        // Mock the useQuizFSM hook's return value
        (useQuizFSM as jest.Mock).mockReturnValue({
            currentState: 'start',
            transitionTo: jest.fn(),
            questionsData: {
                questions: ['Question 1', 'Question 2'],
                answersOptions: [['Option 1', 'Option 2'], ['Option 3', 'Option 4']],
                correctAnswersIndex: [0, 1],
                correctAnswers: ['Option 1', 'Option 4'],
            },
            error: null,
        });

        const { getByText } = render(<QuizLayout />);

        // Check if the Quiz component with "Start Quiz" button is rendered
        const startButton = getByText('Start Quiz');
        expect(startButton).toBeInTheDocument();
    });

    it('renders an error message when there is an error', () => {
        // Mock the useQuizFSM hook's return value with an error
        (useQuizFSM as jest.Mock).mockReturnValue({
            currentState: 'start',
            transitionTo: jest.fn(),
            questionsData: null,
            error: 'An error occurred',
        });

        const { getByText } = render(<QuizLayout />);

        // Check if the error message is rendered
        const errorMessage = getByText('An error occurred');
        expect(errorMessage).toBeInTheDocument();
    });

    // Add more tests as needed for different states and scenarios.
});
