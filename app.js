// 1. Año dinámico para el Copyright
document.getElementById('year').textContent = new Date().getFullYear();

// 2. Autocompletar producto desde las tarjetas
function seleccionarProducto(nombreProducto) {
    const select = document.getElementById('producto');
    select.value = nombreProducto;
    document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
}

// 3. Conexión del formulario a Base de Datos en la nube (Supabase REST API)
// Pasos rápidos en supabase.com:
// a) Crea un proyecto gratis y una tabla llamada "pedidos" con columnas: nombre, email, producto, cantidad, mensaje
// b) Pega aquí tu SUPABASE_URL y tu SUPABASE_ANON_KEY (Project Settings -> API)
const SUPABASE_URL = 'https://TU-PROYECTO.supabase.co/rest/v1/pedidos';
const SUPABASE_ANON_KEY = 'TU_CLAVE_PUBLICA_ANON_DE_SUPABASE';

const form = document.getElementById('pedidoForm');
const estadoEnvio = document.getElementById('estadoEnvio');
const btnSubmit = document.getElementById('btnSubmit');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Guardando en base de datos...';
    estadoEnvio.textContent = '';

    const datosPedido = {
        nombre: document.getElementById('nombre').value.trim(),
        email: document.getElementById('email').value.trim(),
        producto: document.getElementById('producto').value,
        cantidad: parseInt(document.getElementById('cantidad').value, 10),
        mensaje: document.getElementById('mensaje').value.trim()
    };

    try {
        // Si aún no colocas tus credenciales de Supabase, simula el guardado local para pruebas
        if (SUPABASE_URL.includes('TU-PROYECTO')) {
            await new Promise(resolve => setTimeout(resolve, 800));
            console.log('Datos listos para enviar a BD:', datosPedido);
            estadoEnvio.style.color = '#2e7d32';
            estadoEnvio.textContent = '✅ Pedido validado (Modo prueba: configura tu URL de Supabase en app.js para guardar en la nube).';
            form.reset();
            return;
        }

        // Petición HTTPS POST hacia la base de datos
        const respuesta = await fetch(SUPABASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(datosPedido)
        });

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        estadoEnvio.style.color = '#2e7d32';
        estadoEnvio.textContent = '✅ ¡Pedido registrado con éxito en la base de datos! Te contactaremos pronto.';
        form.reset();

    } catch (error) {
        console.error('Error al guardar:', error);
        estadoEnvio.style.color = '#c62828';
        estadoEnvio.textContent = '❌ Ocurrió un error al conectar con la base de datos. Intenta nuevamente.';
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.textContent = 'Enviar Pedido a Base de Datos';
    }
});