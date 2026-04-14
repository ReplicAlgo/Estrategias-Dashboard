document.addEventListener('DOMContentLoaded', () => {
    const timestamp = new Date().getTime();

    fetch(`data_web.json?t=${timestamp}`)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log("✅ Datos cargados:", data.StrategyName);

            // 1. Actualizar título principal (nav)
            const navTitle = document.getElementById('nav-title');
            if (navTitle) {
                navTitle.innerHTML = `<i class="fa-solid fa-chart-line mr-2"></i>${data.StrategyName}`;
            }
            document.title = data.StrategyName || "Smart-DCA Dashboard";

            // 2. Fecha de actualización
            const fechaEl = document.getElementById('fecha-update');
            if (fechaEl) {
                fechaEl.textContent = data.Fecha || data.MesActual || "Actualizado";
            }

            // 3. Órdenes del mes
            const ordersBody = document.getElementById('tabla-ordenes');
            if (ordersBody && data.Ordenes) {
                ordersBody.innerHTML = data.Ordenes.map(o => `
                    <tr>
                        <td class="p-3">${o.Accion || ''}</td>
                        <td class="p-3"><strong>${o.Simbolo || ''}</strong></td>
                        <td class="p-3">${o.Nombre || ''}</td>
                        <td class="p-3">${o.Instruccion || ''}</td>
                        <td class="p-3">${o.MGC || '-'}</td>
                    </tr>
                `).join('');
            }

            // 4. Portafolio actual
            const portfolioBody = document.getElementById('tabla-portafolio');
            if (portfolioBody && data.Portafolio) {
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

            // 5. RESUMEN DE RENDIMIENTO (¡ESTA ES LA PARTE QUE FALTABA!)
            const stratReturn = document.getElementById('strat-return');
            const benchReturn = document.getElementById('bench-return');

            if (stratReturn && data.Historico?.resumen?.Strategy) {
                stratReturn.textContent = data.Historico.resumen.Strategy;
            }
            if (benchReturn && data.Historico?.resumen?.Benchmark) {
                benchReturn.textContent = data.Historico.resumen.Benchmark;
            }

            // 6. Tabla anual
            const annualBody = document.getElementById('tabla-historico');
            if (annualBody && data.Historico?.tabla_anual) {
                annualBody.innerHTML = data.Historico.tabla_anual.map(row => `
                    <tr>
                        <td class="p-2">${row.Año}</td>
                        <td class="p-2">${row.Retorno}</td>
                        <td class="p-2 text-red-400">${row.MaxPerdida}</td>
                    </tr>
                `).join('');
            }

            console.log("🎉 Dashboard actualizado correctamente");
        })
        .catch(err => {
            console.error("❌ Error cargando data_web.json:", err);
            // Mensaje visible si falla
            const bodies = document.querySelectorAll('tbody');
            bodies.forEach(body => {
                if (body) {
                    body.innerHTML = `<tr><td colspan="5" class="p-8 text-center text-red-400">Error al cargar datos. Presiona Ctrl + F5</td></tr>`;
                }
            });
        });
});