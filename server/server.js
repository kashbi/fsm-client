const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 4000;
// Define a route to get JSON data
const DELAY_TIME = 2000;

// Enable CORS (Cross-Origin Resource Sharing) middleware
app.use(cors());

// Enable JSON request parsing middleware
app.use(express.json());

app.use(express.static(path.join(__dirname,'..', 'build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..','build', 'index.html'));
});

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


app.get('/api/questions', (req, res) => {
    // Read data from JSON files
    const questions = readJsonFile('questions.json');
    const answersOptions = readJsonFile('answers-options.json');
    const correctAnswers = readJsonFile('correctAnswers.json');
    const correctAnswersIndex = readJsonFile('correctAnswersIndex.json');

    if (questions && answersOptions && correctAnswers && correctAnswersIndex) {
        // Send the JSON data as a response
       setTimeout(()=>{
           res.json({
               questions,
               answersOptions,
               correctAnswers,
               correctAnswersIndex,
           });
       }, DELAY_TIME)
    } else {
        // Handle errors and return a 500 status code with an error message
        res.status(500).json({ error: 'Failed to read JSON data from files' });
    }
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
