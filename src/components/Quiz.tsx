import React, {useState, useEffect} from 'react';
import {FSM} from 'fsm-library';
import {QuizContainer, QuizTitle, QuizButton} from '../styles/styles';

enum State {
    start = 'start',
    question1 = 'question1',
    question2 = 'question2',
    question3 = 'question3',
    finish = 'finish',
}

const fsm = new FSM();

// Define quiz states
const startState = fsm.addState(State.start);
const question1State = fsm.addState(State.question1);
const question2State = fsm.addState(State.question2);
const question3State = fsm.addState(State.question3);
const finishState = fsm.addState(State.finish);

// Define transitions
fsm.addTransition(State.start, 'startQuiz', State.question1);
fsm.addTransition(State.question1, 'answer1', State.question2);
fsm.addTransition(State.question1, 'wrong', State.question2);
fsm.addTransition(State.question2, 'answer2', State.question3);
fsm.addTransition(State.question3, 'answer3', State.finish);
// Set the initial state
fsm.setInitialState(State.start);

const FSM_SERER_QUESTION_API_URL = 'http://localhost:4000/api/questions';
const Quiz = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [currentState, setCurrentState] = useState(fsm.currentState.name);
    const [questionsData, setQuestionsData] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [selectedAnswerIndices, setSelectedAnswerIndices] = useState([]);
    const [showNextButton, setShowNextButton] = useState(null);

    // Define an effect to fetch the JSON data after rendering
    useEffect(() => {
        fetch(FSM_SERER_QUESTION_API_URL)
            .then((response) => response.json())
            .then((data) => setQuestionsData(data))
            .catch((error) => {
                console.error('Error fetching JSON data:', error);
            });
    }, []);

    const startQuiz = () => {
        if (fsm.currentState?.name === 'start') {
            fsm.transition('startQuiz'); // This triggers the transition
            setCurrentState(fsm.currentState.name);
        }
    };
    // Function to handle answering a question
    const answerQuestion = (selectedAnswer, index) => {
        const currentQuestion = `question${currentQuestionIndex + 1}`;

        if (currentState === currentQuestion) {
            const nextQuestionIndex = currentQuestionIndex + 1;
            const isCorrectAnswer = questionsData.correctAnswersIndex[currentQuestionIndex  ] === index;
            setIsCorrect(isCorrectAnswer);
            setSelectedAnswerIndices(((prevState=> prevState.concat(index))));
            if (isCorrectAnswer) {
                if (!selectedAnswerIndices.length) {
                    setShowNextButton(false);
                    setSelectedAnswerIndices([]);
                    if (nextQuestionIndex < questionsData.questions.length) {
                        fsm.transition(`answer${nextQuestionIndex}`);
                        setUserAnswers([...userAnswers, selectedAnswer]);
                        setCurrentQuestionIndex(nextQuestionIndex);
                        setCurrentState(fsm.currentState.name);
                    } else {
                        fsm.transition(`answer${nextQuestionIndex}`);
                        setUserAnswers([...userAnswers, selectedAnswer]);
                        setCurrentState(fsm.currentState.name);
                    }
                }else{
                    setShowNextButton(true);
                }
            }
        }
    };

    return (

        <QuizContainer>
            <QuizTitle>Quiz</QuizTitle>

            {currentState === 'start' && (
                <QuizButton className={questionsData?.questions?.length ? '' : 'disabled'} onClick={startQuiz}>Start Quiz</QuizButton>
            )}
            {currentState?.startsWith('question') && (
                <div>
                    <p>{questionsData.questions[currentQuestionIndex]}</p>

                    {questionsData.answers[currentQuestionIndex].map((answer, index) => (
                        <div key={index}>
                            <QuizButton className={isCorrect === false && selectedAnswerIndices?.includes(index) ? 'error' : ''} onClick={() => answerQuestion(answer, index)}>{answer}</QuizButton>
                        </div>
                    ))}

                </div>
            )}

            {isCorrect === true && selectedAnswerIndices.length> 0 && (<div>Nice! {questionsData.correctAnswers[currentQuestionIndex]}</div>)}
            {isCorrect === false && (<div>Very nice answer...but for totaly other question....</div>)}
            {showNextButton && (<QuizButton onClick={()=> {
                fsm.transition(`answer${currentQuestionIndex+1}`);
                setCurrentState(fsm.currentState.name);
                setCurrentQuestionIndex(currentQuestionIndex+1);
                setShowNextButton(false);
                setIsCorrect(null);
                setSelectedAnswerIndices([]);
            }}>Next</QuizButton>)}

            {currentState === 'finish' && (
                <div>
                    <p>Quiz completed!</p>
                    <p>Correct answers:</p>
                    <ul>
                        {questionsData.correctAnswers.map((answer, index) => (
                            <li key={index}>{answer}</li>
                        ))}
                    </ul>
                    <p>Your answers:</p>
                    <ul>
                        {userAnswers.map((answer, index) => (
                            <li key={index}>{answer}</li>
                        ))}
                    </ul>
                </div>
            )}
        </QuizContainer>
    );
};

export default Quiz;

