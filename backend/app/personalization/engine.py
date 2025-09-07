from __future__ import annotations
from typing import Optional, Dict, Any
from .config import REGIONS, DOMAINS


def get_region_pack(region: str | None, subregion: str | None) -> Dict[str, Any]:
    region_pack = REGIONS.get(region or "", {})
    sub_pack = {}
    if region_pack and subregion:
        sub_pack = (region_pack.get("subregions", {}) or {}).get(subregion, {})
    return {"region": region_pack, "subregion": sub_pack}


def build_system_prompt(
    *,
    region: Optional[str],
    subregion: Optional[str],
    language: Optional[str],
    domain: Optional[str],
    grade_level: Optional[str],
    low_bandwidth: bool = False,
    student_profile: Optional[Dict[str, Any]] = None,
) -> str:
    packs = get_region_pack(region, subregion)
    region_pack = packs.get("region", {})
    sub_pack = packs.get("subregion", {})

    curriculum = sub_pack.get("curriculum") or region_pack.get("curriculum") or "Local Curriculum"
    examples = sub_pack.get("examples") or []
    currency = region_pack.get("currency") or "local currency"
    domain_info = DOMAINS.get(domain or "", {})

    language_instruction = (
        f"Respond in {language}." if language else "Respond in the student's preferred language."
    )

    lb_rules = (
        "Prefer concise text; avoid heavy media; use bullet steps; include ASCII diagrams when helpful."
        if low_bandwidth else
        "You may include short lists and step-by-step explanations; keep responses focused and supportive."
    )

    pedagogy = domain_info.get("pedagogy", "Use clear, age-appropriate explanations and check understanding.")

    example_line = (
        f"Incorporate locally relevant examples such as: {', '.join(examples)}."
        if examples else
        "Incorporate locally relevant examples from the student's environment."
    )

    grade_line = f"Target grade level: {grade_level}." if grade_level else "Target an age-appropriate level."

    profile_line = ""
    if student_profile:
        profile_line = (
            "Student profile: " + ", ".join([f"{k}={v}" for k, v in student_profile.items()]) + "."
        )

    prompt = f"""
You are an AI-powered personalized tutor for low-income students. Be empathetic, culturally aware, and supportive. 
{language_instruction}

Contextualization:
- Region: {region or 'Unknown'}; Sub-region: {subregion or 'Unknown'}; Currency: {currency}; Curriculum alignment: {curriculum}.
- Domain: {domain or 'General'}.
- {grade_line}
- {example_line}
- {profile_line}

Pedagogical approach:
- {pedagogy}
- Encourage metacognition: ask short check-for-understanding questions.
- Provide step-by-step guidance and encourage active recall.
- Use local names, measurements, and {currency} for Numeracy tasks.
- Respect cultural norms and be inclusive.
- {lb_rules}
 - Format responses using Markdown (headings, subheadings, bullet lists, bold key terms) for readability.
 - When relevant, include 3–4 worked examples that progress from easy to challenging.

Safety & appropriateness:
- Avoid sensitive, harmful, or culturally inappropriate content.
- Adapt explanations to the student's reading level.

When the student asks a question or requests a lesson:
1) Briefly connect to local context.
2) Teach the concept in 3-6 short steps.
3) Include 1-3 practice items using local context.
4) Offer a hint before revealing a solution.
5) End with a quick self-check question.
""".strip()

    return prompt
