
#!/usr/bin/env python3
"""
Test script to verify the application setup
"""

import requests
import time
import sys

def test_backend():
    """Test if the backend is running"""
    try:
        response = requests.get("http://localhost:5000/health", timeout=5)
        if response.status_code == 200:
            print("✅ Backend is running correctly")
            return True
        else:
            print(f"❌ Backend returned status code: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to backend. Make sure it's running on port 5000.")
        return False
    except Exception as e:
        print(f"❌ Backend test failed: {e}")
        return False

def test_frontend():
    """Test if the frontend is running"""
    try:
        response = requests.get("http://localhost:3000", timeout=5)
        if response.status_code == 200:
            print("✅ Frontend is running correctly")
            return True
        else:
            print(f"❌ Frontend returned status code: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to frontend. Make sure it's running on port 3000.")
        return False
    except Exception as e:
        print(f"❌ Frontend test failed: {e}")
        return False

def main():
    print("🧪 Testing Commercial RE Calculator setup...")
    
    print("\n🔍 Testing backend...")
    backend_ok = test_backend()
    
    print("\n🔍 Testing frontend...")
    frontend_ok = test_frontend()
    
    if backend_ok and frontend_ok:
        print("\n🎉 All tests passed! Your application is running correctly.")
        print("📖 Backend API docs: http://localhost:5000/docs")
        print("🎨 Frontend: http://localhost:3000")
    else:
        print("\n❌ Some tests failed. Check the output above for details.")
        sys.exit(1)

if __name__ == "__main__":
    main()
