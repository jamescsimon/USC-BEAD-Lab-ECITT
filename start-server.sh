#!/bin/bash
# ECITT Web App Server Startup Script for macOS/Linux

echo "Starting ECITT Web App Server..."
echo ""

# Check for PHP
if ! command -v php &> /dev/null; then
    echo "ERROR: PHP not found!"
    echo ""
    echo "Please install PHP:"
    echo "- macOS: brew install php"
    echo "- Or download from: https://www.php.net/downloads.php"
    echo ""
    exit 1
fi

echo "Found PHP: $(which php)"
echo "PHP Version: $(php -v | head -n 1)"
echo ""
echo "Make sure you have:"
echo "1. MySQL server running"
echo "2. Database configured in private/libs/php/dbLib.php"
echo ""
echo "Starting PHP development server..."
echo ""
echo "IMPORTANT: For iPad access, use your computer's IP address instead of localhost"
echo "Example: http://192.168.1.100:8000"
echo ""
echo "To find your IP address:"
echo "macOS: Open Terminal and type: ifconfig | grep 'inet '"
echo "Look for the IP address (usually starts with 192.168.x.x)"
echo ""
echo "Starting server on 0.0.0.0:8000 (accessible from network)"
echo "Press Ctrl+C to stop the server"
echo ""

cd "$(dirname "$0")/public"
php -S 0.0.0.0:8000

