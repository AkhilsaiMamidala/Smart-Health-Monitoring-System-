# Smart Health Monitoring System

This project is a Smart Health Monitoring System that integrates IoT with Blockchain using Hardhat for Ethereum smart contracts. It allows secure and transparent storage of health data on the blockchain.

---

## 🛠️ Project Structure

```
root/
│
├── backend/              # Hardhat-based smart contract setup
│   ├── contracts/        # Solidity smart contracts
│   ├── scripts/          # Deployment and interaction scripts
│   ├── test/             # Test files
│   ├── hardhat.config.js
│   └── package.json
│
└── frontend/             # Your website or dashboard (optional)
```

---

## 🚀 How to Set Up Backend (Hardhat)

Follow the steps below to initialize and install dependencies for the backend (Hardhat) setup:

### 1. Open terminal and navigate to the backend folder:

```bash
cd backend
```

### 2. Initialize a Node.js project (if not already initialized):

```bash
npm init -y
```

### 3. Install Hardhat and required dependencies:

```bash
npm install --save-dev hardhat
```

> If you plan to write, test, and deploy contracts, also install these:

```bash
npm install --save-dev @nomicfoundation/hardhat-toolbox
```

Optional dependencies:

```bash
npm install ethers dotenv
```

### 4. Create a Hardhat project (if not already created):

```bash
npx hardhat
```

Choose:

- `Create a basic sample project`
- Press `Enter` for the default path
- Choose `Y` to install dependencies

---

## 📂 Key Commands

### Compile contracts:
```bash
npx hardhat compile
```

### Run tests:
```bash
npx hardhat test
```

### Deploy contracts (custom script):
```bash
npx hardhat run scripts/deploy.js --network localhost
```

---

## ⚡ Run Local Blockchain

Start a local Ethereum node (Hardhat Network):

```bash
npx hardhat node
```

Then deploy to it with:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

---

## 🧪 Testing

You can add test cases inside the `test/` folder using Mocha/Chai and run:

```bash
npx hardhat test
```

---

## 📄 Environment Variables (Optional)

Create a `.env` file to store private keys, Infura/Alchemy URLs:

```
PRIVATE_KEY=your_private_key
RPC_URL=https://your_rpc_provider
```

Use it in `hardhat.config.js`:

```js
require('dotenv').config();
```

---

## 📬 Questions?

Feel free to open an issue or reach out to [Akhilsai Mamidala](https://github.com/AkhilsaiMamidala) on GitHub!
