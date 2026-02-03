# ECITT PWA – Quick Start

## What This App Does

**ECITT** (Early Childhood Inhibitory Touchscreen Task) measures response inhibition in infants and toddlers. The app has two main modes:

- **Controller** – Experimenter runs trials on a computer (select study, participant, test, start/stop).
- **Responder** – Child performs the task on an iPad (touchscreen).

The hierarchy you see in the UI is:

| Level      | Meaning                                        |
|------------|------------------------------------------------|
| **Project**   | A study (e.g. “Pilot 2025”).                   |
| **Test Set**  | A group or batch within a project.             |
| **Part**      | A participant (child) in that test set.        |
| **Test**      | The specific ECITT measure (e.g. “9 Months”).  |

You run **tests** on **participants** inside **test sets** inside **projects**.

---

## First-Time Startup Flow

### 1. One-time setup

- **PHP 8+** and **MySQL 8+** installed.
- Database created, schema imported from `database/schema_workbench.sql`. This creates tables and inserts the `admin` user plus global admin permission (required for **Add new** to work).
- `private/libs/php/dbLib.php` updated with your MySQL user/password/database.

### 2. Start the server

- **Windows:** run `start-server.bat` (or `start-with-ngrok.bat` for iPhone/iPad access)
- **Mac/Linux:** run `./start-server.sh`

### 3. Open the app

- **Computer (laptop)**: `http://localhost:8000` (or `http://127.0.0.1:8000`)
- **iPad/iPhone**: 
  - **If using ngrok**: Use the ngrok URL shown (e.g., `https://abc123.ngrok.io`) - works from anywhere!
  - **If using direct IP**: `http://YOUR_COMPUTER_IP:8000` (both devices must be on same network)

### 4. Log in

- User: `admin`
- Password: `admin`

### 5. Use the Controller (first time)

1. **Connect**  
   - Tap **Connect**.  
   - On Windows, EventSource often fails; the app switches to “Compatibility mode” and continues. That’s expected.

2. **Tests**  
   - Tap **Tests** (not Games for the usual ECITT flow).

3. **Project**  
   - You start with no projects.  
   - Tap **Add new** → enter a name (e.g. “Pilot 2025”) → **Save**.  
   - Select that project in the dropdown → **Enter**.

4. **Test Set**  
   - Again, none yet.  
   - **Add new** → name (e.g. “Cohort 1”) → **Save**.  
   - Select it → **Enter**.

5. **Part (participant)**  
   - **Add new** → fill participant ref, birth date, etc. → **Save**.  
   - Select the participant → **Enter**.

6. **Test**  
   - Choose a test (e.g. “9 Months”, “Box Test”) → **Enter**.  
   - You’ll see the trial control interface (see below).

### Understanding the Trial Control Interface

After selecting a test, you'll see trial sections like:

```
Prtc PR Top
0    0    4
[Cancel]

Test PR Top  
0    0    0
[Cancel] [x 32]
```

**What this means:**
- **"Prtc PR Top"** = Practice trial, Prepotent Response, Top location
- **"Test PR Top"** = Test trial, Prepotent Response, Top location
- Numbers show: `[Total] [Correct] [Required]`
- **"x 32"** button = Run 32 trials
- **Cancel** = Stop the current trial

**How to use:**
1. Click **"x 32"** (or "x 4" for practice) to start trials
2. Watch counters update as participant responds
3. Click **Cancel** to stop if needed
4. System auto-advances when requirements are met

### 6. Connect Responder (iPad) to Controller

**On the Controller (Computer):**
- Already connected (step 5.1)
- Navigate to your test (steps 5.2-5.6)

**On the Responder (iPad):**

1. **Open Responder**
   - Go to `http://YOUR_IP:8000` (use computer's IP, not localhost)
   - Find your IP: On Windows, run `ipconfig`, look for "IPv4 Address"
   - Example: If IP is `192.168.1.100`, use `http://192.168.1.100:8000`
   - Click **Responder** → Log in as `admin` / `admin`

2. **Connect**
   - Click **Connect** button
   - iPad shows "Available for Connection" or "Ready"

3. **Start trials**
   - On Controller, click a trial button (e.g., **"x 32"**)
   - Trial automatically appears on iPad
   - Child interacts on iPad; you monitor counters on Controller

**Important:**
- Both devices must be on the same Wi-Fi network
- Controller shows "Connected" when ready
- Responder shows "Available for Connection" when ready

---

## Short “First Time” Checklist

1. Run DB setup (schema_workbench.sql, dbLib config).
2. Start server → open app → log in as `admin` / `admin`.
3. **Connect** (accept compatibility mode on Windows if it appears).
4. **Tests** → **Add new** project → **Save** → **Enter**.
5. **Add new** test set → **Save** → **Enter**.
6. **Add new** part → **Save** → **Enter**.
7. Pick a **Test** → **Enter** → run trials.

---

## Deleting Projects / Test Sets / Participants

- **Select** the item in the dropdown.
- Tap **Edit** (shows Update/Delete).
- Tap **Delete**.

---

## Troubleshooting

### "Select Test" dropdown is empty

The test list comes from the **ecitt_testSpec** table. If you used an older schema or a clean DB, it may be empty.

**Fix:** Run `database/fix_test_dropdown.sql` against your `ecitt_db` (e.g. in MySQL Workbench). This ensures tests exist AND admin has permissions to see them. Then refresh the Controller and open **Select Test** again.

### iPad can't load the site / Responder doesn't connect

**Understanding the server configuration:**
- The server binds to `0.0.0.0:8000` - this means "listen on all network interfaces" (not an IP you use)
- You still need to use your **computer's actual IP address** on the iPad (e.g., `192.168.1.100:8000`)
- `0.0.0.0` is just the server setting, not the address to access it

**Step-by-step fix:**

1. **Find your computer's IP address:**
   - **Windows:** Open Command Prompt, type `ipconfig`, look for "IPv4 Address" (usually starts with 192.168.x.x)
   - **Mac/Linux:** Open Terminal, type `ifconfig | grep 'inet '` or `ip addr show`
   - Example: `192.168.1.100`

2. **Verify server is running:**
   - Check that `start-server.bat` (Windows) or `./start-server.sh` (Mac/Linux) is running
   - The server window should show "Starting server on 0.0.0.0:8000"
   - **Keep this window open** while using the app

3. **Fix Windows Firewall (CRITICAL - most common issue):**
   
   **Option A: Add firewall rule (Recommended)**
   - Open Command Prompt **as Administrator** (Right-click → Run as administrator)
   - Run this command:
     ```
     netsh advfirewall firewall add rule name="ECITT Server Port 8000" dir=in action=allow protocol=TCP localport=8000
     ```
   - This allows incoming connections on port 8000
   
   **Option B: Allow PHP through firewall**
   - Go to: Windows Settings → Privacy & Security → Windows Security → Firewall & network protection
   - Click "Allow an app through firewall"
   - Click "Change settings" → "Allow another app"
   - Browse to your PHP executable (e.g., `C:\xampp\php\php.exe` or `D:\coding\PHP\php.exe`)
   - Check both "Private" and "Public" networks
   - Click OK
   
   **Option C: Temporarily disable firewall (for testing only)**
   - Go to: Windows Settings → Privacy & Security → Windows Security → Firewall & network protection
   - Turn off firewall for your network (Private network)
   - **WARNING:** Only for testing! Turn it back on after.
   
   **Verify firewall fix:**
   - Run `test-connection.bat` (in the project folder) to diagnose
   - Or manually check: `netstat -an | findstr ":8000"` should show `0.0.0.0:8000` in LISTENING state

4. **Use the correct address on iPad:**
   - On iPad, use: `http://YOUR_COMPUTER_IP:8000`
   - Example: If your IP is `192.168.1.100`, use `http://192.168.1.100:8000`
   - **Do NOT use** `localhost` or `0.0.0.0` on the iPad

5. **Verify same network:**
   - Both computer and iPad must be on the same Wi-Fi network
   - Check iPad Wi-Fi settings to confirm network name matches

6. **Test connection:**
   - On computer, open `http://localhost:8000` - should work
   - On iPad/iPhone, open `http://YOUR_IP:8000` - should work
   - If computer works but iPad doesn't, it's **definitely Windows Firewall** - see step 3 above
   
7. **Run diagnostic tool:**
   - Double-click `test-connection.bat` in the project folder
   - This will show your IP, check if server is listening, and test firewall rules
   - Follow the instructions it provides

8. **If firewall rules exist but still not working:**
   - The existing firewall rules might be incorrect (outbound instead of inbound)
   - **Right-click** `fix-firewall.bat` → **Run as administrator**
   - This will remove old rules and add the correct inbound rule
   - Then test again on iPad/iPhone

9. **Verify firewall rule is correct:**
   - Run `check-firewall-rules.bat` to see detailed firewall rule information
   - Make sure there's an **INBOUND** rule (not just OUTBOUND)
   - If only OUTBOUND rule exists, run `fix-firewall.bat` again as administrator

10. **Additional checks if still not working:**
   
    **A. Test from another computer on same network:**
    - Try accessing `http://10.23.4.150:8000` from another computer on the same Wi-Fi
    - If another computer also can't connect, it's a network/firewall issue
    - If another computer CAN connect, it's an iPad-specific issue
   
    **B. Check Windows Defender Firewall with Advanced Security:**
    - Press Windows key, type "Windows Defender Firewall with Advanced Security"
    - Go to "Inbound Rules"
    - Look for "ECITT Server Port 8000" - make sure it's **Enabled** and **Allow**
    - If it doesn't exist or is disabled, that's the problem
   
    **C. Check antivirus/third-party firewall:**
    - Many antivirus programs (Norton, McAfee, Kaspersky, etc.) have their own firewall
    - Check your antivirus settings for firewall/network protection
    - Temporarily disable antivirus firewall to test (remember to re-enable!)
   
    **D. University WiFi / Network-level blocking (MOST LIKELY CAUSE):**
    - **AP Isolation**: University networks commonly enable "AP Isolation" or "Client Isolation" - this prevents devices from talking to each other for security
    - **Network firewall**: University networks often have firewalls at the router/switch level blocking device-to-device communication
    - **VLAN restrictions**: Devices may be on different VLANs that can't communicate
    - **Solution options:**
      1. **Contact University IT** (see below for what to request)
      2. **Use mobile hotspot** for testing (quick workaround)
      3. **Use ngrok tunnel** (bypasses network restrictions)
   
    **E. University IT Request Template:**
    ```
    Subject: Request to Disable AP Isolation for Research Equipment
    
    Hello IT Support,
    
    I'm running research equipment that requires device-to-device communication 
    on our university WiFi network. I have a local web server running on port 8000 
    that needs to be accessible from iPads on the same network.
    
    Currently, devices cannot communicate with each other, likely due to AP 
    Isolation or Client Isolation being enabled on the WiFi network.
    
    Could you please:
    1. Disable AP Isolation / Client Isolation for my devices, OR
    2. Whitelist port 8000 for device-to-device communication, OR
    3. Provide guidance on how to enable this for research purposes
    
    My devices:
    - Computer IP: 10.23.4.150
    - Port: 8000
    - Purpose: ECITT research equipment (Early Childhood Inhibitory Touchscreen Task)
    
    Thank you!
    ```
   
    **F. Workaround: Mobile Hotspot (Quick Solution)**
    - **CRITICAL:** Disconnect from university WiFi first (only use hotspot)
    - Connect your computer to your phone's mobile hotspot
    - Start the server (`start-server.bat`) - **keep it running**
    - Run `ipconfig` and find the **hotspot adapter** IP (not WiFi IP)
      - Look for adapter showing "Media State: Connected" for hotspot
      - Usually 192.168.x.x (hotspot) vs 10.x.x.x (university WiFi)
    - Connect iPad/iPhone to the **same** phone hotspot
    - On iPad/iPhone, use: `http://HOTSPOT_IP:8000` (make sure it's `http://` not `https://`)
    - **If laptop can access via IP but iPhone/iPad can't (iPhone-specific issue):**
      
      **Try these in order:**
      
      1. **Use a different browser on iPhone:**
         - Try Chrome or Firefox on iPhone (Safari is stricter)
         - Download from App Store if needed
         - Access: `http://HOTSPOT_IP:8000`
      
      2. **Check iPhone Safari settings:**
         - Settings → Safari → Advanced → Experimental Features
         - Look for "Allow HTTP" or "Insecure HTTP" - enable if available
         - Settings → Safari → Clear History and Website Data (clear cache)
      
      3. **Try private/incognito mode:**
         - Open Safari → tap tabs icon → "Private"
         - Try accessing `http://HOTSPOT_IP:8000` in private mode
      
      4. **Verify URL format:**
         - Must be exactly: `http://192.168.x.x:8000` (replace with your IP)
         - NOT `https://` (iPhone may auto-redirect - type `http://` explicitly)
         - NOT missing `:8000` port number
         - Try typing the full URL in address bar, don't use autocomplete
      
      5. **Check iPhone error message:**
         - What exactly does iPhone show? (timeout, "can't connect", blank page, etc.)
         - This helps identify the specific issue
      
      6. **Test from another device:**
         - Try accessing from another phone/tablet on same hotspot
         - If another device works → iPhone-specific issue
         - If nothing works → Server/firewall issue
      
      7. **iPhone network settings:**
         - Settings → Wi-Fi → tap (i) next to hotspot name
         - Make sure "Auto-Join" is on
         - Try forgetting and rejoining the hotspot
      
      8. **If iPhone/iPad can't connect (connection timeout, no server activity):**
         - **QUICKEST SOLUTION: Use ngrok** (bypasses all network/firewall/iOS issues):
           - Run `start-with-ngrok.bat` (starts server + ngrok tunnel)
           - Copy the ngrok URL shown (e.g., `https://abc123.ngrok.io`)
           - Use that URL on iPhone/iPad instead of IP address
           - Works from anywhere, no Local Network Access needed!
         - **If you prefer to fix network access:**
           - **iOS Local Network Access**: Settings → Privacy → Local Network → Enable Safari
           - Make sure iPhone and laptop have DIFFERENT IPs (iPhone usually .1, laptop .2-.4)
           - On iPhone, use laptop's IP: `http://172.20.10.4:8000` (not iPhone's IP)
           - If still no activity in server window → Use ngrok (see above)
   
    **G. ngrok Setup (Recommended for iPhone/iPad)**
    - **Easiest solution** - bypasses all network issues
    - Download ngrok: https://ngrok.com/download
    - Sign up for free account: https://dashboard.ngrok.com/signup
    - Get auth token: https://dashboard.ngrok.com/get-started/your-authtoken
    - Run: `ngrok config add-authtoken YOUR_TOKEN`
    - Then run: `start-with-ngrok.bat`
    - Use the ngrok URL on iPhone/iPad (works from anywhere!)
    - **Note:** Free ngrok URLs change each restart; paid plans have fixed URLs

### Trials don't appear on iPad / Controller not starting tasks

**Symptoms:**
- Responder shows "Available for Connection" or "Ready"
- Controller shows "Connected" but clicking trial buttons doesn't start tasks

**Root Cause:**
- PHP on Windows doesn't support Unix sockets (used for Controller↔Responder communication)
- Events are queued but Responder can't receive them

**Fix Applied:**
- Modified `eventLib.php` to poll queue files when Unix sockets fail
- This allows events to be delivered even on Windows

**To Test:**
1. **Refresh both pages:**
   - Controller: Refresh browser → Click Connect
   - Responder: Refresh browser → Click Connect
2. **Wait for both to show "Connected"/"Ready"**
3. **Click a trial button on Controller** (e.g., "x 32")
4. **Trial should now appear on Responder**

**If still not working:**
- Check browser console (F12 → Console) on Controller for errors
- Check `start-server.bat` window for activity when clicking trial buttons
- Make sure both Controller and Responder are logged in as `admin`
- Try refreshing both pages and reconnecting

---

## More Detail

- Full install and DB setup: see **README.md**.
- Data management: use **Data manager** from the app index.
