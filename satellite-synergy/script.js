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
                navTitle.textContent = data.StrategyName;
            }
            document.title = `ReplicAlgo | ${data.StrategyName || "Dashboard"}`;

            // 2. Fecha en la barra superior
            const fechaEl = document.getElementById('fecha-update');
            if (fechaEl) {
                fechaEl.textContent = data.Fecha || data.MesActual || "Actualizado";
            }

            // 3. Mes en los títulos de secciones
            const mesActual = data.MesActual || "";
            const tituloOrdenes = document.getElementById('mes-ordenes');
            const tituloPortafolio = document.getElementById('mes-portafolio');

            if (tituloOrdenes) tituloOrdenes.textContent = mesActual ? `/ ${mesActual}` : '';
            if (tituloPortafolio) tituloPortafolio.textContent = mesActual ? `/ ${mesActual}` : '';

            // 4. Tabla de Órdenes (Cantidad alineada a la derecha)
            const ordersBody = document.getElementById('tabla-ordenes');
            if (ordersBody && data.Ordenes) {
                ordersBody.innerHTML = data.Ordenes.map(order => {
                    const claccion = order.Accion === 'COMPRAR' ? 'accion-comprar' : 'accion-vender';
                    return `
                        <tr class="hover:bg-white/5 transition-colors">
                            <td class="p-5 ${claccion}">${order.Accion}</td>
                            <td class="p-5 mono text-blue-400 font-medium">${order.Ticker}</td>
                            <td class="p-5 text-slate-300">${order.Nombre}</td>
                            <td class="p-5 text-slate-400 italic">${order.Instruccion}</td>
                            <td class="p-5 text-right pr-12 mono text-slate-300">${order.Cantidad || order.MGC || '-'}</td>
                        </tr>
                    `;
                }).join('');
            }

            // 5. Tabla de Portafolio (Se eliminó la columna MGC para coincidir con el HTML)
            const portfolioBody = document.getElementById('tabla-portafolio');
            if (portfolioBody && data.Portafolio) {
                portfolioBody.innerHTML = data.Portafolio.map(item => {
                    const clEstado = item.Estado === 'NUEVA COMPRA' ? 'estado-nueva-compra' : 'estado-mantenido';
                    return `
                        <tr class="hover:bg-white/5 transition-colors">
                            <td class="p-5 mono text-blue-400 font-bold">${item.Ticker}</td>
                            <td class="p-5 text-slate-300">${item.Nombre}</td>
                            <td class="p-5 text-right mono font-bold text-white">${item.Peso}</td>
                            <td class="p-5 text-center"><span class="${clEstado}">${item.Estado}</span></td>
                        </tr>
                    `;
                }).join('');
            }

            // 6. Resumen de Performance
            if (data.Historico?.resumen) {
                const stratRet = document.getElementById('strat-return');
                const benchRet = document.getElementById('bench-return');
                if (stratRet) stratRet.textContent = data.Historico.resumen.Estrategia;
                if (benchRet) benchRet.textContent = data.Historico.resumen.Benchmark;
            }

            // 7. Tabla Histórico Anual
            const annualBody = document.getElementById('tabla-historico');
            if (annualBody && data.Historico?.tabla_anual) {
                annualBody.innerHTML = data.Historico.tabla_anual.map(row => {
                    const retorno = row.Retorno || '';
                    const esPositivo = retorno && !retorno.includes('-');
                    return `
                        <tr>
                            <td class="p-4 text-slate-400">${row.Año}</td>
                            <td class="p-4 font-bold ${esPositivo ? 'text-emerald-400' : 'text-red-400'}">${retorno}</td>
                            <td class="p-4 text-red-400/70">${row.MaxPerdida}</td>
                        </tr>
                    `;
                }).join('');
            }

            console.log("🎉 Dashboard actualizado con éxito");
        })
        .catch(err => {
            console.error("❌ Error:", err);
        });
});