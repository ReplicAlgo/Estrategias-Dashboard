/**
 * Script para el Dashboard de Estrategias Individuales
 * Versión Coordinada - Maneja variaciones de nombres en el JSON
 */
document.addEventListener('DOMContentLoaded', () => {
    const timestamp = new Date().getTime();
    const dataUrl = `data_web.json?t=${timestamp}`;

    console.log("Intentando cargar:", dataUrl);

    fetch(dataUrl)
        .then(response => {
            if (!response.ok) throw new Error(`No se encontró el archivo data_web.json (Error ${response.status})`);
            return response.json();
        })
        .then(data => {
            console.log("Data cargada con éxito:", data);

            // 1. Títulos y Header
            const navTitle = document.getElementById('nav-title');
            const strategyName = data.StrategyName || data.Estrategia || "Estrategia";
            if (navTitle) navTitle.innerHTML = `<i class="fa-solid fa-chart-line text-blue-400"></i> ${strategyName}`;
            document.title = `ReplicAlgo | ${strategyName}`;

            // 2. Fecha y Mes
            const fechaEl = document.getElementById('fecha-update');
            const mesActual = data.MesActual || data.Mes || "";
            if (fechaEl) fechaEl.textContent = data.Fecha || mesActual || "Actualizado";
            
            const labelOrdenes = document.getElementById('mes-ordenes');
            const labelPortafolio = document.getElementById('mes-portafolio');
            if (labelOrdenes) labelOrdenes.textContent = mesActual;
            if (labelPortafolio) labelPortafolio.textContent = mesActual;

            // 3. Órdenes Operativas
            const ordenesBody = document.getElementById('tabla-ordenes');
            const listaOrdenes = data.Ordenes || data.OrdenesOperativas || [];
            if (ordenesBody) {
                if (listaOrdenes.length > 0) {
                    ordenesBody.innerHTML = listaOrdenes.map(ord => `
                        <tr class="hover:bg-white/5 transition-colors border-b border-slate-800/50">
                            <td class="p-5"><span class="${ord.Accion === 'COMPRAR' ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}">${ord.Accion}</span></td>
                            <td class="p-5 font-bold mono text-blue-400">${ord.Simbolo || ord.Ticker}</td>
                            <td class="p-5 text-slate-300 font-medium">${ord.Nombre || ord.Activo}</td>
                            <td class="p-5 text-slate-400 text-xs italic">${ord.Instruccion || ''}</td>
                            <td class="p-5 text-right pr-12 font-bold mono text-white">${ord.Cantidad || '-'}</td>
                        </tr>
                    `).join('');
                } else {
                    ordenesBody.innerHTML = `<tr><td colspan="5" class="p-12 text-center text-slate-500 italic">No hay órdenes para este periodo</td></tr>`;
                }
            }

            // 4. Portafolio Actual
            const portafolioBody = document.getElementById('tabla-portafolio');
            // Buscamos en varias posibles llaves del JSON para evitar el "Sin Data"
            const listaPortafolio = data.Portafolio || data.PortafolioActual || data.Portfolio || [];
            if (portafolioBody) {
                if (listaPortafolio.length > 0) {
                    portafolioBody.innerHTML = listaPortafolio.map(p => `
                        <tr class="hover:bg-white/5 transition-colors border-b border-slate-800/50">
                            <td class="p-5 font-bold mono text-blue-400">${p.Simbolo || p.Ticker}</td>
                            <td class="p-5 text-slate-300 font-medium">${p.Nombre || p.Activo}</td>
                            <td class="p-5 text-right font-bold mono text-white">${p.Peso || p.PesoActual || '-'}</td>
                            <td class="p-5 text-center">
                                <span class="px-2 py-1 rounded text-xs font-bold ${p.Estado === 'MANTENER' ? 'bg-slate-800 text-slate-400' : 'bg-emerald-500/20 text-emerald-400'}">
                                    ${p.Estado || 'MANTENER'}
                                </span>
                            </td>
                        </tr>
                    `).join('');
                } else {
                    portafolioBody.innerHTML = `<tr><td colspan="4" class="p-8 text-center text-slate-500">Cargando portafolio...</td></tr>`;
                }
            }

            // 5. Performance (Resumen)
            // Soporta tanto data.Historico.resumen como data.Resumen
            const res = data.Historico?.resumen || data.Resumen;
            if (res) {
                const mapMetric = (id, val) => {
                    const el = document.getElementById(id);
                    if (el) el.textContent = val || "--%";
                };
                mapMetric('strat-return', res.Strategy || res.RetornoEstrategia);
                mapMetric('bench-return', res.Benchmark || res.RetornoBenchmark);
                mapMetric('strat-maxdd', res.MaxDD_Strat || res.MaxDDEstrategia);
                mapMetric('bench-maxdd', res.MaxDD_Bench || res.MaxDDBenchmark);
            }

            // 6. Histórico Anual
            const annualBody = document.getElementById('tabla-historico');
            const tablaAnual = data.Historico?.tabla_anual || data.TablaAnual;
            if (annualBody && tablaAnual) {
                annualBody.innerHTML = tablaAnual.map(row => {
                    const retorno = row.Retorno || row.Rentabilidad || '';
                    const esPositivo = retorno && !retorno.includes('-');
                    return `
                        <tr class="hover:bg-white/5 transition-colors">
                            <td class="p-4 text-slate-400 font-medium">${row.Año || row.Year}</td>
                            <td class="p-4 font-bold ${esPositivo ? 'text-emerald-400' : 'text-red-400'}">${retorno}</td>
                            <td class="p-4 text-red-400/80 mono">${row.MaxPerdida || row.MaxDD || row.Drawdown || '-'}</td>
                        </tr>
                    `;
                }).join('');
            }
        })
        .catch(err => {
            console.error("❌ Error Crítico:", err);
            const navTitle = document.getElementById('nav-title');
            if (navTitle) navTitle.innerHTML = `<span class="text-red-500">Error: No se encontró data_web.json</span>`;
        });
});