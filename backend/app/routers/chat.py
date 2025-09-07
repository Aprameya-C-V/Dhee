from __future__ import annotations
from typing import Iterator
from fastapi import APIRouter
from fastapi.responses import StreamingResponse, JSONResponse
from ..models import ChatRequest, RegionsResponse
from ..personalization.engine import build_system_prompt
from ..personalization.config import REGIONS
from ..utils.groq_client import stream_chat
from ..core.settings import settings

router = APIRouter(prefix="/api", tags=["chat"])


@router.get("/personalization/regions", response_model=RegionsResponse)
async def get_regions_config() -> RegionsResponse:
    return RegionsResponse(regions=REGIONS)


@router.post("/chat/stream")
def chat_stream(req: ChatRequest) -> StreamingResponse:
    system_prompt = build_system_prompt(
        region=req.region,
        subregion=req.subregion,
        language=req.language,
        domain=req.domain,
        grade_level=req.grade_level,
        low_bandwidth=req.low_bandwidth,
        student_profile=req.student_profile,
    )

    messages = [{"role": "system", "content": system_prompt}]
    if req.history:
        messages.extend([m.model_dump() for m in req.history])
    messages.append({"role": "user", "content": req.user_message})

    model = req.model or settings.llm_model
    temperature = req.temperature if req.temperature is not None else settings.llm_temperature
    max_tokens = req.max_tokens if req.max_tokens is not None else settings.llm_max_tokens
    top_p = req.top_p if req.top_p is not None else settings.llm_top_p

    def token_iter() -> Iterator[bytes]:
        for token in stream_chat(
            messages=messages,
            model=model,
            temperature=temperature,
            max_tokens=max_tokens,
            top_p=top_p,
            stop=None,
        ):
            yield token.encode("utf-8")

    return StreamingResponse(token_iter(), media_type="text/plain; charset=utf-8")
