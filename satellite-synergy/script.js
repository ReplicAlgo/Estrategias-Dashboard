/**
 * Script Dashboard - Versión con Limpieza de Datos
 * Soluciona el error de valores 'NaN' provenientes de Python/RealTest
 */
document.addEventListener('DOMContentLoaded', () => {
    const cacheBuster = new Date().getTime();
    const jsonUrl = `data_web.json?v=${cacheBuster}`;

    console.log(`Iniciando carga de: ${jsonUrl}`);

    async function loadAndFixData() {
        try {
            const response = await fetch(jsonUrl);
            if (!response.ok) throw new Error("Archivo no encontrado en el servidor");

            let rawText = await response.text();
            
            // LIMPIEZA CRÍTICA: 
            // El JSON estándar no permite NaN. Lo reemplazamos por null para que no rompa el script.
            const cleanText = rawText.replace(/:\s?NaN/g, ': null');
            
            const data = JSON.parse(cleanText);
            console.log("JSON procesado y limpiado con éxito");
            renderDashboard(data);
            
        } catch (error) {
            console.error("Error cargando datos:", error);
            const container = document.getElementById('nav-title');
            if (container) {
                container.innerHTML = `<span class="text-red-500 font-bold">Error de Formato en data_web.json</span>`;
            }
        }
    }

    function renderDashboard(data) {
        // Títulos y Meta
        document.title = `ReplicAlgo | ${data.StrategyName || 'Estrategia'}`;
        const navTitle = document.getElementById('nav-title');
        if (navTitle) navTitle.textContent = data.StrategyName || "Sin Nombre";
        
        const fechaEl = document.getElementById('fecha-update');
        if (fechaEl) fechaEl.textContent = data.Fecha || "---";

        // Actualizar Mes en encabezados
        const mesActual = data.MesActual || "";
        ['mes-ordenes', 'mes-portafolio'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = mesActual ? `(${mesActual})` : "";
        });

        // Renderizar Órdenes
        const ordenesBody = document.getElementById('tabla-ordenes');
        if (ordenesBody) {
            const ordenes = data.Ordenes || [];
            ordenesBody.innerHTML = ordenes.length > 0 ? ordenes.map(o => `
                <tr class="hover:bg-white/5 border-b border-white/5">
                    <td class="p-5">
                        <span class="${o.Accion === 'COMPRAR' ? 'text-emerald-400' : 'text-red-400'} font-bold text-xs">
                            ${o.Accion}
                        </span>
                    </td>
                    <td class="p-5 font-bold mono text-blue-400">${o.Simbolo}</td>
                    <td class="p-5">
                        <div class="text-slate-200 font-medium">${o.Nombre}</div>
                        <div class="text-[10px] text-slate-500 uppercase">${(o.MGC && o.MGC !== 'NaN') ? 'MGC: ' + o.MGC : ''}</div>
                    </td>
                    <td class="p-5 text-slate-400 text-xs italic">${o.Instruccion}</td>
                    <td class="p-5 text-right font-bold mono text-white">${o.Cantidad}</td>
                </tr>
            `).join('') : '<tr><td colspan="5" class="p-10 text-center text-slate-500 italic">No hay órdenes pendientes</td></tr>';
        }

        // Renderizar Portafolio
        const portafolioBody = document.getElementById('tabla-portafolio');
        if (portafolioBody) {
            const portafolio = data.Portafolio || [];
            portafolioBody.innerHTML = portafolio.map(p => `
                <tr class="hover:bg-white/5 border-b border-white/5">
                    <td class="p-5 font-bold mono text-blue-400">${p.Simbolo}</td>
                    <td class="p-5 text-slate-300">${p.Nombre}</td>
                    <td class="p-5 text-right font-bold mono text-white">${p.Peso}</td>
                    <td class="p-5 text-center">
                        <span class="px-3 py-1 rounded-full text-[10px] font-bold ${getEstadoClass(p.Estado)}">
                            ${p.Estado}
                        </span>
                    </td>
                </tr>
            `).join('');
        }

        // Performance Metrics
        const res = data.Historico?.resumen || {};
        const updateVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val || "--%";
        };
        updateVal('strat-return', res.Strategy);
        updateVal('bench-return', res.Benchmark);
        updateVal('strat-maxdd', res.MaxDD_Strat);
        updateVal('bench-maxdd', res.MaxDD_Bench);

        // Tabla Anual
        const annualBody = document.getElementById('tabla-historico');
        if (annualBody) {
            const historico = data.Historico?.tabla_anual || [];
            annualBody.innerHTML = historico.map(h => `
                <tr class="border-b border-white/5">
                    <td class="p-4 text-slate-400">${h.Año}</td>
                    <td class="p-4 font-bold ${!h.Retorno.includes('-') ? 'text-emerald-400' : 'text-red-400'}">${h.Retorno}</td>
                    <td class="p-4 text-red-400/70 mono">${h.MaxPerdida}</td>
                </tr>
            `).join('');
        }
    }

    function getEstadoClass(estado) {
        if (!estado) return '';
        const e = estado.toUpperCase();
        if (e.includes('COMPRA')) return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
        if (e.includes('AUMENTAR')) return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
        if (e.includes('CERRAR') || e.includes('VENDER')) return 'bg-red-500/20 text-red-400 border border-red-500/30';
        return 'bg-slate-800 text-slate-400 border border-white/10';
    }

    loadAndFixData();
});