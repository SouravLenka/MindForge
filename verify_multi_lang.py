import requests
import json

def test_language(language, question="What is the V-Model?"):
    url = "http://127.0.0.1:8000/ask/"
    payload = {
        "question": question,
        "explanation_mode": "Quick Answer",
        "difficulty_level": "Basic",
        "language": language
    }
    headers = {"Content-Type": "application/json"}
    
    print(f"Testing language: {language}")
    try:
        response = requests.post(url, json=payload, headers=headers)
        if response.status_code == 200:
            print(f"SUCCESS: {language}")
            print(json.dumps(response.json(), indent=2, ensure_ascii=False))
        else:
            print(f"FAILED: {language} (Status {response.status_code})")
            print(response.text)
    except Exception as e:
        print(f"ERROR: {str(e)}")

if __name__ == "__main__":
    test_language("Hindi")
    test_language("Spanish", "Explain SDLC")
    test_language("English")
