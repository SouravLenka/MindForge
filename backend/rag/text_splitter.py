# Text splitter for RAG
# backend/rag/text_splitter.py

from langchain_text_splitters import RecursiveCharacterTextSplitter


def split_documents(documents):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=80
    )
    return splitter.split_documents(documents)