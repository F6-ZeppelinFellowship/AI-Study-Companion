import os

from openai import OpenAI
from dotenv import load_dotenv
from google import genai
load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

result = client.models.embed_content(
    model="text-embedding-004",
    contents=text
)

def create_embedding(text: str):

    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=text,
    )

    return response.data[0].embedding
