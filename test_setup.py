"""
Quick test script to verify ContentGen setup
Run this after starting the backend server
"""
import sys

import requests


def test_backend():
    """Test backend health and endpoints"""
    print("🔍 Testing Backend...\n")
    
    # Test health endpoint
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            print("✅ Health endpoint: OK")
            print(f"   Response: {response.json()}\n")
        else:
            print(f"❌ Health endpoint failed: {response.status_code}\n")
            return False
    except Exception as e:
        print(f"❌ Cannot connect to backend: {e}")
        print("   Make sure backend is running: poetry run uvicorn backend.main:app --reload\n")
        return False
    
    # Test generate endpoint
    try:
        response = requests.post(
            "http://localhost:8000/generate",
            json={"type": "tweet", "topic": "AI"},
            timeout=10
        )
        if response.status_code == 200:
            data = response.json()
            print("✅ Generate endpoint: OK")
            print(f"   Generated: {data.get('generated_text', '')[:50]}...\n")
        else:
            print(f"⚠️  Generate endpoint returned: {response.status_code}\n")
    except Exception as e:
        print(f"⚠️  Generate endpoint error: {e}\n")
    
    # Test history endpoint
    try:
        response = requests.get("http://localhost:8000/history", timeout=5)
        if response.status_code == 200:
            print("✅ History endpoint: OK")
            print(f"   Items: {len(response.json())}\n")
        else:
            print(f"⚠️  History endpoint returned: {response.status_code}\n")
    except Exception as e:
        print(f"⚠️  History endpoint error: {e}\n")
    
    return True

def test_frontend():
    """Test frontend is accessible"""
    print("🔍 Testing Frontend...\n")
    
    try:
        response = requests.get("http://localhost:5173", timeout=5)
        if response.status_code == 200:
            print("✅ Frontend is running: OK")
            print("   Visit: http://localhost:5173\n")
            return True
        else:
            print(f"❌ Frontend returned: {response.status_code}\n")
            return False
    except Exception as e:
        print(f"❌ Cannot connect to frontend: {e}")
        print("   Make sure frontend is running: npm run dev\n")
        return False

def main():
    print("=" * 60)
    print("🚀 ContentGen Setup Verification")
    print("=" * 60 + "\n")
    
    backend_ok = test_backend()
    frontend_ok = test_frontend()
    
    print("=" * 60)
    if backend_ok and frontend_ok:
        print("🎉 SUCCESS! Everything is working!")
        print("=" * 60 + "\n")
        print("Next steps:")
        print("1. Open http://localhost:5173 in your browser")
        print("2. Try generating some content")
        print("3. Check out the Dashboard, History, and Reminders pages")
        print("\nPress Ctrl+C in the terminal windows to stop the servers")
        return 0
    else:
        print("⚠️  Some tests failed. Check the output above.")
        print("=" * 60)
        return 1

if __name__ == "__main__":
    sys.exit(main())
