#!/usr/bin/env python3
"""
Setup script for Commercial RE Calculator on Replit
"""

import os
import subprocess
import sys

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e}")
        print(f"Error output: {e.stderr}")
        return False

def main():
    print("🚀 Setting up Commercial RE Calculator for Replit...")
    
    # Check if we're in Replit
    if not os.getenv("REPL_ID"):
        print("⚠️  This script is designed for Replit. Some features may not work elsewhere.")
    
    # Install Python dependencies
    print("\n📦 Installing Python dependencies...")
    if not run_command("pip install -r backend/requirements.txt", "Installing Python packages"):
        print("⚠️  Some Python packages may not be available. The app will run with limited functionality.")
    
    # Install Node.js dependencies (if Node.js is available)
    print("\n📦 Installing Node.js dependencies...")
    if os.path.exists("frontend/package.json"):
        if not run_command("cd frontend && npm install", "Installing Node.js packages"):
            print("⚠️  Node.js dependencies installation failed. Frontend may not work properly.")
    else:
        print("⚠️  Frontend package.json not found. Skipping Node.js setup.")
    
    # Create necessary directories
    print("\n📁 Creating directories...")
    os.makedirs("backend/uploads", exist_ok=True)
    os.makedirs("backend/logs", exist_ok=True)
    
    # Create a basic .env file if it doesn't exist
    env_file = "backend/.env"
    if not os.path.exists(env_file):
        print("\n⚙️  Creating basic .env file...")
        env_content = """# Commercial RE Calculator Environment Variables
# Generated automatically for Replit

# Database - Using SQLite for Replit
DATABASE_URL=sqlite:///./commercial_re_calc.db

# Security
SECRET_KEY=replit-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=["http://localhost:3000","https://*.replit.co","https://*.replit.dev"]

# Auth0 (optional for MVP)
AUTH0_DOMAIN=
AUTH0_AUDIENCE=
AUTH0_ISSUER=

# OpenAI (optional for MVP)
OPENAI_API_KEY=

# Stripe (optional for MVP)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads

# App Settings
DEBUG=true
ENVIRONMENT=development
REPLIT_MODE=true
"""
        with open(env_file, "w") as f:
            f.write(env_content)
        print("✅ Created .env file")
    
    # Create a simple test script
    print("\n🧪 Creating test script...")
    test_script = """#!/usr/bin/env python3
import requests
import time

def test_api():
    print("🧪 Testing API...")
    try:
        # Wait a moment for the server to start
        time.sleep(2)
        
        # Test the root endpoint
        response = requests.get("http://localhost:8000/")
        if response.status_code == 200:
            print("✅ API is running!")
            print(f"Response: {response.json()}")
        else:
            print(f"❌ API returned status code: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to API. Make sure the server is running.")
    except Exception as e:
        print(f"❌ Test failed: {e}")

if __name__ == "__main__":
    test_api()
"""
    
    with open("test_api.py", "w") as f:
        f.write(test_script)
    
    print("✅ Created test script")
    
    print("\n🎉 Setup completed!")
    print("\n📋 Next steps:")
    print("1. Run the backend: python backend/app/main.py")
    print("2. Test the API: python test_api.py")
    print("3. Visit the docs: https://your-repl-url.replit.co/docs")
    print("4. Set up environment variables in the Secrets tab if needed")
    
    print("\n🔧 To run the full application:")
    print("- Backend: python backend/app/main.py")
    print("- Frontend: cd frontend && npm run dev (if Node.js is available)")

if __name__ == "__main__":
    main() 