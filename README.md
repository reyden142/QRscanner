# QRscanner
I created a QR code scanner for the Amazing Race. Each generated QR code provides teams with a hint about the upcoming game, adding an element of fun to the entire Amazing Race.

This app uses a React environment. For mobile devices to successfully scan QR codes using the camera, the app must run on `HTTPS`. Therefore, an SSL certificate is required for the device to function properly.

## Step 1: Use an SSL certificate
Visit [SSL Certificate for create-react-app](https://github.com/reyden142/SSLcertificate) for a step-by-step process on how to obtain an SSL certificate. 

## Step 2: Set Up a Web Server (Nginx)
To serve your website securely with HTTPS, you'll need to set up a web server like Nginx or Apache. Here’s an overview:
- Nginx: Nginx is a high-performance, lightweight web server commonly used to serve production sites.
- Apache: Apache is another popular web server, known for its robustness and wide feature set.

## Step 3: Setting Up Nginx
1. Download [Nginx](https://nginx.org/en/download.html)
2. Download the mainline version (the ZIP file) for Windows. The file should be something like `nginx-<version>.zip`.
3. Extract the downloaded ZIP file to a folder on your system (e.g., `C:\nginx`).
4. Open a Command Prompt (`cmd`) as an administrator.
5. Navigate to the folder where you extracted Nginx:
```bash
cd C:\nginx
```
6. Start Nginx by running:
```nginx
start nginx
```
7. Open your browser and visit `http://localhost`. You should see the Nginx welcome page, indicating the server is running.

## Step 4: Setting Up SSL on Nginx in Windows
1. Create an ssl folder (`C:\nginx\ssl`)
2. Place your certificate (`cert.pem`) and private key (`key.pem`) files in a folder (e.g., `C:\nginx\ssl`).
3. Edit the `nginx.conf` file in `C:\nginx\conf` and update the server block to include the following:
```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;  # Your domain

    ssl_certificate C:/nginx/ssl/cert.pem;
    ssl_certificate_key C:/nginx/ssl/key.pem;

    # Additional configurations can be added here...
}
```
4. Restart Nginx to apply the changes:
```nginx
nginx -s reload
```

# Connecting React environment to Nginx

## Step 1: Build the React App
Run the following command in your project directory:
```bash
npm run build
```
## Step 2: Copy the Build Files to Nginx’s Web Root
Move your React app’s build folder to the Nginx web root directory. Open Command Prompt as Administrator and run:
```bash
xcopy /E /I /Y build\* C:\nginx\html\
```
