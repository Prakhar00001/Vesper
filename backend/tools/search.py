import os
from typing import List
from tavily import TavilyClient
from models import EvidenceItem

class SearchEngine:
    def __init__ (self):
        api_key = os.getenv("TAVILY_API_KEY")
        self.client = TavilyClient(api_key=api_key) if api_key else None

    async def execute_search(self, query: str, sub_question: str) -> List[EvidenceItem]:
        if not self.client:
            return [
                EvidenceItem(
                    title="Mock Evidence (Tavily Key Missing)",
                    url="https://example.com/mock",
                    snippet=f"Simulated factual extraction for query: {query}",
                    sub_question=sub_question
                )
            ]
        
        try:
            response = self.client.search(query=query, max_results=3, search_depth="advanced")
            results = []
            for item in response.get("results", []):
                results.append(
                    EvidenceItem(
                        title=item.get("title", "Untitled Source"),
                        url=item.get("url", "#"),
                        snippet=item.get("content", ""),
                        sub_question=sub_question
                    )
                )
            return results
        except Exception as e:
            print(f"Search error for {query}: {e}")
            return []