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

// Favicon route
app.get("/favicon.ico", (req, res) => {
  const faviconPath = path.join(__dirname, "public", "favicon.ico");
  if (fs.existsSync(faviconPath)) {
    res.sendFile(faviconPath);
  } else {
    res.status(404).end();
  }
});

// Manifest and logos
app.get("/manifest.json", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "manifest.json"));
});
app.get("/logo192.png", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "logo192.png"));
});
app.get("/logo512.png", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "logo512.png"));
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

// Start server on Railway port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
