# 📌 Blockchain-Based Certificate Verification System

A decentralized web application (dApp) to securely store and verify academic certificates using Blockchain (Ethereum + Ganache) and IPFS (via Pinata). It ensures tamper-proof, transparent, and trustless certificate validation.

## 🔗 Live Preview (Optional)
Add deployment link here if hosted via Vercel, Netlify, or localhost demo.

---

## 📈 Features

- ✅ Upload a certificate file (PDF, PNG, etc.)
- 🔐 Generate a SHA-256 hash of the file for unique identity
- 📁 Upload the certificate to IPFS via Pinata
- ⛓ Store student name, certificate hash, and IPFS CID on a local Ethereum blockchain (Ganache)
- ✅ Verify certificate authenticity using the hash
- 🧒 MetaMask integration for wallet and transactions

---

## 🛠 Tech Stack

| Technology       | Purpose                          |
|------------------|----------------------------------|
| React.js         | Frontend Framework               |
| Web3.js          | Blockchain Interaction           |
| Solidity         | Smart Contract Language          |
| Ganache          | Local Ethereum Test Blockchain   |
| MetaMask         | Wallet & Blockchain Connector    |
| IPFS + Pinata    | Decentralized File Storage       |
| CryptoJS         | SHA-256 Hashing                  |

---

## 🚀 Getting Started

### 1. Clone the Repository

bash
git clone https://github.com/yourusername/certi-verification-pro.git
cd certi-verification-pro


### 2. Install Dependencies

bash
npm install


### 3. Start the React App

bash
npm start


The app will run on http://localhost:3000

---

## ⚙ Blockchain Setup

### Ganache

- Open Ganache GUI
- Use RPC: http://127.0.0.1:7545
- Chain ID: 1337
- Network ID: 5777

### MetaMask Setup

1. Open MetaMask → Add Network
2. Set:
   - Network Name: Ganache Local
   - RPC URL: http://127.0.0.1:7545
   - Chain ID: 1337
   - Currency: ETH

3. Import one of the Ganache test accounts

---

## 📦 Smart Contract (CertiStorage.sol)

solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertiStorage {
    struct Certificate {
        string studentName;
        string ipfsHash;
    }

    mapping(bytes32 => Certificate) public certificates;

    function storeCertificate(string memory _studentName, bytes32 _certiHash, string memory _ipfsHash) public {
        certificates[_certiHash] = Certificate(_studentName, _ipfsHash);
    }

    function verifyCertificate(bytes32 _certiHash) public view returns (string memory, string memory) {
        Certificate memory certi = certificates[_certiHash];
        return (certi.studentName, certi.ipfsHash);
    }
}


✅ Deployed on Ganache  
✅ Interacted using Web3.js and React frontend

---

## 🧪 How to Use

1. Upload a certificate
2. Generate SHA-256 hash
3. Upload to IPFS
4. Connect MetaMask to Ganache
5. Store certificate on blockchain
6. Verify using certificate hash

---

## 📷 Screenshots

![image](https://github.com/user-attachments/assets/5fefb688-a964-4009-99bc-31ee250a1399)


---

## 🙇‍♂ Author

Vedant soni   

---

## 📝 License

This project is licensed under the MIT License — feel free to use and modify.
