### Core Functionalities:

**User Subscription Input**
Users can input subscription details: name, price, frequency, renewal date, and category.

**Payment Reminders**
Schedule reminders for upcoming renewals using Upstash workflows.

**Upcoming Renewals**
Fetch subscriptions sorted by the next renewal date.

**Total Monthly Expenses**
Calculate the total monthly/annual costs for all subscriptions.

**Subscription Analytics**
Provide insights into subscription usage.

**Secure User Authentication**
Implement user registration, login, and JWT-based authentication.

---


# Database
MONGO_URI=mongodb://localhost:27017/subscriptionDB

# JWT & Security
JWT_SECRET=your_jwt_secret
ARCJET_KEY=your_arcjet_key

# Upstash QStash & Workflow
QSTASH_TOKEN=your_qstash_token
QSTASH_CURRENT_SIGNING_KEY=your_current_signing_key
QSTASH_NEXT_SIGNING_KEY=your_next_signing_key
VPS_PUBLIC_IP=https://your-public-domain.com

# EmailJS
EMAILJS_SERVICE_ID=your_emailjs_service_id
EMAILJS_TEMPLATE_ID=your_emailjs_template_id
EMAILJS_USER_ID=your_emailjs_user_id


---
Here's a comprehensive and **step-by-step markdown guide** to deploy your Node.js app to a VPS server, based on our troubleshooting journey:

---

# **Step-by-Step Guide to Deploy Your Node.js App to a VPS**

This guide explains how to deploy your Node.js app to a VPS (Hostinger in this case) and ensure it is accessible via your server's public IP. It also includes the troubleshooting steps we resolved together to make the deployment work.

---

## **Prerequisites**

1. **Host a Node.js App**:
   - Make sure your Node.js app (e.g., `subscription-tracker-api`) is ready with `app.js` or `server.js` as the entry point.
   - Ensure it has the required dependencies listed in `package.json`.

2. **VPS Access**:
   - Access to a VPS server (Hostinger in this case).
   - SSH credentials for your VPS.

3. **Tools Installed Locally**:
   - `ssh` to connect to the VPS.
   - `git` to clone the repository or transfer files.

---

## **Step 1: Connect to Your VPS**

1. Log into your VPS via SSH:
   ```bash
   ssh root@<your-vps-ip>
   ```
   Replace `<your-vps-ip>` with the IP address of your VPS (e.g., `147.93.94.120`).

2. Once logged in, update your VPS packages:
   ```bash
   apt update && apt upgrade -y
   ```

---

## **Step 2: Install Required Software**

1. Install Node.js (LTS version):
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
   apt install -y nodejs
   ```

2. Verify Node.js and npm installation:
   ```bash
   node -v
   npm -v
   ```

3. Install PM2 to manage your Node.js app:
   ```bash
   npm install -g pm2
   ```

4. Install Nginx to act as a reverse proxy:
   ```bash
   apt install nginx -y
   ```

---

## **Step 3: Transfer Your App to the VPS**

### **Option 1: Clone the Repository Using Git**
1. Install `git` on your VPS:
   ```bash
   apt install git -y
   ```

2. Clone your repository:
   ```bash
   git clone https://github.com/<your-username>/<your-repo-name>.git
   ```

3. Navigate to the project folder:
   ```bash
   cd <your-repo-name>
   ```

### **Option 2: Transfer Files Directly**
If you’re not using Git:
1. Use `scp` to transfer files from your local machine to the VPS:
   ```bash
   scp -r /path/to/your/project root@<your-vps-ip>:/var/www/<your-project>
   ```

2. SSH into your VPS and navigate to the project directory:
   ```bash
   cd /var/www/<your-project>
   ```

---

## **Step 4: Set Up the App**

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your environment variables:
   ```bash
   nano .env
   ```
   Example `.env`:
   ```env
   PORT=5500
   MONGO_URI=your_mongo_connection_string
   EMAILJS_SERVICE_ID=your_service_id
   EMAILJS_TEMPLATE_ID=your_template_id
   EMAILJS_USER_ID=your_user_id
   QSTASH_TOKEN=your_qstash_token
   ```

3. Start the app using PM2:
   ```bash
   pm2 start app.js --name subscription-tracker
   ```

4. Save the PM2 process list to restart on reboot:
   ```bash
   pm2 save
   pm2 startup
   ```

---

## **Step 5: Configure Nginx**

### **Create a New Nginx Configuration**

1. Create a new Nginx configuration file:
   ```bash
   nano /etc/nginx/sites-available/subscription-tracker
   ```

2. Add the following content:
   ```nginx
   server {
       listen 80;

       server_name <your-ipv4-address>; # Replace with your VPS IPv4 address

       location / {
           proxy_pass http://localhost:5500; # Replace with your app's port
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. Save and exit (`Ctrl + O`, then `Enter`, then `Ctrl + X`).

### **Enable the Configuration**
1. Create a symlink to enable the configuration:
   ```bash
   ln -s /etc/nginx/sites-available/subscription-tracker /etc/nginx/sites-enabled/
   ```

2. Test the Nginx configuration:
   ```bash
   nginx -t
   ```

3. Restart Nginx:
   ```bash
   systemctl restart nginx
   ```

---

## **Step 6: Open Firewall Ports**

Ensure that traffic on port `80` (HTTP) is allowed:
```bash
ufw allow 80
ufw enable
```

---

## **Step 7: Test Your App**

1. Visit your app in the browser using the public IPv4 address:
   ```
   http://<your-ipv4-address>
   ```

2. If you see:
   ```json
   {"error":{"message":"Not Found","status":404}}
   ```
   This means your app is running but doesn’t serve anything at the root (`/`). You can add routes to your app as needed.

---

## **Step 8: Troubleshooting**

### **Issue: Nginx Welcome Page Shows**
- This happens when the default Nginx configuration is still active. Disable it:
  ```bash
  sudo rm /etc/nginx/sites-enabled/default
  sudo systemctl restart nginx
  ```

### **Issue: Port 5500 Not Responding**
- Ensure the app is running and accessible locally:
  ```bash
  curl http://localhost:5500
  ```

### **Issue: Permission Denied**
- Use `sudo` to execute commands requiring elevated privileges.

---

## **Optional: Add a Domain**
1. Point your domain’s DNS to your VPS IP (add an A record).
2. Update `server_name` in your Nginx config with your domain name:
   ```nginx
   server_name yourdomain.com;
   ```
3. Restart Nginx:
   ```bash
   systemctl restart nginx
   ```

---

With these steps, you should have your Node.js app successfully deployed and accessible on your VPS. Let me know if you need further clarification!


---
To update the code on your VPS, you need to pull the latest changes from your repository (if you're using Git) or re-upload the updated files. Here’s a step-by-step guide:

---

### **1. If You’re Using Git**

#### **Step 1.1: Check Current Code State**
1. SSH into your VPS:
   ```bash
   ssh root@<your-vps-ip>
   ```

2. Navigate to your project directory:
   ```bash
   cd /path/to/your/project
   ```

#### **Step 1.2: Pull the Latest Changes**
1. Ensure the correct branch is checked out:
   ```bash
   git branch
   ```
   If not, switch to the appropriate branch:
   ```bash
   git checkout <branch-name>
   ```

2. Pull the latest changes:
   ```bash
   git pull origin <branch-name>
   ```

---

### **2. If You’re Not Using Git**

#### **Option 1: Upload Files via SCP**
1. From your local machine, upload the updated files to the VPS:
   ```bash
   scp -r /local/path/to/project root@<your-vps-ip>:/path/to/project
   ```
   Replace `/local/path/to/project` with your local project path and `/path/to/project` with the directory on your VPS.

#### **Option 2: Use File Managers (Optional)**
- You can use tools like **FileZilla** or **WinSCP** to upload updated files to the VPS.

---

### **3. Install Dependencies (if Updated)**

If you’ve added or updated any dependencies in `package.json`, run the following commands in your project directory:

1. Install dependencies:
   ```bash
   npm install
   ```

2. If you’ve removed unused dependencies:
   ```bash
   npm prune
   ```

---

### **4. Restart the Application**

After updating the code, you need to restart your app to apply the changes. Use PM2 (or any other process manager you’re using):

1. Restart the app:
   ```bash
   pm2 restart subscription-tracker
   ```

2. If PM2 isn’t running the app, start it:
   ```bash
   pm2 start app.js --name subscription-tracker
   ```

3. Save the process to restart automatically on reboot:
   ```bash
   pm2 save
   ```

---

### **5. Verify the Changes**

#### **Step 5.1: Test Locally on the VPS**
1. Test if the app is running locally:
   ```bash
   curl http://localhost:5500
   ```
   - Replace `5500` with the port your app is running on.

#### **Step 5.2: Test Publicly**
1. Open your app’s public URL in the browser:
   ```bash
   http://<your-vps-ip>
   ```

---

### **6. Debug If Needed**
1. Check PM2 logs for errors:
   ```bash
   pm2 logs subscription-tracker
   ```

2. Check Nginx logs:
   ```bash
   tail -f /var/log/nginx/error.log
   ```

3. Test API endpoints using `curl`:
   ```bash
   curl -X POST http://<your-vps-ip>/api/workflow \
   -H "Content-Type: application/json" \
   -d '{"subscriptionId": "your-subscription-id"}'
   ```

---

### **Summary**

1. Use `git pull` or re-upload files to update your code.
2. Install dependencies with `npm install` if necessary.
3. Restart your app with PM2: `pm2 restart subscription-tracker`.
4. Test locally and publicly to ensure the update is applied.

Let me know if you need help with any specific step!