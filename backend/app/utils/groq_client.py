import os
from typing import Iterable, List, Dict, Any
from groq import Groq
from groq._exceptions import GroqError
from dotenv import load_dotenv

load_dotenv()

def get_client() -> Groq:
    # Reload .env on each request to pick up newly created/edited .env values during dev
    load_dotenv()
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        # Will raise error on client init; keep explicit check to control message upstream.
        raise GroqError(
            "GROQ_API_KEY is not set. Set it in your environment or .env file."
        )
    return Groq(api_key=api_key)


def stream_chat(
    messages: List[Dict[str, Any]],
    model: str,
    temperature: float = 0.6,
    max_tokens: int = 4096,
    top_p: float = 1.0,
    stop: list[str] | None = None,
) -> Iterable[str]:
    try:
        client = get_client()
        completion = client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=temperature,
            max_completion_tokens=max_tokens,
            top_p=top_p,
            stream=True,
            stop=stop,
        )
        for chunk in completion:
            try:
                delta = chunk.choices[0].delta
                if delta and delta.content:
                    yield delta.content
            except Exception:
                continue
    except GroqError as ge:
        yield (
            "[Configuration error] GROQ_API_KEY not found or invalid. "
            "Please set GROQ_API_KEY in your .env or environment and reload."
        )
    except Exception as e:
        yield "[Chat backend error] An unexpected error occurred while streaming the response."
