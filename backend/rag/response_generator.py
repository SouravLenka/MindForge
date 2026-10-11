import os
import time

from dotenv import load_dotenv
from groq import Groq, RateLimitError

load_dotenv()


def generate_response(prompt: str):
    # Create the client only when a response is requested. This lets the API
    # start and health checks pass even if the Groq key has not been configured.
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError(
            "GROQ_API_KEY is not configured on the backend. "
            "Add it to the Render service environment variables."
        )

    client = Groq(api_key=api_key)

    # Try alternative models when a model is rate-limited or unavailable.
    models = [
        "llama-3.3-70b-versatile",
        "llama-3.1-70b-versatile",
        "llama-3.1-8b-instant",
    ]

    for model in models:
        max_retries = 3
        for attempt in range(max_retries):
            try:
                print(f"Attempting generation with {model} (Attempt {attempt + 1})...")
                completion = client.chat.completions.create(
                    model=model,
                    messages=[
                        {
                            "role": "system",
                            "content": "You are a multilingual syllabus-aware AI tutor.",
                        },
                        {"role": "user", "content": prompt},
                    ],
                    temperature=0.2,
                )
                return completion.choices[0].message.content
            except RateLimitError:
                print(f"RATE_LIMIT exceeded for {model}. Backing off...")
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt)
                else:
                    print(f"Switching from {model} due to persistent rate limit.")
            except Exception as exc:
                print(f"ERROR with {model}: {exc}")
                break

    return "The system is currently experiencing high traffic. Please try again in 1-2 minutes."
