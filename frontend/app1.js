// Go Back function to navigate to the previous page
function goBack() {
    window.history.back();
}

let accounts;
const contractAddress = "0x04E9FA1fcD8beE4220E7A7059Ad32b8AdD2e5c4D";  // Replace with your contract address
const abi = [
    {
        "inputs": [
            { "internalType": "string", "name": "_uniqueId", "type": "string" },
            { "internalType": "string", "name": "_name", "type": "string" },
            { "internalType": "uint256", "name": "_age", "type": "uint256" },
            { "internalType": "string", "name": "_gender", "type": "string" },
            { "internalType": "string", "name": "_phone", "type": "string" },
            { "internalType": "string", "name": "_address", "type": "string" }
        ],
        "name": "addPatient",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "PatientRegistered",
        "outputs": [
            { "internalType": "string", "name": "uniqueId", "type": "string" },
            { "internalType": "string", "name": "name", "type": "string" },
            { "internalType": "uint256", "name": "age", "type": "uint256" },
            { "internalType": "string", "name": "gender", "type": "string" },
            { "internalType": "string", "name": "phone", "type": "string" },
            { "internalType": "string", "name": "address", "type": "string" }
        ],
        "name": "PatientRegistered",
        "type": "event"
    }
];

const web3 = new Web3(window.ethereum);
const contract = new web3.eth.Contract(abi, contractAddress);

window.ethereum.request({ method: "eth_requestAccounts" })
    .then((acc) => {
        accounts = acc;
        console.log("Connected MetaMask Accounts:", accounts);
    })
    .catch((err) => {
        console.error("MetaMask Connection Error:", err.message);
        alert("Failed to connect to MetaMask. Please try again.");
    });

const newPatientForm = document.getElementById("newPatientForm");

if (newPatientForm) {
    newPatientForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("newName").value;
        const phone = document.getElementById("newPhone").value;
        const address = document.getElementById("newAddress").value;
        const gender = document.getElementById("newGender").value;

        if (!accounts) {
            alert("Please connect to MetaMask first.");
            return;
        }

        try {
            const uniqueId = generateUniqueId();
            const age = 30; // Replace with actual data
            const condition = "Healthy"; // Replace with actual condition

            // Register patient on the blockchain
            const transaction = await contract.methods.addPatient(
                uniqueId, name, age, gender, phone, address
            ).send({ from: accounts[0] });

            console.log("Transaction Successful. Hash:", transaction.transactionHash);

            // Generate a PDF for the patient
            generatePDF(name, phone, address, gender);

            // Save patient data to the backend
            const patientData = { 
                uniqueId, name, age, condition, gender, phone, address, transactionHash: transaction.transactionHash 
            };
            await savePatientToBackend(patientData);

            showMessage("Patient Registered Successfully!", "success");
        } catch (error) {
            console.error("Error during registration:", error);
            showMessage("Error during registration. Please try again.", "error");
        }
    });
}

function generatePDF(name, phone, address, gender) {
    const { jsPDF } = window.jspdf; // Access jsPDF from the window object
    const doc = new jsPDF();
    doc.text(`Patient Name: ${name}`, 10, 10);
    doc.text(`Phone Number: ${phone}`, 10, 20);
    doc.text(`Address: ${address}`, 10, 30);
    doc.text(`Gender: ${gender}`, 10, 40);
    doc.text(`Unique ID: ${generateUniqueId()}`, 10, 50); // Generate a real unique ID here

    // Save the PDF
    doc.save('patient_registration.pdf');
}

function generateUniqueId() {
    return 'ID' + Math.floor(Math.random() * 1000000);
}

async function savePatientToBackend(patientData) {
    const response = await fetch('/addPatient', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
    });

    const data = await response.json();
    console.log('Patient added to backend:', data);
}

function showMessage(message, type) {
    const messageDiv = document.getElementById("message");
    messageDiv.textContent = message;
    messageDiv.className = 'message ' + (type === "success" ? 'success' : 'error');
}
