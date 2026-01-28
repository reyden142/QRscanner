![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.19-000000?style=flat&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react&logoColor=black)
![Railway](https://img.shields.io/badge/Railway-Deployed-0B0D0E?style=flat&logo=railway&logoColor=white)

# QRscanner

I created a QR code scanner for the Amazing Race. Each generated QR code provides teams with a hint about the upcoming game, adding an element of fun to the entire Amazing Race.

This app uses a React environment and is deployed using Railway, which already provides HTTPS by default. No additional SSL certificate or web server configuration is required.

# Creating QR Codes

Follow these steps to create QR codes for your images:

## Step 1: Add Image Files
Place your image file inside the `backend\uploads` folder. Supported formats include `.jpg`, `.jpeg`, `.png`, and `.gif`.

## Step 2: Generate QR Code
1. Go to [The QR Code Generator (TQRCG)](https://www.the-qrcode-generator.com/)
2. Select **"Plain Text"** as the QR code type
3. In the "Add message" field, enter the image path using the correct format (see Step 3)

![QR Code Generator Interface](frontend/src/images/SS-QR.png)

## Step 3: Correct Format
Use the following format for the QR code text:
```
/uploads/filename.png
```

**Examples:**
- `/uploads/sample.png`
- `/uploads/logo.jpg`
- `/uploads/image.png`

**Important:**  
The path must start with `/uploads/` followed by the filename and extension. Do not include the full URL or IP address.

## Step 4: Download and Use
After generating the QR code:
1. Download the QR code image
2. Use it in your materials (posters, flyers, etc.)
3. When scanned, it will display the image from your server

**Sample screenshot from a scanned QR code:**

![Scanned QR Code Result](frontend/src/images/SS.png)

---

## Deployment Note (Important)

When deploying this project, you **only need to update the backend hostname**.

The backend dynamically builds the public image URL using an environment variable:

```js
const fullImageUrl = `https://${process.env.HOSTNAME || "qrscanner-production-002e.up.railway.app"}${qrData}`;
```

### How to configure this
1. Open your backend `.env` file (or Railway → Variables)
2. Set your deployed app’s hostname **without `https://`**

```ini
HOSTNAME=your-app-name.up.railway.app
```

If `HOSTNAME` is not set, the app will fall back to the default Railway domain.  
No frontend changes or additional server configuration are required.

---

## Closing Note

This project was built to make interactive games more engaging by combining QR technology with a simple and scalable web setup. Feel free to fork, modify, or adapt this project for your own events, games, or learning purposes.

If you find this useful, a ⭐ on the repository is always appreciated!

---
