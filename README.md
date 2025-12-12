# **KazeWallet API** 🛡️

## Overview
KazeWallet is a robust backend API built with **TypeScript**, **Node.js**, and the **NestJS** framework, leveraging **Prisma** as an ORM for PostgreSQL. This project establishes a hybrid Web2/Web3 healthcare wallet system, integrating blockchain capabilities with traditional backend services to manage medical records, facilitate family health funds (DAO), and provide utility services like drug verification.

## Features
- **Secure Authentication**: User registration, login, and profile management secured with JWT.
- **Decentralized Wallet Management**: On-demand generation and secure (mock) encryption of blockchain wallets using Ethers.js.
- **Family Health DAO**: Create and manage communal health funding pools, submit and vote on claims, with mock blockchain logging for transparency.
- **Medical Record Management**: Upload medical documents, process them with OCR for text extraction, summarize content with AI (mock), and store securely on IPFS with blockchain transaction hashes.
- **Drug Verification**: Utility endpoint to check the authenticity of drugs via a simulated NAFDAC registry lookup.
- **Database Management**: Utilizes Prisma ORM for efficient and type-safe database interactions with PostgreSQL.
- **API Documentation**: Integrated Swagger for comprehensive and interactive API documentation.

## Technologies Used
| Technology          | Description                                                    |
| :------------------ | :------------------------------------------------------------- |
| **NestJS**          | Progressive Node.js framework for building efficient, scalable applications. |
| **TypeScript**      | Strongly typed superset of JavaScript, enhancing code quality. |
| **Prisma ORM**      | Next-generation ORM for Node.js and TypeScript, simplifying database access. |
| **PostgreSQL**      | Powerful, open-source object-relational database system.       |
| **Ethers.js**       | Complete and compact library for interacting with the Ethereum blockchain. |
| **Tesseract.js**    | OCR (Optical Character Recognition) engine for extracting text from images. |
| **IPFS**            | Peer-to-peer network for storing and sharing data in a distributed file system. |
| **JWT**             | JSON Web Tokens for secure API authentication.                 |
| **Swagger (OpenAPI)** | Tool for designing, building, documenting, and consuming RESTful web services. |
| **Bcrypt**          | Library for hashing passwords securely.                        |

## Getting Started

### Installation
To get a local copy up and running, follow these simple steps.

1.  ⬇️ Clone the repository:
    ```bash
    git clone https://github.com/Oluwatise-Ajayi/KazeWallet.git
    cd KazeWallet
    ```
2.  📦 Install dependencies:
    ```bash
    npm install
    ```
3.  ⚙️ Set up your `.env` file (see Environment Variables).
4.  🔄 Run Prisma migrations to set up your database:
    ```bash
    npx prisma migrate dev --name init
    ```
5.  🚀 Start the application in development mode:
    ```bash
    npm run start:dev
    ```

### Environment Variables
The project requires the following environment variables. Create a `.env` file in the root directory and populate it:

```env
# Server Port
PORT=3000

# PostgreSQL Database Connection String
DATABASE_URL="postgresql://user:password@localhost:5432/kazewallet?schema=public"

# JWT Secret Key for token signing
JWT_SECRET="super-secret-jwt-key"

# Blockchain RPC URL (e.g., Polygon Amoy Testnet)
RPC_URL="https://rpc-amoy.polygon.technology"

# Private key for the system wallet (used for blockchain writes in a real scenario)
# Important: In a real production environment, use a secure KMS for managing private keys.
SYSTEM_PRIVATE_KEY="0x..."
```

## Usage
Once the server is running, you can interact with the API.

1.  **Access Swagger UI**: Open your browser and navigate to `http://localhost:3000/docs` (or your configured port). This provides an interactive interface to explore and test all API endpoints.
2.  **API Base Path**: All API endpoints are prefixed with `/api/v1`. For example, a request to register a user would be `POST http://localhost:3000/api/v1/auth/register`.

## API Documentation

### Base URL
`http://localhost:3000/api/v1`

### Authentication
Most endpoints require authentication using a JSON Web Token (JWT). After successful login, you will receive a `token`. This token should be included in the `Authorization` header of subsequent requests as a Bearer token:

`Authorization: Bearer YOUR_JWT_TOKEN`

### Endpoints

#### POST /auth/register
Registers a new user and generates a new blockchain wallet.

**Request**:
```json
{
  "email": "test@example.com",
  "password": "StrongPassword123",
  "fullName": "Test User",
  "role": "PATIENT",
  "phoneNumber": "08012345678"
}
```

**Response**:
```json
{
  "id": "clxb9s26g0000vx3q7o1k0r7z",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "walletAddress": "0x...",
  "role": "PATIENT"
}
```

**Errors**:
- 400 Bad Request: Email already exists.

#### POST /auth/login
Authenticates a user and returns a JWT.

**Request**:
```json
{
  "email": "test@example.com",
  "password": "StrongPassword123"
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clxb9s26g0000vx3q7o1k0r7z",
    "email": "test@example.com",
    "fullName": "Test User",
    "role": "PATIENT",
    "phoneNumber": "08012345678",
    "walletAddress": "0x...",
    "familyPoolId": null,
    "createdAt": "2023-10-26T10:00:00.000Z",
    "updatedAt": "2023-10-26T10:00:00.000Z"
  }
}
```

**Errors**:
- 401 Unauthorized: Invalid credentials.

#### GET /auth/me
Retrieves the profile of the currently authenticated user.

**Request**: (Requires Authorization header)
No payload.

**Response**:
```json
{
  "id": "clxb9s26g0000vx3q7o1k0r7z",
  "email": "test@example.com",
  "fullName": "Test User",
  "role": "PATIENT",
  "phoneNumber": "08012345678",
  "walletAddress": "0x...",
  "familyPoolId": null,
  "createdAt": "2023-10-26T10:00:00.000Z",
  "updatedAt": "2023-10-26T10:00:00.000Z"
}
```

**Errors**:
- 401 Unauthorized: Missing or invalid JWT token.

#### POST /family/create
Creates a new Family Pool (DAO).

**Request**: (Requires Authorization header)
```json
{
  "name": "Okafor Family Fund",
  "monthlyContribution": 5000
}
```

**Response**:
```json
{
  "id": "clxb9s26g0001vx3q7o1k0r7z",
  "name": "Okafor Family Fund",
  "contractAddress": "0xPoolRandomAddress",
  "totalBalance": 0,
  "createdAt": "2023-10-26T10:00:00.000Z",
  "updatedAt": "2023-10-26T10:00:00.000Z"
}
```

**Errors**:
- 401 Unauthorized: Missing or invalid JWT token.

#### GET /family/my-pool
Retrieves details of the authenticated user's family pool.

**Request**: (Requires Authorization header)
No payload.

**Response**:
```json
{
  "id": "clxb9s26g0001vx3q7o1k0r7z",
  "name": "Okafor Family Fund",
  "contractAddress": "0xPoolRandomAddress",
  "totalBalance": 10000,
  "createdAt": "2023-10-26T10:00:00.000Z",
  "updatedAt": "2023-10-26T10:00:00.000Z",
  "members": [
    {
      "id": "clxb9s26g0000vx3q7o1k0r7z",
      "email": "test@example.com",
      "fullName": "Test User",
      "role": "PATIENT",
      "phoneNumber": "08012345678",
      "walletAddress": "0x...",
      "passwordHash": "$2b$10$...",
      "encryptedPKey": "0x...",
      "familyPoolId": "clxb9s26g0001vx3q7o1k0r7z",
      "createdAt": "2023-10-26T10:00:00.000Z",
      "updatedAt": "2023-10-26T10:00:00.000Z"
    }
  ]
}
```

**Errors**:
- 401 Unauthorized: Missing or invalid JWT token.
- 404 Not Found: User does not belong to any family pool.

#### POST /family/fund/:poolId
Funds a family pool (simulated fiat-to-crypto).

**Request**: (Requires Authorization header)
```json
{
  "amount": 5000,
  "currency": "NGN"
}
```

**Response**:
```json
{
  "status": "SUCCESS",
  "newBalance": 10000,
  "message": "Pool funded successfully"
}
```

**Errors**:
- 401 Unauthorized: Missing or invalid JWT token.
- 404 Not Found: Pool not found.
- 400 Bad Request: Invalid input amount.

#### POST /family/claims
Submits a claim proposal to a family pool.

**Request**: (Requires Authorization header)
```json
{
  "poolId": "clxb9s26g0001vx3q7o1k0r7z",
  "amount": 15000,
  "reason": "Malaria Treatment",
  "hospitalWallet": "0xHospitalWalletAddress"
}
```

**Response**:
```json
{
  "id": "clxb9s26g0002vx3q7o1k0r7z",
  "poolId": "clxb9s26g0001vx3q7o1k0r7z",
  "userId": "clxb9s26g0000vx3q7o1k0r7z",
  "amount": 15000,
  "reason": "Malaria Treatment",
  "status": "PENDING",
  "votesFor": 0,
  "votesAgainst": 0,
  "txHash": null,
  "createdAt": "2023-10-26T10:00:00.000Z",
  "updatedAt": "2023-10-26T10:00:00.000Z"
}
```

**Errors**:
- 401 Unauthorized: Missing or invalid JWT token.
- 400 Bad Request: User does not belong to this pool.

#### GET /family/claims/:poolId
Retrieves all claims for a specific family pool.

**Request**: (Requires Authorization header)
No payload.

**Response**:
```json
[
  {
    "id": "clxb9s26g0002vx3q7o1k0r7z",
    "poolId": "clxb9s26g0001vx3q7o1k0r7z",
    "userId": "clxb9s26g0000vx3q7o1k0r7z",
    "amount": 15000,
    "reason": "Malaria Treatment",
    "status": "PENDING",
    "votesFor": 1,
    "votesAgainst": 0,
    "txHash": null,
    "createdAt": "2023-10-26T10:00:00.000Z",
    "updatedAt": "2023-10-26T10:00:00.000Z",
    "user": {
      "fullName": "Test User"
    }
  }
]
```

**Errors**:
- 401 Unauthorized: Missing or invalid JWT token.

#### POST /family/claims/:id/vote
Votes on a specific claim proposal.

**Request**: (Requires Authorization header)
```json
{
  "decision": true
}
```

**Response**:
```json
{
  "status": "VOTED",
  "message": "Vote recorded"
}
```
Or, if approved:
```json
{
  "status": "APPROVED",
  "message": "Vote recorded and claim approved"
}
```

**Errors**:
- 401 Unauthorized: Missing or invalid JWT token.
- 404 Not Found: Claim not found.
- 400 Bad Request: Claim is already finalized.

#### POST /records/upload
Uploads a medical record, processes it via OCR, stores on IPFS, and logs a blockchain transaction.

**Request**: (Requires Authorization header, `multipart/form-data`)
```
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="title"

Malaria Test Result
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="type"

LAB_RESULT
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="hospitalName"

General Hospital, Lagos
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="file"; filename="lab_result.png"
Content-Type: image/png

<binary file content>
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

**Response**:
```json
{
  "id": "clxb9s26g0003vx3q7o1k0r7z",
  "userId": "clxb9s26g0000vx3q7o1k0r7z",
  "type": "LAB_RESULT",
  "title": "Malaria Test Result",
  "summary": "Summary of Malaria Test Result: Patient tested positive for Plasmodium falciparum...",
  "ipfsHash": "QmMockMetadataHash",
  "txHash": "0xRandomTransactionHash",
  "hospitalName": "General Hospital, Lagos",
  "fileUrl": "https://gateway.pinata.cloud/ipfs/QmMockFileHash",
  "createdAt": "2023-10-26T10:00:00.000Z",
  "updatedAt": "2023-10-26T10:00:00.000Z"
}
```

**Errors**:
- 401 Unauthorized: Missing or invalid JWT token.
- 500 Internal Server Error: User wallet not found, OCR/IPFS upload failure.

#### GET /records
Retrieves all medical records for the authenticated user.

**Request**: (Requires Authorization header)
No payload.

**Response**:
```json
[
  {
    "id": "clxb9s26g0003vx3q7o1k0r7z",
    "userId": "clxb9s26g0000vx3q7o1k0r7z",
    "type": "LAB_RESULT",
    "title": "Malaria Test Result",
    "summary": "Summary of Malaria Test Result: Patient tested positive for Plasmodium falciparum...",
    "ipfsHash": "QmMockMetadataHash",
    "txHash": "0xRandomTransactionHash",
    "hospitalName": "General Hospital, Lagos",
    "fileUrl": "https://gateway.pinata.cloud/ipfs/QmMockFileHash",
    "createdAt": "2023-10-26T10:00:00.000Z",
    "updatedAt": "2023-10-26T10:00:00.000Z"
  }
]
```

**Errors**:
- 401 Unauthorized: Missing or invalid JWT token.

#### GET /drugs/verify/:number
Verifies a drug using its NAFDAC number.

**Request**:
Path parameter: `number` (e.g., `04-1234`)

**Response**:
```json
{
  "name": "Amoxil",
  "manufacturer": "Emzor",
  "status": "VERIFIED"
}
```

**Errors**:
- 404 Not Found: Drug not found in NAFDAC registry.

## Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  🍴 Fork the Project
2.  🌱 Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  ✨ Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4.  🚀 Push to the Branch (`git push origin feature/AmazingFeature`)
5.  📬 Open a Pull Request

## Author Info
- **LinkedIn**: [Your LinkedIn Profile](https://linkedin.com/in/yourusername)
- **Twitter**: [@your_twitter](https://twitter.com/your_twitter)
- **Portfolio**: [your-portfolio.com](https://your-portfolio.com)

---
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)](https://github.com/Oluwatise-Ajayi/KazeWallet/actions)
[![License: UNLICENSED](https://img.shields.io/badge/License-UNLICENSED-red.svg)](https://choosealicense.com/licenses/unlicense/)
[![NestJS](https://img.shields.io/badge/-NestJS-ea2845?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/-TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/-Prisma-3982CE?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Swagger](https://img.shields.io/badge/-Swagger-85EA2D?logo=swagger&logoColor=black)](https://swagger.io/)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)