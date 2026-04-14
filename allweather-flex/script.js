document.addEventListener('DOMContentLoaded', () => {
    const timestamp = new Date().getTime();

    fetch(`data_web.json?t=${timestamp}`)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log("✅ Datos cargados correctamente:", data.StrategyName);

            // 1. Título principal y nav
            const navTitle = document.getElementById('nav-title');
            if (navTitle) {
                navTitle.innerHTML = `<i class="fa-solid fa-chart-line"></i> ${data.StrategyName}`;
            }
            document.title = data.StrategyName || "ReplicAlgo Dashboard";

            // 2. Fecha en la barra superior
            const fechaEl = document.getElementById('fecha-update');
            if (fechaEl) {
                fechaEl.textContent = data.Fecha || data.MesActual || "Actualizado";
            }

            // 3. Mes y Año en los títulos (Órdenes y Portafolio)
            const mesActual = data.MesActual || "";
            const tituloOrdenes = document.getElementById('mes-ordenes');
            const tituloPortafolio = document.getElementById('mes-portafolio');

            if (tituloOrdenes) tituloOrdenes.textContent = mesActual ? `(${mesActual})` : '';
            if (tituloPortafolio) tituloPortafolio.textContent = mesActual ? `(${mesActual})` : '';

            // 4. ÓRDENES DEL MES - con colores
            const ordersBody = document.getElementById('tabla-ordenes');
            if (ordersBody && data.Ordenes && data.Ordenes.length > 0) {
                ordersBody.innerHTML = data.Ordenes.map(o => `
                    <tr>
                        <td class="p-5 ${o.Accion === 'COMPRAR' ? 'accion-comprar' : 'accion-vender'}">
                            ${o.Accion}
                        </td>
                        <td class="p-5 font-medium">${o.Simbolo}</td>
                        <td class="p-5">${o.Nombre}</td>
                        <td class="p-5">${o.Instruccion}</td>
                        <td class="p-5">${o.MGC}</td>
                    </tr>
                `).join('');
            } else if (ordersBody) {
                ordersBody.innerHTML = `<tr><td colspan="5" class="p-8 text-center text-slate-400">Sin órdenes este mes</td></tr>`;
            }

            // 5. PORTAFOLIO ACTUAL - con formato especial en Estado
            const portfolioBody = document.getElementById('tabla-portafolio');
            if (portfolioBody && data.Portafolio && data.Portafolio.length > 0) {
                portfolioBody.innerHTML = data.Portafolio.map(p => `
                    <tr>
                        <td class="p-5">${p.Simbolo}</td>
                        <td class="p-5">${p.Nombre}</td>
                        <td class="p-5 text-right font-medium">${p.Peso}</td>
                        <td class="p-5 text-center">
                            ${p.Estado === 'NUEVA COMPRA' 
                                ? `<span class="estado-nueva-compra">NUEVA COMPRA</span>` 
                                : `<span class="estado-mantenido">Mantenido</span>`}
                        </td>
                        <td class="p-5 text-center">${p.MGC}</td>
                    </tr>
                `).join('');
            }

            // 6. Resumen de Rendimiento
            const stratReturn = document.getElementById('strat-return');
            const benchReturn = document.getElementById('bench-return');
            if (stratReturn && data.Historico?.resumen?.Strategy) {
                stratReturn.textContent = data.Historico.resumen.Strategy;
            }
            if (benchReturn && data.Historico?.resumen?.Benchmark) {
                benchReturn.textContent = data.Historico.resumen.Benchmark;
            }

            // 7. Tabla Anual con colores (positivo verde, negativo rojo)
            const annualBody = document.getElementById('tabla-historico');
            if (annualBody && data.Historico?.tabla_anual) {
                annualBody.innerHTML = data.Historico.tabla_anual.map(row => {
                    const retorno = row.Retorno || '';
                    const esPositivo = retorno && !retorno.includes('-');
                    return `
                        <tr>
                            <td class="p-5">${row.Año}</td>
                            <td class="p-5 font-medium ${esPositivo ? 'text-emerald-400' : 'text-red-400'}">
                                ${retorno}
                            </td>
                            <td class="p-5 text-red-400">${row.MaxPerdida}</td>
                        </tr>
                    `;
                }).join('');
            }

            console.log("🎉 Dashboard actualizado correctamente");
        })
        .catch(err => {
            console.error("❌ Error al cargar data_web.json:", err);
            const bodies = document.querySelectorAll('tbody');
            bodies.forEach(body => {
                if (body) {
                    body.innerHTML = `<tr><td colspan="5" class="p-12 text-center text-red-400">Error al cargar datos. Intenta recargar con Ctrl + F5</td></tr>`;
                }
            });
        });
});