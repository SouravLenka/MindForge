# Response generator for RAG
# backend/rag/response_generator.py

import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_response(prompt: str):
    completion = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[
            {"role": "system", "content": "You are a syllabus-aware AI tutor."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.2,
    )

    return completion.choices[0].message.content