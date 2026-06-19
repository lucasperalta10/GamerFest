# Guía de Modificaciones del Frontend - GamerFest

Esta guía detalla la estructura de archivos de la aplicación React (Frontend) para que puedas realizar modificaciones manuales de forma rápida y ordenada.

---

## 1. Estructura General del Proyecto
Todo el código fuente del frontend se encuentra en la carpeta `/frontend/src/`. A continuación, se detalla la función de cada archivo y carpeta principal:

```text
frontend/src/
├── assets/         # Recursos estáticos locales del código (logos, iconos locales)
├── components/     # Componentes visuales reutilizables (tarjetas, barra de navegación)
├── context/        # Estado global y comunicación con la API
├── pages/          # Vistas completas de la aplicación (páginas de la app)
├── App.css         # Estilos específicos del contenedor raíz
├── App.jsx         # Configuración de rutas (React Router)
├── index.css       # Sistema de diseño global (estilos, variables de color, neón)
└── main.jsx        # Punto de entrada de la aplicación React
```

---

## 2. Dónde hacer cambios según lo que busques modificar

### A. Si deseas modificar la lógica de una vista completa (`/pages`)
*   **Página Principal (Lanzamientos y Eventos):** 
    *   [Home.jsx](file:///c:/Users/LP/Desktop/Proyecto%20GamerFest/frontend/src/pages/Home.jsx)
    *   *Qué hace:* Muestra la grilla de próximos videojuegos y eventos, contiene los buscadores de texto y el dropdown para filtrar juegos por plataforma.
*   **Calendario Mensual:** 
    *   [CalendarView.jsx](file:///c:/Users/LP/Desktop/Proyecto%20GamerFest/frontend/src/pages/CalendarView.jsx)
    *   *Qué hace:* Genera la grilla de días del mes, calcula el desplazamiento de los días de la semana y filtra las actividades correspondientes para cada celda de día.
*   **Panel de Administración (CRUD):** 
    *   [AdminDashboard.jsx](file:///c:/Users/LP/Desktop/Proyecto%20GamerFest/frontend/src/pages/AdminDashboard.jsx)
    *   *Qué hace:* Panel de control donde los administradores pueden añadir, editar o eliminar juegos/eventos mediante formularios interactivos.
*   **Favoritos del Usuario:** 
    *   [Favorites.jsx](file:///c:/Users/LP/Desktop/Proyecto%20GamerFest/frontend/src/pages/Favorites.jsx)
    *   *Qué hace:* Filtra y renderiza únicamente los elementos marcados con un "corazón" por el usuario logueado.
*   **Formularios de Autenticación:** 
    *   [Login.jsx](file:///c:/Users/LP/Desktop/Proyecto%20GamerFest/frontend/src/pages/Login.jsx) y [Register.jsx](file:///c:/Users/LP/Desktop/Proyecto%20GamerFest/frontend/src/pages/Register.jsx)
    *   *Qué hace:* Maneja el inicio de sesión y registro de nuevas cuentas de usuario.

---

### B. Si deseas modificar elementos de diseño comunes (`/components`)
*   **Tarjeta de Videojuegos:** 
    *   [GameCard.jsx](file:///c:/Users/LP/Desktop/Proyecto%20GamerFest/frontend/src/components/GameCard.jsx)
    *   *Qué hace:* Controla la visualización de la tarjeta de juegos en la Home y Favoritos (título, descripción, tags de plataforma, botón de favoritos y fecha de lanzamiento).
*   **Tarjeta de Eventos:** 
    *   [EventCard.jsx](file:///c:/Users/LP/Desktop/Proyecto%20GamerFest/frontend/src/components/EventCard.jsx)
    *   *Qué hace:* Controla la visualización de los eventos y showcases (título, descripción corta, badge de tipo de evento y enlace externo).
*   **Barra de Navegación (Header):** 
    *   [Navbar.jsx](file:///c:/Users/LP/Desktop/Proyecto%20GamerFest/frontend/src/components/Navbar.jsx)
    *   *Qué hace:* Configura los enlaces de navegación, muestra el nombre de usuario activo y contiene el botón de Cerrar Sesión (Logout).
*   **Ventanas Emergentes:** 
    *   [Modal.jsx](file:///c:/Users/LP/Desktop/Proyecto%20GamerFest/frontend/src/components/Modal.jsx)
    *   *Qué hace:* La estructura base de las ventanas emergentes de detalles y de CRUD. Maneja el evento de cerrar la modal mediante la tecla *Escape* o haciendo clic fuera de ella.

---

### C. Si deseas cambiar variables de colores, fuentes o estilos generales
*   [index.css](file:///c:/Users/LP/Desktop/Proyecto%20GamerFest/frontend/src/index.css)
*   *Qué puedes cambiar aquí:*
    *   **Variables de colores principales** (como el morado, cian y rosa de acento en las líneas 14-18).
    *   **Fuentes del sistema** (tipografías 'Outfit' y 'Plus Jakarta Sans').
    *   **Efectos visuales** (sombras de neón `--shadow-glow`, bordes glassmorphism en la clase `.glass-panel` y degradados animados).

---

### D. Lógica de autenticación, favoritos y comunicación con el Backend
*   [AppContext.jsx](file:///c:/Users/LP/Desktop/Proyecto%20GamerFest/frontend/src/context/AppContext.jsx)
*   *Qué hace:* 
    *   Establece la dirección base de la API backend (`export const API_URL = 'http://localhost:5000/api'`).
    *   Gestiona el token de seguridad JWT guardado en el navegador (`gf_token`).
    *   Realiza las peticiones HTTP para añadir y remover elementos de la lista de favoritos (`toggleGameFavorite` y `toggleEventFavorite`).
    *   Expone estas funciones a todos los componentes de la aplicación a través del hook `useApp()`.

---

## 3. Prácticas Recomendadas para Modificaciones Manuales

1.  **Mantén la coherencia con los estilos:** Si creas un nuevo panel o botón interactivo, utiliza las variables CSS (por ejemplo, `var(--accent-purple)` o `var(--bg-secondary)`) en lugar de colores planos hardcodeados. Esto garantiza que la estética Dark Cyberpunk premium del sitio se mantenga uniforme.
2.  **Rutas de Imágenes:** Cualquier imagen estática que quieras añadir de forma permanente (como iconos adicionales) debe guardarse en la carpeta `/frontend/public/` (por ejemplo, en `/public/images/`) y ser referenciada en el código iniciando con la barra diagonal `/` (por ejemplo: `/images/mi-imagen.png`).
