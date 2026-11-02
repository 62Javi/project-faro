# Faro — Sistema de Diseño Oficial (Mobbin / Swiss Digital Product Design)

Guía canónica de interfaz de usuario, tokens, componentes y microinteracciones para el frontend de Faro (Next.js + TailwindCSS).

---

## 1. Filosofía y Reglas Fundacionales

1. **Monocromático de Alta Precisión (*Swiss Minimalist*):**
   * El color base es blanco puro (`#FFFFFF`) y fondo de lienzo tenue (`#FAFAFA` o `bg-[#FAFAFA]`).
   * La jerarquía se construye con tipografía, pesos y bordes milimétricos, **no** con colores saturados.
2. **Prohibición de Colores Genéricos de Plantilla (*No Generic SaaS Slop*):**
   * **Prohibido:** No usar tarjetas o bordes de colores arbitrarios (cajas naranjas, púrpuras, azules o verdes saturados).
   * **Prohibido:** No usar degradados multicolores estridentes ni botones con paleta arcoíris.
   * **Permitido:** Detalles de estado funcionales y sobrios (indicador verde esmeralda `emerald-500` tenue o micro-ping negro para estado de conexión en vivo).
3. **Geometría y Radios Continuos:**
   * **Cápsula total (`rounded-full`):** Botones de acción, chips de categoría, badges, interruptores y campos de búsqueda.
   * **Squircle pronunciado (`rounded-2xl`):** Tarjetas de contenido, paneles modales, drawers y contenedores principales.
   * **Enmarcado interno (`rounded-xl`):** Contenedores de imágenes, previews de platos y sub-paneles internos.
4. **Bordes Milimétricos (*Hairline Borders*):**
   * Bordes de separación sutiles: `border border-neutral-200/80` o `border-neutral-100`.
   * En hover: intensificación a `hover:border-neutral-300`.

---

## 2. Paleta de Tokens Tailwind

| Token | Clase Tailwind | Valor Hex / RGBA | Uso |
| :--- | :--- | :--- | :--- |
| **Canvas** | `bg-[#FAFAFA]` | `#FAFAFA` | Fondo general de páginas y vistas |
| **Surface** | `bg-white` | `#FFFFFF` | Tarjetas, contenedores elevados y barras |
| **Surface Muted** | `bg-neutral-100/80` | `#F4F4F5` / 80% | Entradas de texto, chips inactivos |
| **Border Subtle** | `border-neutral-200/80` | `rgba(228,228,231,0.8)` | Separadores y contornos de tarjetas |
| **Border Strong** | `border-neutral-900` | `#09090B` | Tarjeta activa o plan destacado |
| **Text Primary** | `text-neutral-900` | `#09090B` | Títulos, precios y acciones principales |
| **Text Secondary** | `text-neutral-500` | `#71717A` | Descripciones y subtítulos |
| **Text Muted** | `text-neutral-400` | `#A1A1AA` | Metadatos secundarios y placeholders |
| **Action Primary** | `bg-neutral-900 text-white` | `#09090B` | Botones de envío, confirmación y chips activos |

---

## 3. Catálogo de Componentes Canónicos

### A. Tarjeta de Contenido / Plato (*Mobbin Showcase Card*)
```tsx
<div className="group relative flex flex-col justify-between bg-white rounded-2xl border border-neutral-200/80 p-2.5 transition-all duration-300 hover:border-neutral-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5">
  {/* Marco de imagen */}
  <div className="relative aspect-[16/11] sm:aspect-[4/3] w-full overflow-hidden rounded-xl bg-neutral-100 border border-neutral-200/50">
    <img
      src={image_url}
      alt={name}
      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
    />

    {/* Badges superiores translúcidos */}
    <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-neutral-800 text-[10px] font-semibold border border-neutral-200/60 shadow-xs">
        Sin TACC
      </span>
    </div>

    {/* Acción flotante rápida (aparece en hover) */}
    <button
      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 backdrop-blur-md border border-neutral-200/80 text-neutral-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-105 active:scale-95 shadow-sm"
    >
      +
    </button>

    {/* Precio flotante inferior */}
    <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-neutral-900/90 text-white backdrop-blur-md text-xs font-semibold tabular-nums shadow-sm">
      $24.500
    </div>
  </div>

  {/* Información */}
  <div className="p-2.5 flex-1 flex flex-col justify-between">
    <div>
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className="font-semibold text-sm text-neutral-900 tracking-tight group-hover:text-black line-clamp-1">
          {name}
        </h3>
      </div>
      <p className="text-xs text-neutral-500 line-clamp-2 mb-3 leading-relaxed">
        {description}
      </p>
    </div>

    {/* Botón de acción en píldora */}
    <button className="w-full py-2 px-3 rounded-full text-xs font-semibold bg-neutral-900 hover:bg-black text-white transition-all shadow-xs active:scale-98">
      Agregar a mi mesa
    </button>
  </div>
</div>
```

---

### B. Chips de Filtrado Horizontal (*Pill Segmented Navigation*)
```tsx
<div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
  {categories.map((cat) => {
    const isActive = selected === cat.id;
    return (
      <button
        key={cat.id}
        onClick={() => setSelected(cat.id)}
        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
          isActive
            ? 'bg-neutral-900 text-white shadow-xs border border-neutral-900'
            : 'bg-neutral-100/80 hover:bg-neutral-200/70 text-neutral-600 hover:text-neutral-900 border border-transparent'
        }`}
      >
        {cat.name}
      </button>
    );
  })}
</div>
```

---

### C. Buscador Central con Atajo `⌘K`
```tsx
<div className="relative flex-1 max-w-md">
  <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
  <input
    type="text"
    placeholder="Buscar por plato, ingrediente o maridaje..."
    className="w-full pl-10 pr-12 py-2.5 rounded-full bg-neutral-100/80 border border-transparent focus:border-neutral-300 focus:bg-white text-neutral-900 placeholder:text-neutral-400 text-xs sm:text-sm transition-all outline-none"
  />
  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 bg-neutral-200/60 rounded text-[10px] font-medium text-neutral-500">
    <span>⌘</span>K
  </div>
</div>
```

---

### D. Barra Flotante de Acción / Carrito Inferior
```tsx
<div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-sm px-4">
  <button className="w-full flex items-center justify-between px-5 py-3 rounded-full bg-neutral-900/95 hover:bg-black text-white font-medium text-xs sm:text-sm shadow-2xl backdrop-blur-md border border-neutral-800 transition-all hover:scale-[1.02] active:scale-98">
    <div className="flex items-center gap-2.5">
      <span className="w-5 h-5 rounded-full bg-white text-neutral-900 flex items-center justify-center text-[10px] font-bold">
        3
      </span>
      <span>Comanda Mesa 4</span>
    </div>
    <span className="font-semibold text-neutral-100 tabular-nums">
      $38.500 &rarr;
    </span>
  </button>
</div>
```

---

### E. Control Deslizante Minimalista (`.slider-mobbin`)
```tsx
<input
  type="range"
  min="5"
  max="80"
  value={value}
  onChange={(e) => setValue(Number(e.target.value))}
  className="slider-mobbin w-full h-2 rounded-full cursor-pointer"
/>
```

---

## 4. Animaciones y Microinteracciones

* **Aparición suave:** `.animate-fadeIn` (`opacity: 0; transform: translateY(8px)` &rarr; `opacity: 1; transform: translateY(0)`).
* **Ingreso de tickets / comandas:** `.animate-ticket` (rebote suave tipo comanda recién impresa).
* **Escáner láser IA:** `.animate-scan` con haz tenue `bg-gradient-to-r from-transparent via-white to-transparent`.
* **Elevación en hover:** `transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md`.
* **Feedback táctil:** `active:scale-98` en botones interactivos.
