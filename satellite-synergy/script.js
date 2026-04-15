/**
 * Script para el Dashboard de Estrategias Individuales
 * Maneja la carga de datos desde data_web.json e inyecta el contenido en las tablas.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Usamos un timestamp para evitar caché
    const timestamp = new Date().getTime();

    fetch(`data_web.json?t=${timestamp}`)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log("✅ Datos cargados correctamente:", data.StrategyName);

            // 1. Títulos y Fecha
            const navTitle = document.getElementById('nav-title');
            if (navTitle) navTitle.innerHTML = `<i class="fa-solid fa-chart-line text-blue-400"></i> ${data.StrategyName}`;
            document.title = `ReplicAlgo | ${data.StrategyName}`;

            const fechaEl = document.getElementById('fecha-update');
            if (fechaEl) fechaEl.textContent = data.Fecha || data.MesActual || "Actualizado";

            const mesActual = data.MesActual || "";
            const tOrdenes = document.getElementById('mes-ordenes');
            const tPortafolio = document.getElementById('mes-portafolio');
            if (tOrdenes) tOrdenes.textContent = mesActual ? `(${mesActual})` : '';
            if (tPortafolio) tPortafolio.textContent = mesActual ? `(${mesActual})` : '';

            // 2. Tabla de Órdenes
            const ordersBody = document.getElementById('tabla-ordenes');
            if (ordersBody) {
                if (data.Ordenes && data.Ordenes.length > 0) {
                    ordersBody.innerHTML = data.Ordenes.map(o => `
                        <tr>
                            <td class="p-5 ${o.Accion === 'COMPRAR' ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}">
                                ${o.Accion}
                            </td>
                            <td class="p-5 font-bold text-blue-400 mono">${o.Simbolo}</td>
                            <td class="p-5 text-slate-300">
                                <div class="font-medium">${o.Nombre}</div>
                                <div class="text-[10px] text-slate-500 uppercase tracking-tighter">${o.Cantidad}</div>
                            </td>
                            <td class="p-5 italic text-slate-400 text-xs">${o.Instruccion}</td>
                            <td class="p-5 text-right font-mono text-slate-500 pr-10">${o.MGC || '-'}</td>
                        </tr>
                    `).join('');
                } else {
                    ordersBody.innerHTML = `<tr><td colspan="5" class="p-10 text-center text-slate-500 italic">No hay órdenes para este periodo. Mantener posiciones actuales.</td></tr>`;
                }
            }

            // 3. Tabla de Portafolio
            const portfolioBody = document.getElementById('tabla-portafolio');
            if (portfolioBody && data.Portafolio) {
                portfolioBody.innerHTML = data.Portafolio.map(p => {
                    const statusClass = p.Estado === 'NUEVA COMPRA' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                                      p.Estado === 'CERRAR' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                                      'bg-slate-800 text-slate-400 border border-white/5';
                    return `
                        <tr>
                            <td class="p-5 font-bold text-blue-400 mono">${p.Simbolo}</td>
                            <td class="p-5 text-slate-300">${p.Nombre}</td>
                            <td class="p-5 text-right font-bold text-slate-200 mono">${p.Peso}</td>
                            <td class="p-5 text-center">
                                <span class="px-3 py-1 rounded-full text-[10px] uppercase font-bold ${statusClass}">
                                    ${p.Estado}
                                </span>
                            </td>
                            <td class="p-5 text-right font-mono text-slate-500 pr-10">${p.MGC || '-'}</td>
                        </tr>
                    `;
                }).join('');
            }

            // 4. Rendimiento y MaxDD (CAMBIO SOLICITADO)
            const res = data.Historico?.resumen;
            if (res) {
                // Retornos Acumulados
                const sReturn = document.getElementById('strat-return');
                const bReturn = document.getElementById('bench-return');
                if (sReturn) sReturn.textContent = res.Strategy || res.Estrategia || "--%";
                if (bReturn) bReturn.textContent = res.Benchmark || "--%";

                // Max Drawdowns (Nuevos campos)
                const sMaxDD = document.getElementById('strat-maxdd');
                const bMaxDD = document.getElementById('bench-maxdd');
                
                // MaxDD Estrategia
                if (sMaxDD) {
                    const val = res.MaxDD_Strat || res.MaxDD_Strategy || "--%";
                    sMaxDD.textContent = val;
                }
                
                // MaxDD Benchmark
                if (bMaxDD) {
                    const val = res.MaxDD_Bench || res.MaxDD_Benchmark || "--%";
                    bMaxDD.textContent = val;
                }
            }

            // 5. Tabla Histórica Anual
            const annualBody = document.getElementById('tabla-historico');
            if (annualBody && data.Historico?.tabla_anual) {
                annualBody.innerHTML = data.Historico.tabla_anual.map(row => {
                    const ret = row.Retorno || '';
                    const isPos = ret && !ret.includes('-');
                    return `
                        <tr class="hover:bg-white/5 transition-colors">
                            <td class="p-4 text-slate-400 font-medium">${row.Año}</td>
                            <td class="p-4 font-bold ${isPos ? 'text-emerald-400' : 'text-red-400'}">${ret}</td>
                            <td class="p-4 text-red-400/80 mono">${row.MaxPerdida || row.MaxDD || '-'}</td>
                        </tr>
                    `;
                }).join('');
            }
        })
        .catch(err => console.error("❌ Error cargando JSON:", err));
});