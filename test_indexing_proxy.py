import requests
import io

# Test the indexing through the Vite proxy
proxy_url = "http://localhost:5173/api/upload/"

print(f"Testing connectivity to {proxy_url}...")

# Create a dummy PDF content
pdf_content = b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>\nendobj\n"
files = {'file': ('test.pdf', io.BytesIO(pdf_content), 'application/pdf')}

try:
    response = requests.post(proxy_url, files=files, timeout=30)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")
except Exception as e:
    print(f"Test Failed: {e}")
