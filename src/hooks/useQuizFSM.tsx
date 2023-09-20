import {useCallback, useEffect, useState} from 'react';
import {FSM} from 'fsm-library'; // Import your FSM class

const fsm = new FSM();

export enum State {
    start = 'start',
    question1 = 'question1',
    question2 = 'question2',
    question3 = 'question3',
    finish = 'finish',
}
const FSM_SERER_QUESTION_API_URL = 'http://localhost:4000/api/questions';
const initQuizStates = ()=>{
    console.log('*** Initializing State ***');
    // Define quiz states
    fsm.addState(State.start);
    fsm.addState(State.question1);
    fsm.addState(State.question2);
    fsm.addState(State.question3);
    fsm.addState(State.finish);

// Define transitions
    fsm.addTransition(State.start, 'startQuiz', State.question1);
    fsm.addTransition(State.question1, 'answer1', State.question2);
    fsm.addTransition(State.question1, 'wrong', State.question2);
    fsm.addTransition(State.question2, 'answer2', State.question3);
    fsm.addTransition(State.question3, 'answer3', State.finish);
// Set the initial state
    fsm.setInitialState(State.start);
}

initQuizStates();

export function useQuizFSM() {
    const [currentState, setCurrentState] = useState<State>(State.start);
    const [questionsData, setQuestionsData] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        fetch(FSM_SERER_QUESTION_API_URL)
            .then((response) => response.json())
            .then((data) => setQuestionsData(data))
            .catch((error) => {
                console.error('Error fetching JSON data:', error);
                setError('An error occured while loading Question from server.');
            });
    }, []);

    const transitionTo = useCallback(
        (event) => {
            if (!currentState) {
                console.error('Initial state not set');
                return;
            }

            fsm.transition(event);
            setCurrentState(fsm.currentState?.name as State);
        },
        []
    );

    return {
        currentState,
        transitionTo,
        questionsData,
        error
    };
}
