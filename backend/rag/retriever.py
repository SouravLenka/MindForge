# Retriever for RAG
# backend/rag/retriever.py

def get_retriever(vector_store):
    return vector_store.as_retriever(search_kwargs={"k": 3})