# Registro de Decisiones de Arquitectura e Inteligencia Artificial (AI-DECISIONS.md)

> **Materia:** Desarrollo de Software Cloud (2° Cuatrimestre 2026) — UTN FRLP  
> **Docentes:** Ing. Rafael Villalba | Ing. Matías Area  
> **Proyecto:** Faro — Plataforma Integral para Restaurantes con IA Multimodal  
> **Integrantes:**  
> - Sixto Javier Castro Cope — Legajo: 32797 — GitHub: [@62Javi](https://github.com/62Javi)  
> - Esteban Suarez — Legajo: 28077 — GitHub: [@Esteban-Suarez-hub](https://github.com/Esteban-Suarez-hub)  

---

## 1. Propósito y Metodología de este Registro

En concordancia con el estándar pedagógico de la cátedra (*"El nuevo rol del ingeniero: AI Decision Log"*), el equipo asume la responsabilidad integral sobre la arquitectura, seguridad, resiliencia y eficiencia de costos de la solución. La Inteligencia Artificial se utiliza como un acelerador de productividad y consultor de diseño, pero **cada fragmento de código, esquema y decisión cloud es auditado críticamente por los ingenieros**.

Este log documenta la evolución cronológica del proyecto, vinculando cada intervención de IA con su correspondiente implementación en el repositorio, explicitando las correcciones humanas ante alucinaciones, brechas de seguridad o ineficiencias de arquitectura.

---

### Entrada #1: Modelado de Persistencia y Seguridad Multi-tenant en Supabase (PostgreSQL)

- **Fecha:** 2026-09-07  
- **Responsable:** Sixto Javier Castro Cope  
- **Problema abordado:** Definir el esquema relacional en PostgreSQL para soportar una arquitectura multi-tenant (múltiples restaurantes aislados), control de estados de comandas y permisos de lectura pública para clientes anónimos en mesas.
- **Herramienta utilizada:**  
  Google Gemini 3.8 Flash / Antigravity Assistant.  
  *Prompt:*  
  > *"Genera un script DDL SQL para PostgreSQL en Supabase que gestione restaurantes, cartas con categorías y platos con alérgenos en arrays, mesas y pedidos con estados. Necesito que los clientes de la mesa puedan leer platos y crear pedidos sin registrarse en Clerk."*
- **Código / Arquitectura generada por la IA:**  
  La IA propuso tablas normalizadas con claves foráneas, usando `status VARCHAR(50)` libre para los pedidos y una política RLS abierta de la forma `CREATE POLICY "Permitir todo" ON orders FOR ALL USING (true);`. Además, para los alérgenos propuso una tabla intermedia `dish_allergens` relacional de muchos a muchos.
- **Validación y Corrección Humana (Auditoría Técnica):**  
  1. **Seguridad Crítica (RLS):** La política propuesta por la IA (`FOR ALL USING (true)`) permitía que cualquier cliente anónimo pudiera no solo insertar pedidos, sino también modificar estados de otros pedidos o eliminarlos. Se refactorizó separando estrictamente: `CREATE POLICY "Public order creation" ON orders FOR INSERT WITH CHECK (true);` mientras que las actualizaciones (`UPDATE`) quedaron restringidas al personal de salón y cocina mediante roles.
  2. **Modelado y Performance:** Para alérgenos y etiquetas fijas (`allergens`, `tags`), la tabla intermedia generaba múltiples joins innecesarios en la lectura de la carta. Se optimizó adoptando tipos nativos de PostgreSQL `TEXT[] DEFAULT '{}'`, reduciendo la latencia de consulta en el Edge.
  3. **Integridad de Dominio:** Se rechazó el campo `status VARCHAR` libre y se creó un tipo estructurado `CREATE TYPE order_status_enum` con estados estrictos (`pendiente_mozo`, `en_cocina`, `en_preparacion`, `listo`, `entregado`, `cancelado`) para prevenir inconsistencias en la máquina de estados.

---

### Entrada #2: Estrategia de Resiliencia y Almacén Turnkey In-Memory

- **Fecha:** 2026-09-13  
- **Responsable:** Sixto Javier Castro Cope  
- **Problema abordado:** Garantizar alta disponibilidad y funcionamiento de desarrollo/demo ante microcortes o latencias elevadas en la conexión externa con Supabase DB.
- **Herramienta utilizada:**  
  Google Gemini 3.8 Flash.  
  *Prompt:*  
  > *"Escribe una clase singleton en Python con FastAPI para conectar con Supabase Client. Si las credenciales no están presentes en el .env, lanza una excepción de terminación inmediata."*
- **Código / Arquitectura generada por la IA:**  
  La IA propuso un código rígido con `if not url or not key: sys.exit(1)`, deteniendo el arranque del contenedor de FastAPI si fallaban las variables de entorno o la conexión de red.
- **Validación y Corrección Humana (Auditoría Técnica):**  
  1. **Resiliencia Cloud (Zero-Downtime):** En un entorno SaaS con demos continuas y evaluación de cátedra, tumbar el contenedor ante la falta temporal de red atenta contra el principio de degradación elegante (*graceful degradation*).
  2. **Patrón Turnkey Store:** Se rediseñó la arquitectura creando la clase `DatabaseStore` (`backend/app/core/supabase.py`). Si Supabase está disponible, se sincroniza; si no hay variables configuradas o se produce un timeout, el sistema inicializa un almacén turnkey en memoria precargado con datos del restaurante de demo (`rest_faro_demo`), permitiendo que el 100% de los endpoints (carta, pedidos, mozo, cocina) sigan operativos sin caídas.

---

### Entrada #3: Gestión de Estado del Carrito Local-First en Mesa vs Persistencia Remota

- **Fecha:** 2026-09-19  
- **Responsable:** Esteban Suarez  
- **Problema abordado:** Gestionar la acumulación de platos en el pedido de la mesa antes del envío definitivo al personal de salón.
- **Herramienta utilizada:**  
  GitHub Copilot (Claude 3.5 Sonnet).  
  *Prompt:*  
  > *"Crea un hook useCart en React que guarde cada plato agregado directamente en la base de datos de Supabase mediante un POST cada vez que el usuario hace click."*
- **Código / Arquitectura generada por la IA:**  
  La IA sugirió disparar una petición HTTP POST hacia el backend/Supabase en cada incremento o decremento de cantidades en la interfaz de la mesa.
- **Validación y Corrección Humana (Auditoría Técnica):**  
  1. **Optimización de Costos y Tráfico Cloud:** Disparar peticiones remotas por cada modificación de cantidad genera un tráfico I/O excesivo, costos innecesarios en Cloud Run / Supabase y una experiencia lenta si la cobertura celular en el local es baja.
  2. **Patrón Local-First:** Se implementó una gestión de estado client-side reactiva (`useCart`) con persistencia en `localStorage` del dispositivo del comensal. El backend solo se contacta mediante un único POST transaccional cuando el cliente presiona "Confirmar Pedido", reduciendo las llamadas de red en más de un 80% y brindando respuesta instantánea en la interfaz.

---

### Entrada #4: Broadcast en Tiempo Real con WebSockets para Salón y Cocina (KDS)

- **Fecha:** 2026-09-22  
- **Responsable:** Sixto Javier Castro Cope  
- **Problema abordado:** Comunicación bidireccional instantánea entre comensales, mozos y la pantalla de cocina (Kitchen Display System), garantizando que las desconexiones por inestabilidad de WiFi móvil no cuelguen el servidor.
- **Herramienta utilizada:**  
  Google Gemini 3.7 Flash.  
  *Prompt:*  
  > *"Implementa un ConnectionManager en FastAPI con WebSockets para enviar mensajes de pedidos nuevos a cocina y mozos agrupados por restaurant_id."*
- **Código / Arquitectura generada por la IA:**  
  La IA generó un diccionario `self.active_connections: Dict[str, List[WebSocket]]` que iteraba sobre la lista original durante el broadcast: `for ws in self.active_connections[id]: await ws.send_text(...)`.
- **Validación y Corrección Humana (Auditoría Técnica):**  
  1. **Prevención de Concurrency Bug & Memory Leak:** Si un socket se desconectaba bruscamente (ej. el mozo bloquea su teléfono) en pleno ciclo de broadcast, el método arrojaba una excepción `RuntimeError: dictionary/list changed size during iteration` y la conexión muerta permanecía en memoria indefinidamente.
  2. **Solución Implementada:** Se modificó la iteración sobre una copia defensiva de la lista `list(self.kitchen_connections[restaurant_id])` encapsulada en bloques `try/except Exception` que invocan automáticamente `disconnect_kitchen()` o `disconnect_waiter()` ante cualquier socket roto, liberando recursos inmediatamente y evitando el colapso del event loop de asyncio.

---
