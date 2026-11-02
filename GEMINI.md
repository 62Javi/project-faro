# Faro — Guía y Convenciones del Proyecto (GEMINI.md)

## 1. Stack Tecnológico Oficial
- **Frontend**: Next.js (App Router) + TypeScript + TailwindCSS (despliegue en Vercel).
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

---

## 2. Convenciones Pedagógicas y Criterios de Cátedra (UTN FRLP)
> **Asignatura:** Desarrollo de Software Cloud — 2° Cuatrimestre 2026  
> **Docentes:** Ing. Rafael Villalba | Ing. Matías Area  
> **Criterio rector:** "El nuevo rol del ingeniero: AI Decision Log".

- **Auditoría Técnica Obligatoria**: La IA actúa como consultor y acelerador; cada decisión de arquitectura, esquema relacional, política de seguridad o llamada cloud debe ser validada críticamente por los ingenieros.
- **Protocolo `AI-DECISIONS.md`**: Ante cualquier cambio estructural, refactorización de arquitectura, adopción de nuevos patrones cloud o integración de IA, se debe registrar o actualizar la entrada correspondiente documentando:
  1. *Problema abordado*
  2. *Herramienta y prompt utilizado*
  3. *Propuesta inicial de la IA*
  4. *Validación y corrección humana* (seguridad, resiliencia, costos, alucinaciones).
- **Resiliencia Cloud (Zero-Downtime & Graceful Degradation)**: Los servicios no pueden colapsar por indisponibilidad temporal de un proveedor externo (Supabase, Clerk, etc.). Toda dependencia externa debe poseer fallback o degradación elegante.
- **Seguridad y Menor Privilegio**: Políticas RLS estrictas en PostgreSQL. Jamás exponer permisos de escritura o eliminación indiscriminada (`FOR ALL USING (true)`) a clientes anónimos.
- **Eficiencia de Costos Cloud & Tráfico I/O**: Minimizar transferencias y llamadas innecesarias al backend implementando patrones *Local-First* y estructuras de datos nativas eficientes en base de datos.

---

## 3. Estructura Canónica del Repositorio
```text
project-faro/
├── backend/
│   ├── app/
│   │   ├── api/          # Routers y endpoints HTTP REST y WebSockets (/ws)
│   │   ├── core/         # Configuración (config.py), persistencia y fallback (supabase.py)
│   │   ├── models/       # Modelos internos y estructuras de dominio
│   │   ├── schemas/      # Modelos Pydantic (Structured Outputs e I/O de endpoints)
│   │   ├── services/     # Lógica de Gemini AI, Sommelier y extracción multimodal
│   │   └── main.py       # Entrypoint FastAPI y ciclo de vida de la app
│   ├── tests/            # Pruebas automatizadas con Pytest
│   ├── requirements.txt  # Dependencias Python
│   └── Dockerfile        # Contenedor para Google Cloud Run
├── frontend/
│   ├── src/
│   │   ├── app/          # App Router Next.js (rutas /admin, /cocina, /mozo, /mesa/[id])
│   │   ├── components/   # Componentes de UI divididos por módulo y dominio
│   │   ├── hooks/        # Hooks reactivos (useCart, useWebSocket)
│   │   └── lib/          # Clientes de API, Supabase y utilidades generales
│   ├── package.json      # Dependencias y scripts de Node
│   └── Dockerfile        # Contenedor web Next.js
├── AI-DECISIONS.md       # Log oficial de cátedra con auditoría humana de IA
├── GEMINI.md             # Reglas y directivas de ingeniería del proyecto
└── docker-compose.yml    # Orquestación de desarrollo local unificado
```

---

## 4. Comandos Estándar de Ejecución y Testing
- **Levantar todo el stack con Docker**:
  ```bash
  docker compose up --build
  ```
- **Backend (FastAPI)**:
  ```bash
  cd backend
  source venv/bin/activate
  python -m uvicorn app.main:app --reload --port 8000
  ```
- **Frontend (Next.js)**:
  ```bash
  cd frontend
  npm run dev
  ```
- **Validación y Pruebas**:
  ```bash
  # Pruebas backend
  cd backend && pytest
  # Linter y verificación frontend
  cd frontend && npm run lint && npm run build
  ```

---

## 5. Reglas de Desarrollo y Eficiencia de Tokens
- **Concisión técnica**: Respuestas y código directos, sin introducciones largas ni explicaciones redundantes.
- **Cero emojis o clichés de IA**: Mantener tono sobrio de ingeniería universitaria (UTN FRLP). No usar emojis decorativos en `README.md`, `AI-DECISIONS.md` ni código.
- **Integridad de Modelos**: Verificar que todo nuevo endpoint o configuración referencie siempre `gemini-3.8-flash` o `settings.GEMINI_MODEL`.
- **Mantenimiento Documental**: Actualizar `README.md` o `AI-DECISIONS.md` solo ante cambios estructurales o nuevas decisiones de arquitectura cloud.

---

## 6. Sistema de Diseño Oficial (Mobbin / Swiss Minimalist)
- **Documento Rector**: Ver [`DESIGN-SYSTEM.md`](./DESIGN-SYSTEM.md) para el catálogo canónico de componentes y clases Tailwind.
- **Paleta Estricta**: Fondo lienzo `#FAFAFA`, tarjetas `#FFFFFF`, textos `#09090B` y `#71717A`. Botones primarios en negro carbón (`bg-neutral-900 text-white`).
- **Prohibición Total de Colores Genéricos**: Prohibido usar bordes multicolores de fantasía (naranjas, violetas, verdes o azules saturados) o botones de colores chillones estilo plantilla. Las distinciones de estado deben ser sutiles, monocromáticas o funcionales.
- **Geometría de Cápsula**: Todo botón interactivo, chip de categoría, badge o buscador debe usar `rounded-full`. Tarjetas y contenedores usan squircle suave (`rounded-2xl`).
- **Microinteracciones y Animaciones**: Uso obligatorio de transiciones fluidas (`transition-all duration-300`, `hover:-translate-y-0.5`, `active:scale-98`) y keyframes de [`globals.css`](./frontend/src/app/globals.css) (`.animate-fadeIn`, `.animate-ticket`).
