const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 4000;

// Enable CORS (Cross-Origin Resource Sharing) middleware
app.use(cors());

// Enable JSON request parsing middleware
app.use(express.json());

// Function to read JSON data from a file
function readJsonFile(filePath) {
    try {
        // Read the file synchronously and parse its content as JSON
        const data = fs.readFileSync(path.join('data',filePath) , 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading data/${filePath}:`, error);
        return null;
    }
}

// Define a route to get JSON data
app.get('/api/questions', (req, res) => {
    // Read data from JSON files
    const questions = readJsonFile('questions.json');
    const answersOptions = readJsonFile('answers-options.json');
    const correctAnswers = readJsonFile('correctAnswers.json');
    const correctAnswersIndex = readJsonFile('correctAnswersIndex.json');

    if (questions && answersOptions && correctAnswers && correctAnswersIndex) {
        // Send the JSON data as a response
        res.json({
            questions,
            answersOptions,
            correctAnswers,
            correctAnswersIndex,
        });
    } else {
        // Handle errors and return a 500 status code with an error message
        res.status(500).json({ error: 'Failed to read JSON data from files' });
    }
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
