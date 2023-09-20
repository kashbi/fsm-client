import React from 'react';
import Quiz from './Quiz';
import {useQuizFSM} from '../hooks/useQuizFSM';

const QuizLayout =  ()=>{
    const { currentState, transitionTo, questionsData, error } = useQuizFSM();
    console.log('QuizLayout',currentState);
    if (error) {
        return <div>{error}</div>
    }
    return (<Quiz currentState={currentState} transitionTo={transitionTo} questionsData={questionsData}></Quiz>);
}

export default QuizLayout;
