import { useQuizFSM } from './useQuizFSM';
import {act, renderHook} from "@testing-library/react";


// Mock the fetch function
global.fetch = jest.fn();

describe('useQuizFSM Hook', () => {
    it('fetches questions data and transitions to the start state', async () => {
        const mockQuestionsData = {
            questionsData: {
                questions: ['Question 1', 'Question 2'],
                answersOptions: [['Option 1', 'Option 2'], ['Option 3', 'Option 4']],
                correctAnswersIndex: [0, 1],
                correctAnswers: ['Option 1', 'Option 4'],
            },
        };

        // Mock the fetch response
        const mockFetchResponse = {
            json: () => Promise.resolve(mockQuestionsData),
        };

        // Set up the fetch function to return the mock response
        (global.fetch as jest.Mock).mockResolvedValue(mockFetchResponse);

        // Render the hook
        const { result } = renderHook(() => useQuizFSM());

        // Check the initial state
        expect(result.current.currentState).toBe('start');

        // Wait for the useEffect to complete
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for the next tick
        });

        // Check if questionsData is set
        expect(result.current.questionsData).toEqual(mockQuestionsData);

        // Simulate transitioning to 'startQuiz' event
        act(() => {
            result.current.transitionTo('startQuiz');
        });

        console.log(result.current.currentState);
        // Check if the state transitions to 'question1'
        expect(result.current.currentState).toBe('question1');
    });


});
