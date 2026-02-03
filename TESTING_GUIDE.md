# Quick Testing Guide - Controller (Laptop) + Responder (iPhone)

## Fastest Method: Use ngrok

### Step 1: Start Server
- Double-click `start-with-ngrok.bat`
- Copy the ngrok URL shown (e.g., `https://abc123.ngrok.io`)

### Step 2: Controller (Laptop)
1. Open browser: `http://localhost:8000`
2. Login: `admin` / `admin`
3. Click **Controller**
4. Click **Connect**

### Step 3: Responder (iPhone)
1. Open Safari
2. Go to: **[ngrok URL]** (from Step 1)
3. Login: `admin` / `admin`
4. Click **Responder**
5. Click **Connect**

### Step 4: Test
- On Controller: Navigate to Tests → Select project/test set/participant/test
- Click trial button (e.g., "x 32")
- Trial should appear on iPhone!

---

## Alternative: Direct IP (Same Wi-Fi)

### Step 1: Find Your IP
- Open Command Prompt
- Type: `ipconfig`
- Find "IPv4 Address" (e.g., `192.168.1.100`)

### Step 2: Start Server
- Double-click `start-server.bat`
- **Fix firewall:** Right-click `fix-firewall.bat` → Run as administrator

### Step 3: Controller (Laptop)
1. Open: `http://localhost:8000`
2. Login: `admin` / `admin`
3. Click **Controller** → **Connect**

### Step 4: Responder (iPhone)
1. Open Safari
2. Go to: `http://YOUR_IP:8000` (replace YOUR_IP with your actual IP)
3. Login: `admin` / `admin`
4. Click **Responder** → **Connect**

---

## Troubleshooting

**iPhone can't connect?**
- Use ngrok method (easiest!)
- Or check firewall: run `fix-firewall.bat` as admin

**Trials don't appear?**
- Refresh both pages
- Reconnect both Controller and Responder
- Check browser console (F12) for errors

**Need help?**
- See `QUICK_START.md` for detailed troubleshooting
