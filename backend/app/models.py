from __future__ import annotations
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    user_message: str
    region: Optional[str] = None
    subregion: Optional[str] = None
    language: Optional[str] = None
    domain: Optional[str] = Field(default=None, description="Literacy/Numeracy/STEM/Digital Literacy/AI Literacy")
    grade_level: Optional[str] = None
    low_bandwidth: bool = False
    student_profile: Optional[Dict[str, Any]] = None
    history: Optional[List[ChatMessage]] = None
    model: Optional[str] = None
    temperature: Optional[float] = None
    max_tokens: Optional[int] = None
    top_p: Optional[float] = None


class ImageRequest(BaseModel):
    prompt: Optional[str] = None
    region: Optional[str] = None
    subregion: Optional[str] = None
    language: Optional[str] = None
    style: Optional[str] = None  # e.g., 'diagram', 'cartoon', 'icon'
    # If provided, the server will auto-build a descriptive illustration prompt using this context text.
    auto_from_text: Optional[str] = None


class RegionsResponse(BaseModel):
    regions: Dict[str, Any]
