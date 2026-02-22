import os
import time
from groq import Groq, RateLimitError
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_response(prompt: str):
    # Tiered models for fallback in case of rate limits
    # Smaller models like 8b-instant have significantly higher rate limits
    # Models listed in order of preference
    models = ["llama-3.3-70b-versatile", "llama-3.1-70b-versatile", "llama-3.1-8b-instant"]
    
    for model in models:
        max_retries = 3
        for attempt in range(max_retries):
            try:
                print(f"Attempting generation with {model} (Attempt {attempt + 1})...")
                completion = client.chat.completions.create(
                    model=model,
                    messages=[
                        {"role": "system", "content": "You are a multilingual syllabus-aware AI tutor."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.2,
                )
                return completion.choices[0].message.content
            except RateLimitError:
                print(f"RATE_LIMIT exceeded for {model}. Backing off...")
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt)  # Exponential backoff: 1s, 2s, 4s
                    continue
                else:
                    print(f"Switching from {model} due to persistent rate limit.")
            except Exception as e:
                print(f"ERROR with {model}: {str(e)}")
                break  # Try next model in the list
                
    return "The system is currently experiencing extremely high traffic. Please try again in 1-2 minutes."