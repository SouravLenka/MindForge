# Vector store for RAG
# backend/rag/vector_store.py

from langchain_community.vectorstores import Chroma

vector_store = None


def create_vector_store(chunks, embedding_model):
    global vector_store
    vector_store = Chroma.from_documents(
        documents=chunks,
        embedding=embedding_model
    )
    return vector_store


def get_vector_store():
    return vector_store