// src/App.tsx
import React from 'react';
import './App.css';
import Quiz from './components/Quiz';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import FSM from './components/FSM';

const theme = createTheme();

function App() {
    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <Quiz/>
            </div>
        </ThemeProvider>
    );
}

export default App;
