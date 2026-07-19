/**
 * Script para el Dashboard de Estrategias Individuales
 * Maneja la carga de datos con limpieza de errores 'NaN' e inyecta el contenido original.
 * Versión final con soporte dinámico para Órdenes Stop.
 */
document.addEventListener('DOMContentLoaded', () => {
    const timestamp = new Date().getTime();
    const jsonUrl = `data_web.json?t=${timestamp}`;

    async function loadAndFixData() {
        try {
            const response = await fetch(jsonUrl);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            // Limpieza preventiva de valores NaN en el JSON
            let rawText = await response.text();
            const cleanText = rawText.replace(/:\s?NaN/g, ': null');
            const data = JSON.parse(cleanText);

            // 1. Navbar Title
            const navTitle = document.getElementById('nav-title');
            if (navTitle) navTitle.innerHTML = `<i class="fa-solid fa-chart-line text-blue-400"></i> ${data.StrategyName}`;
            document.title = `ReplicAlgo | ${data.StrategyName}`;

            // 2. Fecha Update
            const fechaEl = document.getElementById('fecha-update');
            if (fechaEl) fechaEl.textContent = data.Fecha || data.MesActual || "Actualizado";

            // 3. Mes Labels
            const mesActual = data.MesActual || "";
            if (document.getElementById('mes-ordenes')) document.getElementById('mes-ordenes').textContent = mesActual;
            if (document.getElementById('mes-portafolio')) document.getElementById('mes-portafolio').textContent = mesActual;
            
            // Actualizar etiquetas del mes para la nueva tabla de Stops
            const idMesActualEls = document.querySelectorAll('.id-mes-actual');
            idMesActualEls.forEach(el => el.textContent = mesActual);

            // 4. Órdenes del Mes (Diseño Original con Check Mark)
            const ordenesBody = document.getElementById('tabla-ordenes');
            if (ordenesBody) {
                if (data.Ordenes && data.Ordenes.length > 0) {
                    ordenesBody.innerHTML = data.Ordenes.map(ord => `
                        <tr class="hover:bg-white/5 transition-colors">
                            <td class="p-5"><span class="${ord.Accion === 'COMPRAR' ? 'accion-comprar' : 'accion-vender'}">${ord.Accion}</span></td>
                            <td class="p-5 font-bold mono text-blue-400">${ord.Simbolo}</td>
                            <td class="p-5 text-slate-300 font-medium">${ord.Nombre}</td>
                            <td class="p-5 text-slate-400 text-xs italic">${ord.Instruccion}</td>
                            <td class="p-5 text-right pr-12 font-bold mono text-white">${ord.Cantidad}</td>
                        </tr>
                    `).join('');
                } else {
                    ordenesBody.innerHTML = `
                        <tr>
                            <td colspan="5" class="p-12 text-center">
                                <div class="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    <i class="fa-solid fa-circle-check mr-2"></i>
                                    <span class="text-sm font-medium uppercase tracking-wider">No se requieren cambios para este periodo</span>
                                </div>
                            </td>
                        </tr>
                    `;
                }
            }

            // ==========================================
            // NUEVA SECCIÓN: Renderizado de Órdenes Stop
            // ==========================================
            const stopOrdersBody = document.getElementById('stop-orders-table-body');
            if (stopOrdersBody) {
                if (data.Stops && data.Stops.length > 0) {
                    stopOrdersBody.innerHTML = data.Stops.map(stop => `
                        <tr class="hover:bg-white/5 transition-colors">
                            <td class="py-4 px-6 font-bold text-amber-500 tracking-wide">${stop.Accion || 'STOP'}</td>
                            <td class="py-4 px-6 font-bold mono text-blue-400">${stop.Simbolo}</td>
                            <td class="py-4 px-6 text-slate-300 font-medium">${stop.Nombre}</td>
                            <td class="py-4 px-6 text-slate-200 font-semibold">$${stop.PrecioStop || stop.NivelStop}</td>
                            <td class="py-4 px-6 text-slate-400 text-xs italic">${stop.Instruccion}</td>
                            <td class="py-4 px-6 text-right font-bold text-white pr-6">${stop.Cantidad || '100% de la Posición'}</td>
                        </tr>
                    `).join('');
                } else {
                    // Mantener o reinyectar la fila fija "No Aplica" si no hay alertas de stop
                    stopOrdersBody.innerHTML = `
                        <tr id="stop-empty-row">
                            <td colspan="6" class="py-8 text-center text-slate-500 italic font-medium tracking-wide">
                                No Aplica
                            </td>
                        </tr>
                    `;
                }
            }

            // 5. Portafolio Actual
            const portafolioBody = document.getElementById('tabla-portafolio');
            if (portafolioBody && data.Portafolio) {
                portafolioBody.innerHTML = data.Portafolio.map(p => `
                    <tr class="hover:bg-white/5 transition-colors">
                        <td class="p-5 font-bold mono text-blue-400">${p.Simbolo}</td>
                        <td class="p-5 text-slate-300 font-medium">${p.Nombre}</td>
                        <td class="p-5 text-right font-bold mono text-white">${p.Peso}</td>
                        <td class="p-5 text-center"><span class="${p.Estado === 'MANTENER' ? 'estado-mantenido' : 'estado-nueva-compra'}">${p.Estado}</span></td>
                    </tr>
                `).join('');
            }

            // 6. Resumen Performance
            const res = data.Historico?.resumen;
            if (res) {
                if (document.getElementById('strat-return')) document.getElementById('strat-return').textContent = res.Strategy || "--%";
                if (document.getElementById('bench-return')) document.getElementById('bench-return').textContent = res.Benchmark || "--%";
                if (document.getElementById('strat-maxdd')) document.getElementById('strat-maxdd').textContent = res.MaxDD_Strat || "--%";
                if (document.getElementById('bench-maxdd')) document.getElementById('bench-maxdd').textContent = res.MaxDD_Bench || "--%";
            }

            // 7. Tabla Histórico Anual
            const annualBody = document.getElementById('tabla-historico');
            if (annualBody && data.Historico?.tabla_anual) {
                annualBody.innerHTML = data.Historico.tabla_anual.map(row => {
                    const retorno = row.Retorno || '';
                    const esPositivo = retorno && !retorno.includes('-');
                    return `
                        <tr class="hover:bg-white/5 transition-colors">
                            <td class="p-4 text-slate-400 font-medium">${row.Año}</td>
                            <td class="p-4 font-bold ${esPositivo ? 'text-emerald-400' : 'text-red-400'}">${retorno}</td>
                            <td class="p-4 text-red-400/80 mono">${row.MaxPerdida || row.MaxDD || '-'}</td>
                        </tr>
                    `;
                }).join('');
            }
        } catch (err) {
            console.error("❌ Error en la carga de datos:", err);
        }
    }

    loadAndFixData();
});
