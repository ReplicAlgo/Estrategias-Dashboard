document.addEventListener('DOMContentLoaded', () => {
    const timestamp = new Date().getTime();

    fetch(`data_web.json?t=${timestamp}`)
        .then(response => response.json())
        .then(data => {
            console.log("✅ Datos cargados:", data.StrategyName);

            // Título
            const navTitle = document.getElementById('nav-title');
            if (navTitle) navTitle.innerHTML = `<i class="fa-solid fa-chart-line"></i> ${data.StrategyName}`;
            document.title = data.StrategyName || "ReplicAlgo Dashboard";

            // Fecha
            const fechaEl = document.getElementById('fecha-update');
            if (fechaEl) fechaEl.textContent = data.Fecha || data.MesActual || "";

            // ÓRDENES DEL MES
            const ordersBody = document.getElementById('tabla-ordenes');
            if (ordersBody && data.Ordenes) {
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
            }

            // PORTAFOLIO ACTUAL
            const portfolioBody = document.getElementById('tabla-portafolio');
            if (portfolioBody && data.Portafolio) {
                portfolioBody.innerHTML = data.Portafolio.map(p => `
                    <tr>
                        <td class="p-5">${p.Simbolo}</td>
                        <td class="p-5">${p.Nombre}</td>
                        <td class="p-5 text-right">${p.Peso}</td>
                        <td class="p-5 text-center">
                            ${p.Estado === 'NUEVA COMPRA' 
                                ? `<span class="estado-nueva-compra">NUEVA COMPRA</span>` 
                                : `<span class="estado-mantenido">Mantenido</span>`}
                        </td>
                        <td class="p-5 text-center">${p.MGC}</td>
                    </tr>
                `).join('');
            }

            // Resumen de Rendimiento
            const stratReturn = document.getElementById('strat-return');
            const benchReturn = document.getElementById('bench-return');
            if (stratReturn && data.Historico?.resumen?.Strategy) stratReturn.textContent = data.Historico.resumen.Strategy;
            if (benchReturn && data.Historico?.resumen?.Benchmark) benchReturn.textContent = data.Historico.resumen.Benchmark;

            // Tabla Anual con colores
            const annualBody = document.getElementById('tabla-historico');
            if (annualBody && data.Historico?.tabla_anual) {
                annualBody.innerHTML = data.Historico.tabla_anual.map(row => {
                    const retorno = row.Retorno || '';
                    const esPositivo = !retorno.includes('-');
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
        })
        .catch(err => console.error("Error cargando datos:", err));
});