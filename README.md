# Dhee — AI-Powered Personalized Tutor

Dhee is a regionally and sub-regionally personalized AI tutor designed for low-income learners. It adapts language, examples, and pedagogy to local contexts; streams Markdown-formatted lessons; and auto-generates large, readable illustrations that use English-only labels or no text at all.

- Frontend: Tailwind (CDN), zero-build, mobile-first.
- Backend: FastAPI (Python) with streaming via Groq and image generation via Google GenAI.
- Landing page at `/` and the app UI at `/app.html`.

## Features

- **Regional + Sub-Regional Personalization**
  - Configurable region packs (e.g., India, Middle East, Africa, Southeast Asia, South America, Central Asia) with subregions.
  - Local examples (crops, festivals, trade, climate, etc.) and curriculum cues (e.g., NCERT, BNCC).

- **Streaming Tutor (Groq)**
  - Uses `moonshotai/kimi-k2-instruct` (configurable). Streams Markdown output only (headers, lists, examples).
  - “Low data mode” for concise, text-first explanations.

- **Auto Visuals (Google GenAI)**
  - “See” is always on: auto-generates an illustration after each response.
  - Enforced policy: English-only labels or no text at all. Minimal labels (3–6), high contrast, readable on small screens.
  - Large preview panel with gallery thumbnails.

- **Multilingual UI (many Indian languages included)**
  - English (en), Hindi (hi), Bengali (bn), Tamil (ta), Telugu (te), Kannada (kn), Marathi (mr), Gujarati (gu), Malayalam (ml), Punjabi (pa), Odia (or), Assamese (as), Urdu (ur)
  - Plus: Arabic (ar), Spanish (es), French (fr), Portuguese (pt), Swahili (sw), Amharic (am), Somali (so), Hausa (ha), Uzbek (uz), Tajik (tg), Russian (ru), Pashto (ps), Dari/Persian (fa)
  - RTL support for Arabic, Urdu, Pashto, Persian.

- **Presets & Lesson Series**
  - One-click lesson sequences (Numeracy: mixed fractions, STEM: monsoon water cycle, Digital Literacy: WhatsApp safety, AI Literacy: monsoon forecasting).

## Directory Structure

```
.
├─ backend/
│  └─ app/
│     ├─ core/settings.py               # Loads .env and default LLM settings
│     ├─ personalization/
│     │  ├─ config.py                   # Region/subregion packs and domain pedagogy
│     │  └─ engine.py                   # System prompt builder
│     ├─ routers/
│     │  ├─ chat.py                     # POST /api/chat/stream (Groq)
│     │  └─ images.py                   # POST /api/images/generate (Google GenAI)
│     ├─ utils/groq_client.py           # Groq streaming wrapper w/ friendly errors
│     ├─ models.py                      # Pydantic models
│     └─ main.py                        # FastAPI app, serves frontend & static
│
├─ frontend/
│  ├─ index.html                        # Landing page (features + UI language + Learn now)
│  ├─ app.html                          # App UI (output + big illustration + controls)
│  └─ scripts/
│     ├─ landing.js                     # Stores UI lang (localStorage), routes to /app.html
│     └─ app.js                         # App logic: streaming, i18n, presets, auto-visuals
│
├─ static/
│  └─ generated/                        # Saved illustrations
│
├─ requirements.txt
└─ README.md
```

## Prerequisites

- Python 3.10+
- A Groq API key and a Google GenAI API key

## Environment Variables

Create a `.env` file at the project root with:

```
GROQ_API_KEY=your_groq_key
GEMINI_API_KEY=your_gemini_key

# Optional LLM defaults
LLM_MODEL=moonshotai/kimi-k2-instruct
LLM_TEMPERATURE=0.6
LLM_MAX_TOKENS=4096
LLM_TOP_P=1.0
```

Important:
- Do NOT commit real keys to Git. Add `.env` to `.gitignore`.

## Install & Run (Windows PowerShell)

```
# 1) Create and activate a virtual environment
py -m venv .venv
.\.venv\Scripts\Activate.ps1

# 2) Install dependencies
pip install -r requirements.txt

# 3) Create .env with your API keys (see above)
#    (Ensure python-dotenv is installed via requirements)

# 4) Start the server
uvicorn backend.app.main:app --reload --port 8000
```

Open: http://127.0.0.1:8000/

## Usage

- **Landing page (`/`)**
  - Pick UI Language (saved to localStorage) and click “Learn now” to go to `/app.html`.

- **App page (`/app.html`)**
  - Set Region/Sub-region and the tutor’s Language for content, Domain and Grade.
  - Toggle Low data if needed.
  - Type a question or select a Preset and click Send.
  - Watch the Markdown output on the left.
  - A large illustration is auto-generated on the right (English-only labels or text-free).
  - Click thumbnails to preview different images.

## API Endpoints

- `GET /api/personalization/regions`
  - Returns the region/subregion content packs.

- `POST /api/chat/stream`
  - Streams a text/plain response from the Groq model.
  - Request body (example):
    ```json
    {
      "user_message": "Teach me mixed fractions with market examples",
      "region": "India",
      "subregion": "North India",
      "language": "Hindi",
      "domain": "Numeracy",
      "grade_level": "Primary",
      "low_bandwidth": true,
      "history": []
    }
    ```

- `POST /api/images/generate`
  - Generates illustrations via Google GenAI.
  - English-only/no-text policy enforced.
  - Request body options:
    - With a direct prompt:
      ```json
      {
        "prompt": "Simple diagram of the water cycle for monsoon regions",
        "region": "India",
        "subregion": "East India",
        "language": "Hindi"
      }
      ```
    - Or auto-build from prior response text:
      ```json
      {
        "auto_from_text": "Markdown text from the last tutor response...",
        "region": "India",
        "subregion": "East India"
      }
      ```
  - Response (example):
    ```json
    {
      "images": ["/static/generated/gen_1699999999999_0.png"],
      "text": "Optional short caption"
    }
    ```

## Customization

- **Add/Update Regions & Subregions**: edit `backend/app/personalization/config.py`.
- **System Prompt & Pedagogy Rules**: edit `backend/app/personalization/engine.py`.
- **UI Languages & Labels**: edit dictionaries in `frontend/scripts/app.js`.
- **Default model & temperature**: set env vars in `.env`.

## Security Notes

- Keep `.env` out of version control.
- Never embed API keys in frontend code.

## Tech Stack

- FastAPI, Uvicorn, Pydantic, python-dotenv
- Groq (chat streaming)
- Google GenAI (image generation)
- Tailwind CSS (CDN), Marked + DOMPurify

## Troubleshooting

- **Chat shows configuration error**: Ensure `GROQ_API_KEY` is set in `.env` and that `python-dotenv` is installed; restart or refresh.
- **Images don’t generate**: Ensure `GEMINI_API_KEY` is set. Check network logs and console.
- **No images or repeated text in images**: The backend enforces English-only or no text and asks for minimal labels; try again.

## License

MIT

## Acknowledgements

- Thanks to the Groq and Google GenAI teams for the APIs used by Dhee.
