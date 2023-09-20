import React from 'react';
import { useFSM } from '../hooks/useFSM';  

function MyComponent() {
    const states = ['start', 'state1', 'state2'];
    const transitions = [
        { from: 'start', event: 'next', to: 'state1' },
        { from: 'state1', event: 'next', to: 'state2' },
        { from: 'state2', event: 'back', to: 'state1' },
    ];

    const { currentState, transitionFSM } = useFSM(states, transitions, 'start');

    return (
        <div>
            <h1>Current State: {currentState}</h1>
            <button onClick={() => transitionFSM('next')}>Next</button>
            <button onClick={() => transitionFSM('back')}>Back</button>
            {/* Render components based on the current state */}
            {currentState === 'state1' && (
                <div>
                    <p>This is State 1</p>
                </div>
            )}
            {currentState === 'state2' && (
                <div>
                    <p>This is State 2</p>
                </div>
            )}
        </div>
    );
}

export default MyComponent;
