# Faro — Guía y Convenciones del Proyecto (GEMINI.md)

## 1. Stack Tecnológico Oficial
- **Frontend**: Next.js 14 (App Router) + TypeScript + TailwindCSS (despliegue en Vercel).
- **Backend**: FastAPI (Python 3.13) contenerizado en Google Cloud Run.
- **IA Multimodal**: Google Gemini (modelo default: **`gemini-3.8-flash`**, compatible con `gemini-3.6-flash`).
  - **Visión Multimodal**: procesamiento nativo con **Structured Outputs** (Pydantic `MenuExtractionResult`).
  - **Prohibido**: No usar `gemini-1.5`, no usar el modelo descontinuado `gemini-pro-vision`, ni APIs aisladas como Google Cloud Vision.
  - **Function Calling**: Sommelier virtual con inyección y validación de precios exclusiva en servidor (`db_store.dishes`).
- **Persistencia & Storage**: Supabase (PostgreSQL con RLS multi-tenant y buckets de fotos).
  - **Turnkey In-Memory Fallback**: si Supabase no está configurado o hay timeout, `DatabaseStore` opera en memoria sin caídas.
- **Autenticación**: Clerk Auth (roles: `dueño/admin`, `mozo`, `cocina`). Comensales en mesa operan sin registro.
- **Tiempo Real**: WebSockets en FastAPI (`/ws/kitchen`, `/ws/waiter`) iterando sobre copias defensivas `list(...)`.
- **Frontend Local-First**: `useCart` persiste en `localStorage`; contacto transaccional con backend solo al confirmar comanda.

## 2. Reglas de Desarrollo y Eficiencia de Tokens
- **Concisión técnica**: Respuestas y código directos, sin introducciones largas ni explicaciones redundantes.
- **Cero emojis o clichés de IA**: Mantener tono sobrio de ingeniería universitaria (UTN FRLP). No usar emojis decorativos en `README.md`, `AI-DECISIONS.md` ni código.
- **Integridad de Modelos**: Verificar que todo nuevo endpoint o configuración referencie siempre `gemini-3.8-flash` o `settings.GEMINI_MODEL`.
- **Mantenimiento Documental**: Actualizar `README.md` o `AI-DECISIONS.md` solo ante cambios estructurales o nuevas decisiones de arquitectura cloud.
