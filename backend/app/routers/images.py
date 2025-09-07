from __future__ import annotations
import os
import time
import mimetypes
from typing import Any, Dict, List, Optional
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from google import genai
from google.genai import types
from dotenv import load_dotenv
from ..models import ImageRequest

router = APIRouter(prefix="/api/images", tags=["images"])

GENERATED_DIR = os.path.join("static", "generated")
os.makedirs(GENERATED_DIR, exist_ok=True)


def _save_binary_file(file_name: str, data: bytes) -> str:
    path = os.path.join(GENERATED_DIR, file_name)
    with open(path, "wb") as f:
        f.write(data)
    return path


@router.post("/generate")
def generate_image(req: ImageRequest) -> JSONResponse:
    # Reload .env to pick new keys without server restart during dev
    load_dotenv()
    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

    def build_localization() -> List[str]:
        parts: List[str] = []
        if req.region:
            parts.append(f"Region: {req.region}")
        if req.subregion:
            parts.append(f"Subregion: {req.subregion}")
        if req.style:
            parts.append(f"Style: {req.style}")
        return parts

    def build_auto_prompt(context_text: str) -> str:
        style = req.style or "diagram"
        localization = ", ".join(build_localization())
        english_rules = (
            "Diagram text policy: Prefer no text. If you must add text, use ENGLISH ONLY. "
            "Do NOT use any other language for labels or annotations."
        )
        return (
            f"Create a clear, culturally appropriate educational {style} that supports this content (do not repeat the full text):\n"
            f"{context_text}\n\n"
            f"Requirements: simple shapes, 3–6 short labels max, readable on small screens, high contrast, minimal detail.\n"
            f"Keep textual annotations minimal (under 12 words total). If you include a caption, keep it under 20 words (in English).\n"
            f"{english_rules}\n"
            f"{localization}"
        )

    english_rules_line = (
        "Diagram text policy: Prefer no text. If any text is used, it must be ENGLISH ONLY. Do not use other languages."
    )
    if (req.prompt or "").strip():
        full_prompt = "\n".join(build_localization() + [req.prompt, english_rules_line])
    elif (req.auto_from_text or "").strip():
        full_prompt = build_auto_prompt(req.auto_from_text)
    else:
        full_prompt = "Create a simple educational diagram with no text unless necessary; any text must be English only."

    model = "gemini-2.5-flash-image-preview"
    contents = [
        types.Content(
            role="user",
            parts=[types.Part.from_text(text=full_prompt)],
        )
    ]
    generate_content_config = types.GenerateContentConfig(
        response_modalities=["IMAGE", "TEXT"],
    )

    images: List[str] = []
    text_out = ""

    file_index = 0
    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        if (
            chunk.candidates is None
            or chunk.candidates[0].content is None
            or chunk.candidates[0].content.parts is None
        ):
            continue
        part = chunk.candidates[0].content.parts[0]
        if getattr(part, "inline_data", None) and getattr(part.inline_data, "data", None):
            inline_data = part.inline_data
            data_buffer = inline_data.data
            file_extension = mimetypes.guess_extension(inline_data.mime_type) or ".bin"
            ts = int(time.time() * 1000)
            file_name = f"gen_{ts}_{file_index}{file_extension}"
            file_index += 1
            saved_path = _save_binary_file(file_name, data_buffer)
            images.append("/static/generated/" + os.path.basename(saved_path))
        else:
            if getattr(chunk, "text", None):
                text_out += chunk.text

    return JSONResponse({"images": images, "text": text_out})
