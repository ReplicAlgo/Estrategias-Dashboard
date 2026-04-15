/**
 * Script Dashboard - Versión Ultra-Robusta
 * Soluciona problemas de rutas y caché en GitHub Pages
 */
document.addEventListener('DOMContentLoaded', () => {
    // Generamos un parámetro único basado en el tiempo para evitar la caché de GitHub
    const cacheBuster = new Date().getTime();
    
    // Intentamos cargar el archivo con el parámetro anti-caché
    const jsonUrl = `data_web.json?v=${cacheBuster}`;

    console.log(`Solicitando datos a: ${jsonUrl}`);

    function loadData() {
        fetch(jsonUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`No se pudo cargar el JSON (Status: ${response.status})`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Datos cargados con éxito:", data);
                renderDashboard(data);
            })
            .catch(error => {
                console.error("Error crítico:", error);
                // Si falla, mostramos un mensaje visual en el dashboard
                const container = document.getElementById('nav-title');
                if (container) {
                    container.innerHTML = `<span class="text-red-500 font-bold">Error: Verifica data_web.json</span>`;
                }
            });
    }

    function renderDashboard(data) {
        // 1. Actualizar Títulos
        const strategyName = data.StrategyName || "Estrategia";
        document.title = `ReplicAlgo | ${strategyName}`;
        const navTitle = document.getElementById('nav-title');
        if (navTitle) navTitle.textContent = strategyName;

        const fechaEl = document.getElementById('fecha-update');
        if (fechaEl) fechaEl.textContent = data.Fecha || "Actualizado";

        const mesActual = data.MesActual || "";
        ['mes-ordenes', 'mes-portafolio'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = mesActual ? `(${mesActual})` : "";
        });

        // 2. Tabla de Órdenes (Según lógica de RealTest_Automation.py)
        const ordenesBody = document.getElementById('tabla-ordenes');
        if (ordenesBody) {
            const ordenes = data.Ordenes || [];
            if (ordenes.length > 0) {
                ordenesBody.innerHTML = ordenes.map(o => `
                    <tr class="hover:bg-white/5 border-b border-white/5 transition-colors">
                        <td class="p-5">
                            <span class="${o.Accion === 'COMPRAR' ? 'text-emerald-400' : 'text-red-400'} font-bold text-xs uppercase">
                                ${o.Accion}
                            </span>
                        </td>
                        <td class="p-5 font-bold mono text-blue-400">${o.Simbolo}</td>
                        <td class="p-5">
                            <div class="text-slate-200 font-medium">${o.Nombre}</div>
                            <div class="text-[10px] text-slate-500 uppercase">${o.MGC !== '-' ? 'MGC: ' + o.MGC : ''}</div>
                        </td>
                        <td class="p-5 text-slate-400 text-xs italic">${o.Instruccion}</td>
                        <td class="p-5 text-right font-bold mono text-white">${o.Cantidad}</td>
                    </tr>
                `).join('');
            } else {
                ordenesBody.innerHTML = `<tr><td colspan="5" class="p-10 text-center text-slate-500 italic">No hay órdenes para este periodo</td></tr>`;
            }
        }

        // 3. Portafolio Actual
        const portafolioBody = document.getElementById('tabla-portafolio');
        if (portafolioBody) {
            const portafolio = data.Portafolio || [];
            portafolioBody.innerHTML = portafolio.map(p => `
                <tr class="hover:bg-white/5 border-b border-white/5 transition-colors">
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

        // 4. Performance Metrics
        const res = data.Historico?.resumen || {};
        const updateVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val || "--%";
        };
        updateVal('strat-return', res.Strategy);
        updateVal('bench-return', res.Benchmark);
        updateVal('strat-maxdd', res.MaxDD_Strat);
        updateVal('bench-maxdd', res.MaxDD_Bench);

        // 5. Tabla Anual
        const annualBody = document.getElementById('tabla-historico');
        const historico = data.Historico?.tabla_anual || [];
        if (annualBody) {
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
        switch(estado) {
            case 'NUEVA COMPRA': return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
            case 'AUMENTAR': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
            case 'REDUCIR': return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
            case 'CERRAR': return 'bg-red-500/20 text-red-400 border border-red-500/30';
            default: return 'bg-slate-800 text-slate-500 border border-white/5';
        }
    }

    loadData();
});