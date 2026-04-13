async function cargarDashboard() {
    try {
        const res = await fetch('data_web.json');
        const data = await res.json();

        // --- LÓGICA PARA EL NOMBRE DEL MES ---
        const meses = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
        
        // Extraemos el mes del string de fecha (ej: "20251103")
        // Tomamos los dígitos en las posiciones 4 y 5
        const mesString = data.Fecha.substring(4, 6); 
        const mesIndex = parseInt(mesString) - 1;
        const nombreMes = meses[mesIndex];

        // --- ACTUALIZACIÓN DE TÍTULOS ---
        document.getElementById('fecha-update').innerText = `CORTE: ${data.Fecha}`;
        document.getElementById('titulo-ordenes').innerText = `ÓRDENES DEL MES ${nombreMes}`;
        document.getElementById('titulo-portafolio').innerText = `PORTAFOLIO ACTUAL (${nombreMes})`;

        // 1. Llenar Órdenes
        const tOrdenes = document.getElementById('tabla-ordenes');
        tOrdenes.innerHTML = data.Ordenes.map(o => `
            <tr class="hover:bg-slate-700/30">
                <td class="p-4 font-bold ${o.Accion === 'COMPRAR' ? 'text-emerald-400' : 'text-rose-400'}">${o.Accion}</td>
                <td class="p-4 font-mono text-blue-300">${o.Simbolo}</td>
                <td class="p-4 text-slate-400">${o.Nombre}</td>
                <td class="p-4 text-xs italic">${o.Instruccion}</td>
                <td class="p-4 text-slate-500">${o.InfoMGC}</td>
            </tr>`).join('');

        // 2. Llenar Portafolio
        const tPort = document.getElementById('tabla-portafolio');
        tPort.innerHTML = data.Portafolio.map(p => `
            <tr class="hover:bg-slate-700/30">
                <td class="p-4 font-bold text-blue-300">${p.Simbolo}</td>
                <td class="p-4 text-slate-400">${p.Nombre}</td>
                <td class="p-4 text-right font-mono text-blue-400">${p.Porcentaje}</td>
                <td class="p-4 text-center"><span class="px-2 py-1 rounded text-[10px] font-bold ${p.Estado === 'NUEVA COMPRA' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-slate-700 text-slate-300'}">${p.Estado}</span></td>
                <td class="p-4 text-center text-slate-500 text-xs">${p.InfoMGC}</td>
            </tr>`).join('');

        // 3. Resumen de Rendimiento (Smart-DCA Primero)
        const cajaRet = document.getElementById('caja-retorno');
        cajaRet.innerHTML = `
            <div class="bg-slate-800 p-6 rounded-xl border border-blue-500/50 text-center shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <p class="text-blue-400 text-xs uppercase mb-2 font-bold tracking-widest">Smart-DCA System</p>
                <p class="text-4xl font-bold text-blue-100">${data.Historico.resumen["Smart-DCA"]}</p>
            </div>
            <div class="bg-slate-800 p-6 rounded-xl border border-slate-700 text-center">
                <p class="text-slate-400 text-xs uppercase mb-2">Benchmark 60/40</p>
                <p class="text-3xl font-bold text-slate-400">${data.Historico.resumen["Benchmark 60/40"]}</p>
            </div>
        `;

        // 4. Historial Anual
        const tHist = document.getElementById('tabla-historico');
        tHist.innerHTML = data.Historico.tabla_anual.map(h => `
            <tr class="hover:bg-slate-700/30">
                <td class="p-4 text-slate-300">${h.Año}</td>
                <td class="p-4 ${parseFloat(h.Retorno) >= 0 ? 'text-emerald-400' : 'text-rose-400'}">${h.Retorno}</td>
                <td class="p-4 text-rose-500/70">${h.MaxPerdida}</td>
            </tr>`).join('');

    } catch (e) { console.error("Error cargando el dashboard:", e); }
}
cargarDashboard();