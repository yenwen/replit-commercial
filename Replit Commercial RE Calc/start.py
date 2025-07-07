
#!/usr/bin/env python3
"""
Startup script for Commercial RE Calculator on Replit
"""

import os
import subprocess
import sys
import time

def run_command(command, description, cwd=None):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True, cwd=cwd)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e}")
        if e.stderr:
            print(f"Error output: {e.stderr}")
        return False

def main():
    print("🚀 Starting Commercial RE Calculator...")
    
    # Check if we're in the right directory
    if not os.path.exists("backend") or not os.path.exists("frontend"):
        print("❌ Please run this script from the 'Replit Commercial RE Calc' directory")
        sys.exit(1)
    
    # Install Python dependencies if needed
    try:
        import fastapi
        print("✅ Python dependencies already installed")
    except ImportError:
        print("📦 Installing Python dependencies...")
        run_command("pip install -e .", "Installing Python packages", cwd=".")
    
    # Check if Node dependencies are installed
    if not os.path.exists("frontend/node_modules"):
        print("📦 Installing Node.js dependencies...")
        run_command("npm install", "Installing Node.js packages", cwd="frontend")
    else:
        print("✅ Node.js dependencies already installed")
    
    print("\n🎉 Setup completed!")
    print("🚀 Starting the application...")
    
    # Start the backend
    print("🔧 Starting backend server...")
    subprocess.Popen(["python", "app/main_simple.py"], cwd="backend")
    
    # Wait a moment for backend to start
    time.sleep(3)
    
    # Start the frontend
    print("🎨 Starting frontend server...")
    subprocess.run(["npm", "run", "dev"], cwd="frontend")

if __name__ == "__main__":
    main()
