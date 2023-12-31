import styled from 'styled-components';

export const QuizContainer = styled.div`
  text-align: center;
  padding: 20px;
  background-color: #f0f0f0;
`;

export const QuizMessage = styled.div`
  text-align: center;
  padding: 20px;
  background-color: #f0f0f0;
  border: 1px solid gray;
  border-radius: 2px;
  margin-top: 5px;
`;

// Define a styled component for the quiz title
export const QuizTitle = styled.h1`
  color: #333;
`;

// Define a styled component for buttons
export const QuizButton = styled.button`
  background-color: #0074d9;
  color: #fff;
  padding: 10px 20px;
  border: none;
  margin: 5px;
  cursor: pointer;
  width: 300px;
  &.error {
    background-color: red;
  }
  &.correct {
    background-color: green;
  }
  &.disabled {
    cursor: not-allowed;
    disabled;
  }
  
  &.next{
    margin-top: 107px;
  }
`;


