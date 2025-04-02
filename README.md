# QRscanner
I created a QR code scanner for the amazing race. Each of the created images are used for the teams to get a hint of what the game will be. In this way, it will add an element of fun to the entire amazing race. 

This app used **react environment**. However, in order for the mobile device to successfully scan the QR code using its camera it needs to run on `HTTPS`. Therefore it requires an SSL certificate for the device to run.

## Step 1: Use an SSL certificate
Visit [SSL Certificate for create-react-app](https://github.com/reyden142/SSLcertificate) for a step-by-step process on how to get an SSL certificate. 

## Step 2: Set Up a Web Server (Nginx)
To serve your website securely with HTTPS, you'll need to set up a web server like Nginx or Apache. Here's how you can set it up:
- Nginx: Nginx is a high-performance, lightweight web server commonly used to serve production sites.
- Apache: Apache is another popular web server, known for its robustness and wide feature set.

## Step 3: How to setup Nginx
1. Download [Nginx](https://nginx.org/en/download.html)
2. Download the mainline version (the ZIP file) for Windows. The file should be something like nginx-<version>.zip.
3. Extract the downloaded ZIP file to a folder on your system (e.g., C:\nginx).
4. Open a Command Prompt (cmd) as an administrator.
5. Navigate to the folder where you extracted Nginx.
```bash
cd C:\nginx
```
6. Run the following command to start Nginx:
```bash
start nginx
```
7. Open your browser and visit `http://localhost`. You should see the Nginx welcome page, indicating the server is running.

## Step 4: Setting Up SSL on Nginx in Windows
1. Create a folder an ssl folder (`C:\nginx\ssl`)
2. Place your certificate (`cert.pem`) and private key (`key.pem`) files in a folder (e.g., `C:\nginx\ssl`).
3. Edit the `nginx.conf` file in `C:\nginx\conf` and update the server block to include the following:
```bash
server {
    listen 443 ssl;
    server_name yourdomain.com;  # Your domain

    ssl_certificate C:/nginx/ssl/cert.pem;
    ssl_certificate_key C:/nginx/ssl/key.pem;

    # Other configurations...
}
```
4. Restart Nginx to apply the changes:
```bash
nginx -s reload
```

