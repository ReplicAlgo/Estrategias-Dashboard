/**
 * Script para el Dashboard de Estrategias Individuales
 * Maneja la carga de datos desde data_web.json e inyecta el contenido en las tablas.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Usamos un timestamp para evitar que el navegador guarde en caché versiones viejas del JSON
    const timestamp = new Date().getTime();

    fetch(`data_web.json?t=${timestamp}`)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log("✅ Datos cargados correctamente:", data.StrategyName);

            // 1. Actualizar Título de la Estrategia en la Navbar
            const navTitle = document.getElementById('nav-title');
            if (navTitle) {
                navTitle.innerHTML = `<i class="fa-solid fa-chart-line text-blue-400"></i> ${data.StrategyName}`;
            }
            document.title = `ReplicAlgo | ${data.StrategyName}`;

            // 2. Actualizar Fecha de última actualización (barra superior)
            const fechaEl = document.getElementById('fecha-update');
            if (fechaEl) {
                fechaEl.textContent = data.Fecha || data.MesActual || "Actualizado";
            }

            // 3. Mes al lado de los títulos de las secciones
            const mesActual = data.MesActual || "";
            const tituloOrdenes = document.getElementById('mes-ordenes');
            const tituloPortafolio = document.getElementById('mes-portafolio');

            if (tituloOrdenes) tituloOrdenes.textContent = mesActual ? `(${mesActual})` : '';
            if (tituloPortafolio) tituloPortafolio.textContent = mesActual ? `(${mesActual})` : '';

            // 4. TABLA DE ÓRDENES - (5 Columnas en el HTML)
            // Se alinea la Cantidad a la derecha y se mantiene el estilo azul para los Tickers
            const ordersBody = document.getElementById('tabla-ordenes');
            if (ordersBody) {
                // Verificamos si hay órdenes y si el array tiene contenido
                if (data.Ordenes && data.Ordenes.length > 0) {
                    ordersBody.innerHTML = data.Ordenes.map(o => `
                        <tr class="hover:bg-white/5 transition-colors">
                            <td class="p-5 ${o.Accion === 'COMPRAR' ? 'accion-comprar' : 'accion-vender'} font-bold">
                                ${o.Accion}
                            </td>
                            <td class="p-5 font-bold text-blue-400 mono italic">${o.Simbolo || o.Ticker}</td>
                            <td class="p-5 text-slate-300 font-medium">${o.Nombre}</td>
                            <td class="p-5 text-slate-400 italic">${o.Instruccion}</td>
                            <td class="p-5 text-right pr-12 mono text-slate-200 font-bold">
                                ${o.Cantidad || o.MGC || '-'}
                            </td>
                        </tr>
                    `).join('');
                } else {
                    // Si NO hay órdenes, mostramos el letrero de "No hay cambios"
                    ordersBody.innerHTML = `
                        <tr>
                            <td colspan="5" class="p-12 text-center">
                                <div class="flex flex-col items-center gap-2">
                                    <i class="fa-solid fa-circle-check text-slate-600 text-xl"></i>
                                    <span class="text-slate-500 font-medium tracking-wide">No hay cambios este mes.</span>
                                    <span class="text-slate-600 text-[10px] uppercase tracking-widest">Mantener posiciones actuales</span>
                                </div>
                            </td>
                        </tr>
                    `;
                }
            }

            // 5. TABLA DE PORTAFOLIO - (4 Columnas en el HTML)
            const portfolioBody = document.getElementById('tabla-portafolio');
            if (portfolioBody && data.Portafolio) {
                portfolioBody.innerHTML = data.Portafolio.map(p => {
                    const clEstado = p.Estado === 'NUEVA COMPRA' ? 'estado-nueva-compra' : 'estado-mantenido';
                    return `
                        <tr class="hover:bg-white/5 transition-colors">
                            <td class="p-5 font-bold text-blue-400 mono italic">${p.Simbolo || p.Ticker}</td>
                            <td class="p-5 text-slate-300 font-medium">${p.Nombre || p.Activo}</td>
                            <td class="p-5 text-right font-bold text-white mono text-base">${p.Peso || p.PesoActual}</td>
                            <td class="p-5 text-center">
                                <span class="${clEstado}">${p.Estado}</span>
                            </td>
                        </tr>
                    `;
                }).join('');
            }

            // 6. Resumen de Performance (Cajas de Rentabilidad)
            const stratReturn = document.getElementById('strat-return');
            const benchReturn = document.getElementById('bench-return');
            
            const res = data.Historico?.resumen;
            if (stratReturn && res) stratReturn.textContent = res.Strategy || res.Estrategia || "--%";
            if (benchReturn && res) benchReturn.textContent = res.Benchmark || "--%";

            // 7. Tabla Histórico Anual (Año, Retorno, Max DD)
            const annualBody = document.getElementById('tabla-historico');
            if (annualBody && data.Historico?.tabla_anual) {
                annualBody.innerHTML = data.Historico.tabla_anual.map(row => {
                    const retorno = row.Retorno || '';
                    const esPositivo = retorno && !retorno.includes('-');
                    return `
                        <tr class="hover:bg-white/5 transition-colors">
                            <td class="p-4 text-slate-400 font-medium">${row.Año}</td>
                            <td class="p-4 font-bold ${esPositivo ? 'text-emerald-400' : 'text-red-400'}">
                                ${retorno}
                            </td>
                            <td class="p-4 text-red-400/80 mono">${row.MaxPerdida || row.MaxDD || '-'}</td>
                        </tr>
                    `;
                }).join('');
            }

            console.log("🎉 Dashboard actualizado con éxito");
        })
        .catch(err => {
            console.error("❌ Error cargando el JSON:", err);
        });
});