// script.js
// Función para sumar una venta y mover el auto
async function addSale(vendedorId) {
    try {
        // Obtiene el progreso actual y calcula el nuevo progreso
        const currentProgress = getCurrentProgress(vendedorId);
        const newProgress = currentProgress + 1;

        // Actualiza el progreso en el servidor
        const response = await fetch('/update-progress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre: vendedorId, progreso: newProgress }),
        });

        if (response.ok) {
            // Actualiza la posición del auto
            updatePosition(vendedorId, newProgress);
        } else {
            console.error('Error al actualizar el progreso');
        }
    } catch (error) {
        console.error('Error de red:', error);
    }
}

// Obtiene el progreso actual de un vendedor
function getCurrentProgress(vendedorId) {
    const car = document.getElementById(vendedorId);
    return parseInt(car.dataset.progress) || 0;
}

// Actualiza la posición del auto
function updatePosition(vendedorId, progress) {
    const car = document.getElementById(vendedorId);
    car.dataset.progress = progress;

    // Ajusta la escala según la longitud de la pista
    const trackWidth = document.querySelector('.race-track').offsetWidth;
    const maxProgress = 100; // Puedes ajustar esto según la longitud de la pista
    const leftPosition = (progress / maxProgress) * (trackWidth - car.offsetWidth);

    car.style.left = `${leftPosition}px`;
}

// Inicializar las posiciones al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/positions');
        const positions = await response.json();
        Object.keys(positions).forEach(vendedor => {
            updatePosition(vendedor, positions[vendedor]);
        });
    } catch (error) {
        console.error('Error al cargar las posiciones:', error);
    }
});
