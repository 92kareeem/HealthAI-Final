# HealthAI Platform

A full-stack AI-powered healthcare platform for doctors and patients featuring symptom analysis, image diagnosis (pneumonia, skin cancer, anemia), OCR medical report storage, blockchain, and analytics dashboards with Supabase integration.

## Project Structure
- Backend (Flask): [app.py](app.py), [run.py](run.py), services in `services/`, AI models in `ai_models/`, Supabase client in `database/`.
- Frontend (Next.js 13 app router): UI pages in `app/`, shared components in `components/`, utilities in `lib/`, API routes in `app/api/`.
- Config: [config.py](config.py), environment variables, Tailwind/Next configs.

## Prerequisites
- Python 3.10+
- Node.js 18+ and pnpm (or npm)
- Supabase project (URL + anon/service keys)
- Tesseract OCR installed locally (for OCR features) and OpenCV runtime deps
- Optional: Docker if running in a container

## Environment Variables
Backend (`.env` or shell):
- `SUPABASE_URL`, `SUPABASE_KEY`
- `PINATA_API_KEY`, `PINATA_SECRET_KEY` (IPFS)
- `OPENAI_API_KEY`, `HUGGINGFACE_API_KEY` (AI features)
- `SECRET_KEY`, `ENCRYPTION_KEY`
- `UPLOAD_FOLDER` (defaults to `uploads`)
- `FLASK_ENV=development`, `FLASK_DEBUG=1` (for local dev)

Frontend (`.env.local`):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Installation
### Backend
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Frontend
```bash
pnpm install
# or npm install
```

## Running
### Backend (Flask)
```bash
source .venv/bin/activate
python run.py
# Serves on http://localhost:3000 by default
```

### Frontend (Next.js)
```bash
pnpm dev
# or npm run dev
# Serves on http://localhost:3000 (adjust if backend conflicts, e.g., set FRONTEND_PORT=3001)
```

If port conflict occurs (backend also defaults to 3000), run one of them on a different port:
```bash
# Backend custom port
FLASK_RUN_PORT=5000 python run.py
# Frontend custom port
PORT=3001 pnpm dev
```

## Key Endpoints (Backend)
- POST `/api/auth/wallet-login`
- POST `/api/ai/symptom-analysis` ([app.py](app.py))
- POST `/api/ai/image-diagnosis` (supports `diagnosis_type` like `pneumonia`, `skin_cancer`, `eye_anemia`)
- POST `/api/ai/ocr-analysis` (OCR + report analysis)
- POST `/api/ai/anemia/eye`, `/api/ai/anemia/nail`
- GET `/api/ai/anemia/health`
- POST `/api/medical-records`
- GET `/api/analytics/dashboard`

## Frontend Highlights
- Patient dashboard: [app/patient-dashboard/page.tsx](app/patient-dashboard/page.tsx)
- Analytics: [app/analytics/page.tsx](app/analytics/page.tsx)
- AI diagnosis (anemia): [app/ai-diagnosis/anemia-detection/page.tsx](app/ai-diagnosis/anemia-detection/page.tsx)
- AI symptom checker: [app/ai-symptom-checker/page.tsx](app/ai-symptom-checker/page.tsx)
- Blockchain UI: [app/blockchain/page.tsx](app/blockchain/page.tsx)
- Medical records UI/API: [app/medical-records/add/page.tsx](app/medical-records/add/page.tsx), [app/api/medical-records/route.ts](app/api/medical-records/route.ts)

## Data & Storage
- Supabase is used for auth/data ([services/analytics_service.py](services/analytics_service.py), [utils/validators.py](utils/validators.py)).
- File uploads stored under `uploads/` (see [app.py](app.py)); IPFS planned via Pinata.

## AI Models
- Disease predictor: [ai_models/disease_predictor.py](ai_models/disease_predictor.py)
- Image analyzer: [ai_models/image_analyzer.py](ai_models/image_analyzer.py)
- OCR processor: [ai_models/ocr_processor.py](ai_models/ocr_processor.py)
- Anemia detection pipeline: [backend/anemia_detection.py](backend/anemia_detection.py)

## Styling & Config
- Tailwind: [tailwind.config.ts](tailwind.config.ts)
- Next config: [next.config.mjs](next.config.mjs)
- TypeScript config: [tsconfig.json](tsconfig.json)

## Tips for Smooth Runs
- Ensure `uploads/`, `models/`, and `logs/` directories exist (created automatically in [run.py](run.py)).
- Install Tesseract and OpenCV system dependencies if OCR/image analysis fails.
- Keep frontend and backend on separate ports to avoid conflicts.
- Set Supabase env vars for both backend and frontend before running.
- Use `pnpm dev` for faster frontend install/build; `ignoreBuildErrors` and `ignoreDuringBuilds` are enabled in [next.config.mjs](next.config.mjs) for local development.
  
