const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Use middleware to parse JSON request bodies
app.use(express.json());

// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

// Define the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'page1.html'));
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'page2.html'));
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'page5.html'));
});

// Define the /submit-successful route
app.get('/submit-successful', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'page6.html'));
});

// Handle the /save-review POST route
app.post('/save-review', (req, res) => {
    console.log("Received data:", req.body); // Log the received data

    const reviewData = req.body;

    // Check if any required fields are missing
    for (let key in reviewData) {
        if (!reviewData[key]) {
            return res.status(400).json({ success: false, message: `${key} is required` });
        }
    }

    // Correct file path for reviews.json located in the backend folder
    const filePath = path.join(__dirname, 'reviews.json');
    
    // Read the existing data from the JSON file
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Failed to read file' });
        }

        let reviews = [];
        if (data) {
            reviews = JSON.parse(data);
        }

        // Add the new review to the list
        reviews.push(reviewData);

        // Write the updated reviews back to the file
        fs.writeFile(filePath, JSON.stringify(reviews, null, 2), 'utf-8', (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Failed to save data' });
            }
            res.json({ success: true, message: 'Review saved successfully' });
        });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
