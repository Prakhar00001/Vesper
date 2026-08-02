import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_groq import ChatGroq

load_dotenv()

class Config:
    DEFAULT_PROVIDER = os.getenv("DEFAULT_LLM_PROVIDER", "openai")
    DEFAULT_MODEL = os.getenv("DEFAULT_MODEL_NAME", "gpt-4o")
    TAVILY_API_KEY = os.getenv("TAVILY_API_KEY", "")

def get_llm(provider: str = None, model_name: str = None):
    provider = provider or Config.DEFAULT_PROVIDER
    model_name = model_name or Config.DEFAULT_MODEL

    if provider.lower() == "openai":
        return ChatOpenAI(model=model_name, temperature=0.2)
    elif provider.lower() in ["google", "gemini"]:
        return ChatGoogleGenerativeAI(model=model_name or "gemini-1.5-pro", temperature=0.2)
    elif provider.lower() == "groq":
        return ChatGroq(model=model_name or "llama-3.3-70b-versatile", temperature=0.2)
    else:
        raise ValueError(f"Unsupported LLM provider: {provider}")