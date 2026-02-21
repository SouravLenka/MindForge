import requests

# Test the doubt resolution through the Vite proxy
proxy_url = "http://localhost:5173/api/ask/"

payload = {
    "question": "what is SDLC",
    "explanation_mode": "Step-by-Step",
    "difficulty_level": "Intermediate"
}

print(f"Testing connectivity to {proxy_url}...")

try:
    response = requests.post(proxy_url, json=payload, timeout=60)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")
except Exception as e:
    print(f"Test Failed: {e}")
