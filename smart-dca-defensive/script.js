document.addEventListener('DOMContentLoaded', () => {
    // El 't=' previene que el navegador use datos viejos (caché)
    fetch(`data_web.json?t=${new Date().getTime()}`)
        .then(response => response.json())
        .then(data => {
            console.log("Cargando datos para:", data.StrategyName);

            // 1. Actualizar Títulos y Fechas
            document.title = data.StrategyName;
            const titulo = document.querySelector('h1, .strategy-title, #title');
            if (titulo) titulo.textContent = data.StrategyName;

            const fechas = document.querySelectorAll('.month-label, #date-header, .corte-fecha');
            fechas.forEach(el => el.textContent = data.MesActual || data.Fecha);

            // 2. Llenar Tabla de Órdenes
            const ordersBody = document.getElementById('orders-body') || document.querySelector('[id*="orders"] tbody');
            if (ordersBody && data.Ordenes) {
                ordersBody.innerHTML = data.Ordenes.map(o => `
                    <tr>
                        <td class="p-3">${o.Accion}</td>
                        <td class="p-3"><strong>${o.Simbolo}</strong></td>
                        <td class="p-3">${o.Nombre}</td>
                        <td class="p-3">${o.Instruccion}</td>
                        <td class="p-3">${o.MGC}</td>
                    </tr>
                `).join('');
            }

            // 3. Llenar Tabla de Portafolio
            const portfolioBody = document.getElementById('portfolio-body') || document.querySelector('[id*="portfolio"] tbody');
            if (portfolioBody && data.Portafolio) {
                portfolioBody.innerHTML = data.Portafolio.map(p => `
                    <tr>
                        <td class="p-3">${p.Simbolo}</td>
                        <td class="p-3">${p.Nombre}</td>
                        <td class="p-3">${p.Peso}</td>
                        <td class="p-3 text-green-400">${p.Estado}</td>
                        <td class="p-3">${p.MGC}</td>
                    </tr>
                `).join('');
            }

            // 4. Resumen de Rendimiento
            const bch = document.getElementById('bench-return');
            const str = document.getElementById('strat-return');
            if (bch && data.Historico.resumen) bch.textContent = data.Historico.resumen.Benchmark;
            if (str && data.Historico.resumen) str.textContent = data.Historico.resumen.Strategy;

            // 5. Tabla Anual
            const annualBody = document.getElementById('annual-body') || document.querySelector('[id*="annual"] tbody');
            if (annualBody && data.Historico.tabla_anual) {
                annualBody.innerHTML = data.Historico.tabla_anual.map(row => `
                    <tr>
                        <td class="p-2">${row.Año}</td>
                        <td class="p-2">${row.Retorno}</td>
                        <td class="p-2 text-red-400">${row.MaxPerdida}</td>
                    </tr>
                `).join('');
            }
        })
        .catch(err => console.error("Error crítico: No se encontró data_web.json", err));
});