# Prompt builder for RAG
# backend/rag/prompt_builder.py

SYSTEM_PROMPT = """
You are an AI learning assistant that answers strictly using the provided syllabus context.

Rules:
- Do NOT use external knowledge.
- Do NOT hallucinate.
- If answer not found in context, say it is not covered.
- Ask for clarification if question is vague.
- Adapt explanation based on explanation mode.
- Adjust depth based on difficulty level.
- Include source reference.
"""


def build_prompt(context, question, explanation_mode, difficulty_level, chat_history):
    return f"""
{SYSTEM_PROMPT}

Explanation Mode: {explanation_mode}
Difficulty Level: {difficulty_level}

Chat History:
{chat_history}

Context:
{context}

Question:
{question}

If the answer is not found in the context, respond exactly:
"This topic is not covered in the provided syllabus materials. Please consult your instructor."
"""