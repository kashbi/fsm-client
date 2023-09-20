import React, {useState} from 'react';
import {QuizButton, QuizContainer, QuizMessage, QuizTitle} from '../styles/styles';
import {State} from '../hooks/useQuizFSM';

const Quiz = ({currentState, transitionTo, questionsData} ) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [isCorrect, setIsCorrect] = useState(null);
    const [selectedAnswerIndices, setSelectedAnswerIndices] = useState([]);
    const [showNextButton, setShowNextButton] = useState(null);

    const startQuiz = () => {
        if (currentState === State.start) {
            transitionTo('startQuiz'); // This triggers the transition
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
                    setTimeout(() => {
                        if (nextQuestionIndex < questionsData.questions.length) {
                            transitionTo(`answer${nextQuestionIndex}`);
                            setUserAnswers([...userAnswers, selectedAnswer]);
                            setCurrentQuestionIndex(nextQuestionIndex);
                        } else {
                            transitionTo(`answer${nextQuestionIndex}`);
                            setUserAnswers([...userAnswers, selectedAnswer]);
                        }
                    }, 2000);
                }else{
                    setShowNextButton(true);
                }
            }
        }
    };

    return (

        <QuizContainer>
            <QuizTitle>Quiz {questionsData?.questions?.length>0 ? '':' [Loading...]'}</QuizTitle>
            <div>currentState: {currentState}</div>
            {currentState === 'start' && (
                <QuizButton className={questionsData?.questions?.length ? '' : 'disabled'} onClick={startQuiz}>Start Quiz</QuizButton>
            )}
            {currentState?.startsWith('question') && (
                <div>
                    <p>{questionsData.questions[currentQuestionIndex]}</p>

                    {questionsData.answersOptions[currentQuestionIndex].map((answer, index) => (
                        <div key={index}>
                            <QuizButton className={isCorrect === false && selectedAnswerIndices?.includes(index) ? 'error' : ''} onClick={() => answerQuestion(answer, index)}>{answer}</QuizButton>
                        </div>
                    ))}

                </div>
            )}

            {isCorrect === true && selectedAnswerIndices.length === 0 && (<QuizMessage>Nice! {questionsData.correctAnswers[currentQuestionIndex]}</QuizMessage>)}
            {isCorrect === true && selectedAnswerIndices.length > 0 && (<QuizMessage>That's better, as your know...{questionsData.correctAnswers[currentQuestionIndex]}</QuizMessage>)}
            {isCorrect === false && (<QuizMessage>Very nice answer...but for totaly other question....</QuizMessage>)}
            
            {showNextButton && (<QuizButton className="next" onClick={()=> {
                transitionTo(`answer${currentQuestionIndex+1}`);
                setCurrentQuestionIndex(currentQuestionIndex+1);
                setShowNextButton(false);
                setIsCorrect(null);
                setSelectedAnswerIndices([]);
            }}>Next question</QuizButton>)}

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
