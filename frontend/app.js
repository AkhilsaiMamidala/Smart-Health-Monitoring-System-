const backendURL = "http://localhost:3000";

// MetaMask Connection
let accounts;
window.ethereum
  .request({ method: "eth_requestAccounts" })
  .then((acc) => {
    accounts = acc;
    console.log("Connected MetaMask Accounts:", accounts);
  })
  .catch((err) => {
    console.error("MetaMask Connection Error:", err.message);
    alert("Failed to connect to MetaMask. Please try again.");
  });

// Add Patient Form Handling
const patientForm = document.getElementById("patientForm");
const addPatientBtn = document.getElementById("addPatientBtn");
const formContainer = document.getElementById("formContainer");
const messageContainer = document.getElementById("message");

// Toggle Form Visibility
if (addPatientBtn) {
  addPatientBtn.addEventListener("click", () => {
    formContainer.classList.toggle("hidden");
  });
}

if (patientForm) {
  patientForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const uniqueId = document.getElementById("uniqueId").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const condition = document.getElementById("condition").value;

    if (!uniqueId) {
      showMessage("Unique ID is required.", "error");
      return;
    }

    // Get the current date and time
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().replace(/[-:T.]/g, "_");

    try {
      // Simulate MetaMask Transaction
      console.log("Initiating MetaMask transaction...");
      const transaction = await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: accounts[0],
            to: "0x04E9FA1fcD8beE4220E7A7059Ad32b8AdD2e5c4D",
            value: "0x0",
            data: "0x",
          },
        ],
      });

      console.log("Transaction Successful. Hash:", transaction);

      // Send Patient Data to Backend with a timestamped filename
      const response = await fetch(`${backendURL}/addPatient`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uniqueId,
          phoneNumber,
          condition,
          transactionHash: transaction,
          fileName: `patient_record_${formattedDate}.json`,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to save patient record.");
      }

      const data = await response.json();
      showMessage(`Patient saved successfully! Transaction Hash: ${data.txHash}`, "success");

      // Fetch patient history again to show the updated list
      fetchHistory();
    } catch (error) {
      console.error("Error Saving Patient:", error.message);
      showMessage(`Error: ${error.message}`, "error");
    }
  });
}

// Fetch Patient History
const historyContainer = document.getElementById("historyContainer");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

async function fetchHistory(searchName = "") {
  try {
    console.log("Fetching patient history...");
    const idsResponse = await fetch(`${backendURL}/patients`);
    if (!idsResponse.ok) throw new Error("Failed to fetch patient IDs.");

    const ids = await idsResponse.json();
    historyContainer.innerHTML = "";

    for (const id of ids) {
      const patientResponse = await fetch(`${backendURL}/patients/${id}`);
      if (!patientResponse.ok) throw new Error(`Failed to fetch data for ID: ${id}`);

      const patientRecords = await patientResponse.json();

      patientRecords.forEach((patient) => {
        if (searchName && patient.uniqueId.toLowerCase() !== searchName.toLowerCase()) {
          return;
        }

        const recordDiv = document.createElement("div");
        recordDiv.className = "record";
        recordDiv.innerHTML = `
          <p><strong>Unique ID:</strong> ${patient.uniqueId}</p>
          <p><strong>Phone Number:</strong> ${patient.phoneNumber}</p>
          <p><strong>Condition:</strong> ${patient.condition}</p>
          <p><strong>Transaction Hash:</strong> ${patient.transactionHash}</p>
        `;
        historyContainer.appendChild(recordDiv);
      });
    }
  } catch (error) {
    console.error("Error Fetching History:", error.message);
    showMessage(`Error: ${error.message}`, "error");
  }
}

// Add search functionality
if (searchButton) {
  searchButton.addEventListener("click", () => {
    const searchName = searchInput.value.trim();
    fetchHistory(searchName);
  });
}

// Initial load of all patients
fetchHistory();

function showMessage(message, type) {
  messageContainer.className = type;
  messageContainer.textContent = message;
}
