const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000; // Port number for the backend server

// In-memory data storage for simplicity
let patients = {}; // Store an array of patients for each uniqueId

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse JSON request bodies
app.use(express.static(path.join(__dirname, '../frontend'))); // Serve static files

// Serve the main frontend file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// API Endpoint to fetch all patient IDs
app.get('/patients', (req, res) => {
    const ids = Object.keys(patients);
    res.json(ids); // Return all patient IDs as JSON
});

// API Endpoint to fetch all entries for a specific patient by ID
app.get('/patients/:id', (req, res) => {
    const patientId = req.params.id;
    const patientRecords = patients[patientId];
    if (patientRecords) {
        // Return all records for the patient
        res.json(patientRecords.map(patient => ({
            uniqueId: patient.uniqueId,
            phoneNumber: patient.phoneNumber,
            condition: patient.condition,
            transactionHash: patient.transactionHash,
            fileName: patient.fileName
        })));
    } else {
        res.status(404).send('Patient not found.');
    }
});

// API Endpoint to add a new patient
app.post('/addPatient', (req, res) => {
    const { uniqueId, phoneNumber, condition, transactionHash, fileName } = req.body;

    // Validate input
    if (!uniqueId || !phoneNumber || !condition || !transactionHash || !fileName) {
        return res.status(400).send('All required fields (uniqueId, phoneNumber, condition, transactionHash, fileName) must be provided.');
    }

    // Initialize an array for the uniqueId if it doesn't exist
    if (!patients[uniqueId]) {
        patients[uniqueId] = [];
    }

    // Add the new patient entry to the array
    const newPatient = {
        uniqueId,
        phoneNumber,
        condition,
        transactionHash,
        fileName,
        addedAt: new Date() // Timestamp for when the patient was added
    };

    patients[uniqueId].push(newPatient);

    res.json({
        message: 'Patient added successfully!',
        patient: newPatient,
        txHash: transactionHash,
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
