
from backend.rag.prompt_builder import build_prompt

def test_diagram_detection():
    context = "The SDLC involves discovery, design, development, and testing."
    question = "Draw a diagram of the SDLC"
    explanation_mode = "Quick"
    difficulty_level = "Intermediate"
    chat_history = ""
    
    prompt = build_prompt(context, question, explanation_mode, difficulty_level, chat_history)
    
    # Check if DIAGRAM_PROMPT was injected
    assert "Generate a clean ASCII diagram" in prompt
    assert "+----+ boxes" in prompt
    print("Test Passed: Diagram prompt correctly injected for 'draw' keyword.")

def test_non_diagram_request():
    context = "The SDLC involves discovery, design, development, and testing."
    question = "What is SDLC?"
    explanation_mode = "Quick"
    difficulty_level = "Intermediate"
    chat_history = ""
    
    prompt = build_prompt(context, question, explanation_mode, difficulty_level, chat_history)
    
    # Check if DIAGRAM_PROMPT was NOT injected
    assert "Generate a clean ASCII diagram" not in prompt
    print("Test Passed: Diagram prompt correctly omitted for normal question.")

if __name__ == "__main__":
    test_diagram_detection()
    test_non_diagram_request()
