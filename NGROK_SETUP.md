# ngrok Setup for iPhone/iPad Access

**This is the easiest solution** - bypasses all network/firewall/iOS Local Network Access issues!

## Quick Setup

1. **Download ngrok**: https://ngrok.com/download
   - Extract `ngrok.exe` to this folder or add to your PATH

2. **Sign up** (free): https://dashboard.ngrok.com/signup

3. **Get your auth token**: https://dashboard.ngrok.com/get-started/your-authtoken

4. **Configure ngrok** (one-time setup):
   ```
   ngrok config add-authtoken YOUR_TOKEN_HERE
   ```

5. **Start server with ngrok**:
   - Run `start-with-ngrok.bat`
   - This starts both the ECITT server AND ngrok tunnel

6. **Use the ngrok URL on iPhone/iPad**:
   - Copy the URL shown (e.g., `https://abc123.ngrok.io`)
   - Use that URL on iPhone/iPad - works from anywhere!

## Benefits

- ✅ Works from any network (no Local Network Access needed)
- ✅ Bypasses Windows Firewall issues
- ✅ Bypasses iOS security restrictions
- ✅ Works on university WiFi
- ✅ Works on mobile hotspot
- ✅ Works from anywhere!

## Note

- Free ngrok URLs change each time you restart
- Paid ngrok plans offer fixed URLs if needed
