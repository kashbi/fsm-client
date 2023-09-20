import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Quiz from './Quiz';

// Mock transitionTo function
const mockTransitionTo = jest.fn();

// Mock questionsData
const mockQuestionsData = {
    questions: ['Question 1', 'Question 2'],
    answersOptions: [['Option 1', 'Option 2'], ['Option 3', 'Option 4']],
    correctAnswersIndex: [0, 1],
    correctAnswers: ['Option 1', 'Option 4'],
};

describe('Quiz component', () => {
    it('renders the start button when in "start" state', () => {
        const { getByText } = render(
            <Quiz currentState="start" questionsData={mockQuestionsData} transitionTo={mockTransitionTo} />
        );
        const startButton = getByText('Start Quiz');
        expect(startButton).toBeInTheDocument();
    });

    it('renders a question when in "question" state', () => {
        const { getByText } = render(
            <Quiz currentState="question1" questionsData={mockQuestionsData} transitionTo={mockTransitionTo} />
        );
        const questionText = getByText('Question 1');
        expect(questionText).toBeInTheDocument();
    });

    it('handles answering a question correctly', async () => {
        const { getByText } = render(
            <Quiz currentState="question1" questionsData={mockQuestionsData} transitionTo={mockTransitionTo} />
        );
        const optionToSelect = getByText('Option 1');
        fireEvent.click(optionToSelect);
        await waitFor(() => {
            const correctMessage = getByText('Nice! Option 1');
            expect(correctMessage).toBeInTheDocument();
        });
    });

    it('calls transitionTo with the correct arguments when starting the quiz', () => {
        const { getByText } = render(
            <Quiz currentState="start" questionsData={mockQuestionsData} transitionTo={mockTransitionTo} />
        );
        const startButton = getByText('Start Quiz');
        fireEvent.click(startButton);
        expect(mockTransitionTo).toHaveBeenCalledWith('startQuiz');
    });

});
