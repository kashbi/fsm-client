import { useState, useRef, useCallback } from 'react';
import { FSM } from 'fsm-library'; // Import your FSM class

export function useFSM(states, transitions, initialState) {
    const fsmRef = useRef(null);
    const [currentState, setCurrentState] = useState(initialState);

    if (!fsmRef.current) {
        // Initialize the FSM only once
        const fsmInstance = new FSM();
        states.forEach((state) => fsmInstance.addState(state));
        fsmInstance.setInitialState(initialState);
        fsmRef.current = fsmInstance;
    }

    const transitionFSM = useCallback(
        (event) => {
            if (!currentState) {
                console.error('Initial state not set');
                return;
            }

            const validTransition = transitions.find(
                (t) => t.from === currentState && t.event === event
            );

            if (validTransition) {
                fsmRef.current.transition(validTransition.event);
                setCurrentState(fsmRef.current.currentState?.name);
            } else {
                console.error('Invalid transition');
            }
        },
        [currentState, transitions]
    );

    return {
        currentState,
        transitionFSM,
    };
}
