# Quick Diagnostic Test for ContentGen

import json

import requests

print("🔍 ContentGen Backend Diagnostic Test\n")
print("="*60)

# Test 1: Health Check
print("\n1️⃣ Testing Backend Health...")
try:
    response = requests.get("http://localhost:8000/health", timeout=5)
    print(f"   ✅ Backend is UP - Status: {response.status_code}")
    print(f"   Response: {response.json()}")
except Exception as e:
    print(f"   ❌ Backend is DOWN - Error: {e}")
    print("\n   Please make sure the backend is running:")
    print("   python start.py")
    exit(1)

# Test 2: CORS Check
print("\n2️⃣ Testing CORS Headers...")
try:
    headers = response.headers
    cors_headers = {k: v for k, v in headers.items() if 'access-control' in k.lower()}
    if cors_headers:
        print("   ✅ CORS headers present:")
        for key, value in cors_headers.items():
            print(f"      {key}: {value}")
    else:
        print("   ⚠️  No CORS headers found")
except Exception as e:
    print(f"   ❌ Error checking CORS: {e}")

# Test 3: Generate Endpoint (without auth)
print("\n3️⃣ Testing Generate Endpoint...")
try:
    payload = {
        "type": "tweet",
        "topic": "artificial intelligence",
        "user_id": "test-user",
        "model": "groq"
    }
    
    print(f"   Sending request to http://localhost:8000/generate/")
    print(f"   Payload: {json.dumps(payload, indent=2)}")
    
    response = requests.post(
        "http://localhost:8000/generate/",
        json=payload,
        timeout=30
    )
    
    print(f"\n   Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ SUCCESS!")
        print(f"   Generated: {data.get('generated_text', '')[:100]}...")
    else:
        print(f"   ❌ FAILED")
        print(f"   Error: {response.text}")
        
except requests.exceptions.ConnectionError:
    print("   ❌ Connection Error - Backend not reachable")
    print("   Make sure backend is running on http://localhost:8000")
except requests.exceptions.Timeout:
    print("   ❌ Timeout - Request took too long")
    print("   This might be an API key issue or network problem")
except Exception as e:
    print(f"   ❌ Error: {e}")

print("\n" + "="*60)
print("\n📋 Summary:")
print("   If all tests pass, the issue is likely in the frontend.")
print("   Check browser console for detailed error messages.")
print("\n   Common issues:")
print("   - CORS: Make sure FRONTEND_ORIGIN is set correctly")
print("   - API Key: Verify GROQ_API_KEY is valid")
print("   - Network: Check if frontend can reach backend URL")
