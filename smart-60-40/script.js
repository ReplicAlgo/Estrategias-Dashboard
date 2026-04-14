document.addEventListener('DOMContentLoaded', () => {
    const timestamp = new Date().getTime();
    
    // Cache-busting fuerte para el JSON
    fetch(`data_web.json?t=${timestamp}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("✅ Datos cargados correctamente para:", data.StrategyName);

            // 1. Títulos y Fechas
            document.title = data.StrategyName || "Smart Strategy Dashboard";
            
            const titulo = document.querySelector('h1, .strategy-title, #title, nav h1');
            if (titulo) titulo.textContent = data.StrategyName || "Estrategia";

            // Fecha en el nav (más confiable)
            const fechaEl = document.getElementById('fecha-update');
            if (fechaEl) fechaEl.textContent = data.Fecha || data.MesActual || "Actualizado";

            // 2. Órdenes
            const ordersBody = document.getElementById('tabla-ordenes') || document.querySelector('[id*="orders"] tbody');
            if (ordersBody && data.Ordenes && data.Ordenes.length > 0) {
                ordersBody.innerHTML = data.Ordenes.map(o => `
                    <tr>
                        <td class="p-3">${o.Accion || ''}</td>
                        <td class="p-3"><strong>${o.Simbolo || ''}</strong></td>
                        <td class="p-3">${o.Nombre || ''}</td>
                        <td class="p-3">${o.Instruccion || ''}</td>
                        <td class="p-3">${o.MGC || '-'}</td>
                    </tr>
                `).join('');
            } else if (ordersBody) {
                ordersBody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-slate-400">Sin órdenes este mes</td></tr>`;
            }

            // 3. Portafolio
            const portfolioBody = document.getElementById('tabla-portafolio') || document.querySelector('[id*="portfolio"] tbody');
            if (portfolioBody && data.Portafolio && data.Portafolio.length > 0) {
                portfolioBody.innerHTML = data.Portafolio.map(p => `
                    <tr>
                        <td class="p-3">${p.Simbolo || ''}</td>
                        <td class="p-3">${p.Nombre || ''}</td>
                        <td class="p-3 text-right">${p.Peso || ''}</td>
                        <td class="p-3 text-center text-green-400">${p.Estado || 'MANTENER'}</td>
                        <td class="p-3 text-center">${p.MGC || '-'}</td>
                    </tr>
                `).join('');
            }

            // 4. Resumen de Rendimiento
            const bch = document.getElementById('bench-return');
            const str = document.getElementById('strat-return');
            if (bch && data.Historico?.resumen) bch.textContent = data.Historico.resumen.Benchmark || 'N/A';
            if (str && data.Historico?.resumen) str.textContent = data.Historico.resumen.Strategy || 'N/A';

            // 5. Tabla Anual
            const annualBody = document.getElementById('tabla-historico') || document.querySelector('[id*="annual"] tbody');
            if (annualBody && data.Historico?.tabla_anual && data.Historico.tabla_anual.length > 0) {
                annualBody.innerHTML = data.Historico.tabla_anual.map(row => `
                    <tr>
                        <td class="p-2">${row.Año}</td>
                        <td class="p-2">${row.Retorno}</td>
                        <td class="p-2 text-red-400">${row.MaxPerdida}</td>
                    </tr>
                `).join('');
            }

        })
        .catch(err => {
            console.error("❌ Error al cargar data_web.json:", err);
            // Mensaje amigable al usuario
            const containers = document.querySelectorAll('tbody');
            containers.forEach(tb => {
                if (tb) tb.innerHTML = `<tr><td colspan="5" class="p-8 text-center text-red-400">Error al cargar datos. Intenta recargar la página (Ctrl + F5).</td></tr>`;
            });
        });
});