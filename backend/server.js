const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { read } = require("qrcode-reader");
const cors = require("cors");

// Only load .env file if it exists (for local development)
// In production, use environment variables set by the platform
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});
app.use(express.static('public'));
app.get('/manifest.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'manifest.json'));
});

app.get('/logo192.png', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'logo192.png'));
});

app.get('/logo512.png', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'logo512.png'));
});

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Read SSL certificate and key
const privateKey = fs.readFileSync(path.join(__dirname, "server.key"), "utf8");
const certificate = fs.readFileSync(path.join(__dirname, "server.crt"), "utf8");

// Create an HTTPS service
const credentials = { key: privateKey, cert: certificate };

app.post("/process-qr", async (req, res) => {
  try {
    const { image } = req.body;
    const buffer = Buffer.from(image.split(",")[1], "base64");
    const { data } = await read(buffer);

    // Assuming the QR code contains a relative path like "/uploads/logo.jpg"
    const fullImageUrl = `https://192.168.1.13:8080${data}`; // Use https here

    res.json({ result: fullImageUrl });
  } catch (error) {
    res.status(500).json({ error: "Failed to read QR code" });
  }
});

// Start the HTTPS server
https.createServer(credentials, app).listen(8080, () => {
  console.log("Backend running on HTTPS port 8080");
});
