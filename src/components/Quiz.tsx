import React, {useState} from 'react';
import {QuizButton, QuizContainer, QuizMessage, QuizTitle} from '../styles/styles';
import {State} from '../hooks/useQuizFSM';
import { Bars } from 'react-loader-spinner';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
const Quiz = ({currentState, transitionTo, questionsData} ) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState([]);
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
                        setIsCorrect(null);
                        if (nextQuestionIndex < questionsData.questions.length) {
                            transitionTo(`answer${nextQuestionIndex}`);
                            setCorrectAnswers([...correctAnswers, selectedAnswer]);
                            setCurrentQuestionIndex(nextQuestionIndex);
                        } else {
                            transitionTo(`answer${nextQuestionIndex}`);
                            setCorrectAnswers([...correctAnswers, selectedAnswer]);

                        }
                    }, 2000);
                }else{
                    setShowNextButton(true);
                }
            }
        }
    };

    return (

        <>
            <QuizTitle>ReactJS Quiz</QuizTitle>
            {
                (!!!questionsData)  && <Bars
                    height="80"
                    width="80"
                    color="#0074d9"
                    ariaLabel="bars-loading"
                    wrapperStyle={{display: 'flex','justify-content': 'center'}}
                    wrapperClass=""
                    visible={true}
                />
            }

            {currentState === 'start' && (
                <QuizButton className={questionsData?.questions?.length ? '' : 'disabled'} onClick={startQuiz}>{!!!questionsData? 'Loading':'Start Quiz'}</QuizButton>
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

            {isCorrect === true && selectedAnswerIndices.length === 0 && (<QuizMessage><div><DoneOutlineIcon></DoneOutlineIcon></div> Nice! {questionsData.correctAnswers[currentQuestionIndex]}</QuizMessage>)}
            {isCorrect === true && selectedAnswerIndices.length > 0 && (<QuizMessage>That's better, as your know...{questionsData.correctAnswers[currentQuestionIndex]}</QuizMessage>)}
            {isCorrect === false && (<QuizMessage><div><SentimentVeryDissatisfiedIcon></SentimentVeryDissatisfiedIcon></div>nice answer...but for totaly other question....</QuizMessage>)}

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
                    <p>Summary</p>
                        {questionsData.correctAnswers.map((answer, index) => (
                            <QuizMessage key={index}>{answer}</QuizMessage>
                        ))}
                    <QuizTitle>Your score: { Math.round(correctAnswers.length / questionsData.questions.length * 100) } % </QuizTitle>

                    <QuizButton onClick={()=>{
                        setCurrentQuestionIndex(0);
                        transitionTo('next');
                        setShowNextButton(false);
                        setIsCorrect(null);
                        setCorrectAnswers([]);
                        setSelectedAnswerIndices([]);}}>
                        So FUN, let's do it all over again
                    </QuizButton>
                </div>
            )}
            </>
    );
};

export default Quiz;

