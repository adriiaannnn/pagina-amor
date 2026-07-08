// ===== CONTRASEÑA (cámbiala por la que quieras) =====
const CONTRASENA_ADMIN = "amor2026"; // 🔒 Cambia esto por tu contraseña

// ===== VARIABLE GLOBAL =====
let tipoSeleccionado = 'imagen';

// ===== CORAZONES FLOTANTES =====
function crearCorazones() {
    const container = document.getElementById('floatingHearts');
    const simbolos = ['♥', '❤', '💕', '💖', '💗'];
    for (let i = 0; i < 30; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = simbolos[Math.floor(Math.random() * simbolos.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (12 + Math.random() * 28) + 'px';
        heart.style.animationDuration = (12 + Math.random() * 20) + 's';
        heart.style.animationDelay = (Math.random() * 25) + 's';
        heart.style.opacity = 0.1 + Math.random() * 0.2;
        container.appendChild(heart);
    }
}
crearCorazones();

// ===== FUNCIONES ADMIN =====
function seleccionarTipo(tipo) {
    tipoSeleccionado = tipo;
    document.querySelectorAll('.tipo-selector button').forEach(b => b.classList.remove('active'));
    document.querySelector(`.tipo-selector button[data-tipo="${tipo}"]`).classList.add('active');
}

function toggleAdmin() {
    const adminPanel = document.getElementById('adminPanel');
    
    if (adminPanel.classList.contains('active')) {
        adminPanel.classList.remove('active');
        // Cerrar sesión al cerrar el panel
        sessionStorage.removeItem('adminAuth');
        // Ocultar botones de eliminar
        document.querySelectorAll('.media-card .media-container button').forEach(btn => {
            btn.style.opacity = '0';
        });
    } else {
        // Mostrar modal de login en lugar de abrir directamente
        document.getElementById('modalLogin').style.display = 'flex';
        document.getElementById('passwordInputAdmin').focus();
    }
}

function verificarPassword() {
    const input = document.getElementById('passwordInputAdmin');
    const error = document.getElementById('errorLogin');
    
    if (input.value === CONTRASENA_ADMIN) {
        // Login exitoso
        document.getElementById('modalLogin').style.display = 'none';
        document.getElementById('adminPanel').classList.add('active');
        sessionStorage.setItem('adminAuth', 'true');
        input.value = '';
        error.style.display = 'none';
        
        // Mostrar botones de eliminar
        document.querySelectorAll('.media-card .media-container button').forEach(btn => {
            btn.style.opacity = '1';
        });
    } else {
        error.style.display = 'block';
        input.value = '';
        input.focus();
    }
}

// Cerrar modal de login al hacer clic fuera
document.getElementById('modalLogin').addEventListener('click', function(e) {
    if (e.target === this) {
        this.style.display = 'none';
    }
});

// Enter para login
document.getElementById('passwordInputAdmin').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') verificarPassword();
});

function getContenido() {
    try {
        return JSON.parse(localStorage.getItem('contenidoAmor') || '[]');
    } catch {
        return [];
    }
}

function guardarContenido(datos) {
    localStorage.setItem('contenidoAmor', JSON.stringify(datos));
    cargarGaleria();
}

function agregarContenido() {
    const url = document.getElementById('urlInput').value.trim();
    const frase = document.getElementById('fraseInput').value.trim();

    if (!url) {
        alert('❌ Por favor, ingresa una URL de imagen o video.');
        return;
    }
    if (!frase) {
        alert('❌ Por favor, escribe una frase romántica.');
        return;
    }

    const datos = getContenido();
    const nuevoId = datos.length > 0 ? Math.max(...datos.map(i => i.id)) + 1 : 1;

    datos.push({
        id: nuevoId,
        tipo: tipoSeleccionado,
        url: url,
        frase: frase
    });

    guardarContenido(datos);
    document.getElementById('urlInput').value = '';
    document.getElementById('fraseInput').value = '';
    alert('✅ ¡Contenido agregado con éxito!');
}

function eliminarTodo() {
    if (confirm('¿Estás seguro de eliminar TODO el contenido?')) {
        localStorage.removeItem('contenidoAmor');
        cargarGaleria();
        alert('🗑️ Todo el contenido ha sido eliminado.');
    }
}

function eliminarItem(id) {
    if (confirm('¿Eliminar este elemento?')) {
        let datos = getContenido();
        datos = datos.filter(item => item.id !== id);
        guardarContenido(datos);
    }
}

// ===== CARGAR GALERÍA =====
function cargarGaleria() {
    const gallery = document.getElementById('gallery');
    let datos = getContenido();

    if (datos.length === 0) {
        // Contenido por defecto
        const defaultData = [
            { id: 1, tipo: 'imagen', url: 'https://picsum.photos/seed/romance1/400/300', frase: 'Eres la razón por la que sonrío cada mañana ☀️' },
            { id: 2, tipo: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', frase: 'Cada momento a tu lado es mi canción favorita 🎵' },
            { id: 3, tipo: 'imagen', url: 'https://picsum.photos/seed/romance2/400/300', frase: 'Eres mi lugar favorito en el mundo 🌍' },
            { id: 4, tipo: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', frase: 'Tu risa es la melodía que alegra mis días 🎶' },
            { id: 5, tipo: 'imagen', url: 'https://picsum.photos/seed/romance3/400/300', frase: 'Contigo, el amor siempre encuentra el camino 💫' },
            { id: 6, tipo: 'imagen', url: 'https://picsum.photos/seed/romance4/400/300', frase: 'Eres el sueño del que nunca quiero despertar 🌙' }
        ];
        localStorage.setItem('contenidoAmor', JSON.stringify(defaultData));
        cargarGaleria();
        return;
    }

    gallery.innerHTML = '';
    datos.forEach(item => {
        const card = document.createElement('div');
        card.className = 'media-card';

        const container = document.createElement('div');
        container.className = 'media-container';

        // Botón eliminar
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = '✕';
        btnEliminar.style.cssText = `
            position: absolute; top: 8px; left: 8px; 
            background: #e91e63; color: #fff; border: none;
            border-radius: 50%; width: 28px; height: 28px;
            cursor: pointer; font-size: 0.8rem; z-index: 10;
            opacity: 0; transition: opacity 0.3s ease;
        `;
        btnEliminar.onclick = (e) => {
            e.stopPropagation();
            eliminarItem(item.id);
        };
        container.appendChild(btnEliminar);

        // Mostrar botón eliminar si admin está activo
        if (document.getElementById('adminPanel').classList.contains('active')) {
            btnEliminar.style.opacity = '1';
        }

        // Contenido multimedia
        if (item.tipo === 'video') {
            const video = document.createElement('video');
            video.muted = true;
            video.playsInline = true;
            video.preload = 'metadata';
            const source = document.createElement('source');
            source.src = item.url;
            source.type = 'video/mp4';
            video.appendChild(source);
            container.appendChild(video);

            const badge = document.createElement('span');
            badge.className = 'media-badge';
            badge.innerHTML = '<i class="fas fa-play"></i> VIDEO';
            container.appendChild(badge);
        } else {
            const img = document.createElement('img');
            img.src = item.url;
            img.alt = 'Foto romántica';
            img.onerror = function() {
                this.src = 'https://via.placeholder.com/400x300?text=Imagen+no+disponible';
            };
            container.appendChild(img);
        }

        const fraseDiv = document.createElement('div');
        fraseDiv.className = 'frase-oculta';
        const span = document.createElement('span');
        span.className = 'frase-texto';
        span.innerHTML = '<i class="fas fa-heart"></i> Toca para descubrir';
        fraseDiv.appendChild(span);

        card.appendChild(container);
        card.appendChild(fraseDiv);
        gallery.appendChild(card);

        // Evento click para revelar frase
        card.addEventListener('click', function(e) {
            if (span.classList.contains('revelado')) return;
            span.innerHTML = `<span class="icono-corazon">❤️</span> ${item.frase}`;
            span.classList.add('revelado');
            crearConfetiCorazones(e.clientX, e.clientY);

            const video = card.querySelector('video');
            if (video && video.paused) video.play();
        });

        // Eventos para videos
        const video = card.querySelector('video');
        if (video) {
            video.addEventListener('dblclick', function(e) {
                e.stopPropagation();
                if (video.paused) video.play();
                else video.pause();
            });
        }
    });
}

// ===== CONFETI DE CORAZONES =====
function crearConfetiCorazones(x, y) {
    const simbolos = ['❤️', '💕', '💖', '💗', '♥'];
    for (let i = 0; i < 20; i++) {
        const confeti = document.createElement('div');
        confeti.textContent = simbolos[Math.floor(Math.random() * simbolos.length)];
        confeti.style.cssText = `
            position: fixed;
            left: ${x - 20 + Math.random() * 40}px;