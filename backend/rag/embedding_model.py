# Embedding model for RAG
# backend/rag/embedding_model.py

from langchain.embeddings import HuggingFaceEmbeddings


def get_embedding_model():
    return HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )