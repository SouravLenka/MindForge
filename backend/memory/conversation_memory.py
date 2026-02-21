# Conversation memory for the backend
# backend/memory/conversation_memory.py

from langchain_classic.memory import ConversationBufferMemory


class SessionMemory:
    """
    Session-only conversation memory.
    Clears when server restarts.
    """

    def __init__(self):
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True
        )

    def get_memory(self):
        return self.memory

    def clear(self):
        self.memory.clear()


session_memory = SessionMemory()