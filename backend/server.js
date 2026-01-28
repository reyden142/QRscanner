const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const QRCodeReader = require("qrcode-reader");
const Jimp = require("jimp"); // Needed for qrcode-reader image parsing

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from "public" and "uploads"
app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve React frontend static files (this should serve manifest.json, favicon, etc.)
app.use(express.static(path.join(__dirname, "../frontend/build")));

// Favicon route - check frontend build first, then backend public
app.get("/favicon.ico", (req, res) => {
  const frontendFavicon = path.join(__dirname, "../frontend/build", "favicon.ico");
  const backendFavicon = path.join(__dirname, "public", "favicon.ico");

  if (fs.existsSync(frontendFavicon)) {
    res.sendFile(frontendFavicon);
  } else if (fs.existsSync(backendFavicon)) {
    res.sendFile(backendFavicon);
  } else {
    res.status(404).end();
  }
});

// Manifest and logos - check frontend build first
app.get("/manifest.json", (req, res) => {
  const frontendManifest = path.join(__dirname, "../frontend/build", "manifest.json");
  const backendManifest = path.join(__dirname, "public", "manifest.json");

  if (fs.existsSync(frontendManifest)) {
    res.sendFile(frontendManifest);
  } else if (fs.existsSync(backendManifest)) {
    res.sendFile(backendManifest);
  } else {
    res.status(404).end();
  }
});

app.get("/logo192.png", (req, res) => {
  const frontendLogo = path.join(__dirname, "../frontend/build", "logo192.png");
  const backendLogo = path.join(__dirname, "public", "logo192.png");

  if (fs.existsSync(frontendLogo)) {
    res.sendFile(frontendLogo);
  } else if (fs.existsSync(backendLogo)) {
    res.sendFile(backendLogo);
  } else {
    res.status(404).end();
  }
});

app.get("/logo512.png", (req, res) => {
  const frontendLogo = path.join(__dirname, "../frontend/build", "logo512.png");
  const backendLogo = path.join(__dirname, "public", "logo512.png");

  if (fs.existsSync(frontendLogo)) {
    res.sendFile(frontendLogo);
  } else if (fs.existsSync(backendLogo)) {
    res.sendFile(backendLogo);
  } else {
    res.status(404).end();
  }
});

// Helper function: decode QR code from base64 image
function readQRCodeFromBase64(base64Image) {
  return new Promise(async (resolve, reject) => {
    try {
      const buffer = Buffer.from(base64Image.split(",")[1], "base64");
      const image = await Jimp.read(buffer);
      const qr = new QRCodeReader();
      qr.callback = (err, value) => {
        if (err) return reject(err);
        resolve(value ? value.result : null);
      };
      qr.decode(image.bitmap);
    } catch (err) {
      reject(err);
    }
  });
}

// QR processing route
app.post("/process-qr", async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: "No image provided" });

    const qrData = await readQRCodeFromBase64(image);

    if (!qrData) return res.status(404).json({ error: "QR code not found" });

    // Build public URL from QR data
    // Replace with your Railway domain
    const fullImageUrl = `https://${process.env.HOSTNAME || "qrscanner-production-002e.up.railway.app"}${qrData}`;
    res.json({ result: fullImageUrl });
  } catch (error) {
    console.error("QR Processing Error:", error);
    res.status(500).json({ error: "Failed to read QR code" });
  }
});

// Catch-all handler: send back React's index.html file for all non-API routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

// Start server on Railway port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});