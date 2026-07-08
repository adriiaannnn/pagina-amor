// ===== SUBIR ARCHIVOS DESDE PC =====
function subirArchivoDesdePC() {
    // Crear input de archivo oculto
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.multiple = false;
    
    input.onchange = function(e) {
        const file = this.files[0];
        if (!file) return;
        
        // Verificar tamaño (máximo 5MB para imágenes, 20MB para videos)
        const maxSize = file.type.startsWith('video') ? 20 * 1024 * 1024 : 5 * 1024 * 1024;
        if (file.size > maxSize) {
            alert(`❌ El archivo es demasiado grande. Máximo ${maxSize / (1024*1024)}MB.`);
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(event) {
            const dataURL = event.target.result;
            const tipo = file.type.startsWith('video') ? 'video' : 'imagen';
            
            // Pedir frase
            const frase = prompt('✏️ Escribe una frase romántica para este contenido:');
            if (!frase || frase.trim() === '') {
                alert('❌ Debes escribir una frase.');
                return;
            }
            
            // Guardar en localStorage
            const datos = getContenido();
            const nuevoId = datos.length > 0 ? Math.max(...datos.map(i => i.id)) + 1 : 1;
            
            datos.push({
                id: nuevoId,
                tipo: tipo,
                url: dataURL, // Guarda el archivo en Base64
                frase: frase.trim(),
                nombre: file.name,
                fecha: new Date().toLocaleString()
            });
            
            guardarContenido(datos);
            alert('✅ ¡Contenido subido con éxito! ❤️');
            
            // Recargar la galería
            cargarGaleria();
        };
        
        reader.onerror = function() {
            alert('❌ Error al leer el archivo. Intenta de nuevo.');
        };
        
        reader.readAsDataURL(file);
    };
    
    input.click();
}