import React, { useState } from "react";
import CryptoJS from "crypto-js";
import axios from "axios";
import Web3 from "web3";
import CertiStorageABI from "./CertiStorageABI.json";

function App() {
  const [file, setFile] = useState(null);
  const [hash, setHash] = useState("");
  const [cid, setCID] = useState("");
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [studentName, setStudentName] = useState("");
  const [verifyHash, setVerifyHash] = useState("");
const [certificateDetails, setCertificateDetails] = useState(null);


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const generateHash = () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const fileContent = e.target.result;
      const sha256Hash = "0x" + CryptoJS.SHA256(fileContent).toString();
      setHash(sha256Hash);
    };
    reader.readAsText(file);
  };

  const uploadToIPFS = async () => {
  if (!file) {
    alert("Please select a file first!");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  const jwt = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmMmZhYTAzYy1kNmNmLTQzYjktOWUwMS00NDQ0NTYxNDYwOTUiLCJlbWFpbCI6InZlZGFudHNvbmk4MTlAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjY1NjdlZDUzMzFmYjhiNWVkYjdjIiwic2NvcGVkS2V5U2VjcmV0IjoiMGQ2YzZiNTJlYjIxODFmN2FiZTdmNzI1ODAzNjI4YmIwNTdhNzFlMzA2OTg4MDY2MGVkNWIwYjEzNGQyY2E2ZCIsImV4cCI6MTc4MzYwODUzMH0.BEIPuZ7C3PtE_hJOxnRGI91nomytLeWickVFzeiP1FU";

  try {
    const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: jwt,
      },
    });

    setCID(res.data.IpfsHash);
    alert("Uploaded to IPFS via Pinata successfully!");
  } catch (error) {
    console.error("Pinata Upload Error:", error.response ? error.response.data : error);
    alert("Upload failed!");
  }
};

  const connectToBlockchain = async () => {
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return;
  }

  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });

    // 🟠 If not Ganache (0x539 or 1337), then try switching
    if (chainId !== '0x539') {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x539' }],
        });
        console.log("✅ Switched to Ganache!");
      } catch (switchError) {
        alert("❌ Cannot switch to Ganache automatically. Please switch manually in MetaMask.");
        return;
      }
    }

    const web3Instance = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3Instance.eth.getAccounts();

    const contractAddress = "0xD68Fe0b2C15EdE87bB595bdd645c16f29FE8c540"; // your Ganache deployed contract

    const certiContract = new web3Instance.eth.Contract(
      CertiStorageABI,
      contractAddress
    );

    setWeb3(web3Instance);
    setContract(certiContract);
    setAccount(accounts[0]);

    alert("✅ Connected to Ganache Blockchain successfully!");
  } catch (error) {
    console.error("❌ Blockchain connection failed", error);
    alert("Connection failed!");
  }
};



  const storeCertificate = async () => {
    if (!contract) {
      alert("Please connect to blockchain first!");
      return;
    }
    if (!studentName || !hash || !cid) {
      alert("Please fill all details and upload file first!");
      return;
    }

    try {
      await contract.methods
        .storeCertificate(studentName, hash, cid)
        .send({ from: account });

      alert("Certificate stored successfully on blockchain!");
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed!");
    }
  };

const checkNetwork = async () => {
  if (!window.ethereum) {
    alert("MetaMask not detected!");
    return false;
  }

  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    console.log("✅ Detected Chain ID:", chainId);

    // Remove all checks temporarily
    return true;
  } catch (err) {
    console.error("Error getting chain ID:", err);
    return false;
  }
};

const verifyCertificate = async () => {
  if (!contract) {
    alert("Please connect to blockchain first!");
    return;
  }
  if (!verifyHash) {
    alert("Please enter a hash to verify!");
    return;
  }

  try {
    const result = await contract.methods.verifyCertificate(verifyHash).call();
    console.log(result);

    if (result[0]) {
      setCertificateDetails({
        studentName: result[0],
        cid: result[1],
      });
    } else {
      alert("❌ Certificate not found on blockchain.");
      setCertificateDetails(null);
    }
  } catch (error) {
    console.error("Verification failed:", error);
    alert("Verification failed!");
  }
};





  return (
    <div style={{ padding: "30px" }}>
      <h1>Blockchain Certificate Verification</h1>

      <h2>1️⃣ Upload Certificate</h2>
      <input type="file" onChange={handleFileChange} />
      <br /><br />

      <button onClick={generateHash}>Generate SHA-256 Hash</button>
      <br /><br />

      {hash && (
        <div>
          <h3>Generated Hash:</h3>
          <p style={{ wordBreak: "break-all" }}>{hash}</p>
        </div>
      )}

      <br />

      <button onClick={uploadToIPFS}>Upload to IPFS</button>
      <br /><br />

      {cid && (
        <div>
          <h3>IPFS CID:</h3>
          <p>{cid}</p>
          <a
            href={`https://ipfs.io/ipfs/${cid}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on IPFS
          </a>
        </div>
      )}

      <br />
      <hr />

      <h2>2️⃣ Blockchain Connection</h2>
      <button onClick={connectToBlockchain}>Connect to Ganache Blockchain</button>
      <br /><br />
      {account && <p><strong>Connected Account:</strong> {account}</p>}

      <hr />
      <h2>3️⃣ Store Certificate on Blockchain</h2>
      <input
        type="text"
        placeholder="Enter Student Name"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
      />
      <br /><br />
      <button onClick={storeCertificate}>Store on Blockchain</button>
      <br /><br />

      <hr />
<h2>4️⃣ Verify Certificate by Hash</h2>
<input
  type="text"
  placeholder="Enter SHA-256 Hash"
  value={verifyHash}
  onChange={(e) => setVerifyHash(e.target.value)}
/>
<br /><br />
<button onClick={verifyCertificate}>Verify Certificate</button>
<br /><br />

{certificateDetails && (
  <div>
    <h3>✅ Certificate Found:</h3>
    <p><strong>Student Name:</strong> {certificateDetails.studentName}</p>
    <p><strong>IPFS CID:</strong> {certificateDetails.cid}</p>
    <a
      href={`https://ipfs.io/ipfs/${certificateDetails.cid}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      View Certificate on IPFS
    </a>
  </div>
)}


    </div>
  );
}

export default App;