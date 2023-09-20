import React from 'react';
import './App.css';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import QuizLayout from './components/QuizLayout';

const theme = createTheme();

function App() {
    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <QuizLayout/>
            </div>
        </ThemeProvider>
    );
}

export default App;
