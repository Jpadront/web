// Efectos de interfaz comunes a todas las páginas. Todo es mejora progresiva: sin
// JavaScript la página se ve completa, y con «reducir movimiento» no se anima nada.
const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;

// 1. Aparición al hacer scroll: los elementos con [data-revelar] entran con un leve
//    desplazamiento. data-revelar="grupo" anima sus hijos uno detrás de otro.
function revelar() {
  const elementos = document.querySelectorAll<HTMLElement>('[data-revelar]');
  if (quieto || !('IntersectionObserver' in window)) {
    elementos.forEach((e) => e.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue;
        const el = e.target as HTMLElement;
        if (el.dataset.revelar === 'grupo') {
          [...el.children].forEach((h, i) => ((h as HTMLElement).style.transitionDelay = `${Math.min(i, 8) * 70}ms`));
        }
        el.classList.add('visible');
        io.unobserve(el);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  elementos.forEach((e) => io.observe(e));
}

// 2. Cifras que cuentan desde 0 hasta su valor la primera vez que se ven: [data-contar]
function contar() {
  const cifras = document.querySelectorAll<HTMLElement>('[data-contar]');
  if (quieto) return;
  const io = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      if (!e.isIntersecting) continue;
      const el = e.target as HTMLElement;
      io.unobserve(el);
      const final = Number(el.dataset.contar);
      const cifras2 = el.textContent?.trim().length ?? 2;
      const inicio = performance.now();
      const dur = 1100;
      const tick = (ahora: number) => {
        const p = Math.min(1, (ahora - inicio) / dur);
        const v = Math.round(final * (1 - Math.pow(1 - p, 3))); // desaceleración suave
        el.textContent = String(v).padStart(cifras2, '0');
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  });
  cifras.forEach((c) => io.observe(c));
}

// 3. Foco de luz que sigue al cursor dentro de las tarjetas: [data-foco]
//    Solo guarda la posición en variables CSS; el dibujo lo hace el CSS.
function foco() {
  if (!matchMedia('(hover: hover)').matches) return;
  for (const el of document.querySelectorAll<HTMLElement>('[data-foco]')) {
    el.addEventListener('pointermove', (ev) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${ev.clientX - r.left}px`);
      el.style.setProperty('--my', `${ev.clientY - r.top}px`);
    });
  }
}

// 4. Texto que se escribe solo: [data-escribir='["uno","dos"]']
function escribir() {
  for (const el of document.querySelectorAll<HTMLElement>('[data-escribir]')) {
    let palabras: string[] = [];
    try {
      palabras = JSON.parse(el.dataset.escribir ?? '[]');
    } catch {
      continue;
    }
    if (quieto || palabras.length < 2) continue;
    let i = 0;
    let n = palabras[0].length;
    let borrando = true;
    const tick = () => {
      const p = palabras[i];
      if (borrando) {
        n--;
        if (n <= 0) {
          borrando = false;
          i = (i + 1) % palabras.length;
        }
      } else {
        n++;
        if (n >= palabras[i].length) {
          borrando = true;
          el.textContent = palabras[i];
          return setTimeout(tick, 2200);
        }
      }
      el.textContent = (borrando ? p : palabras[i]).slice(0, Math.max(0, n));
      setTimeout(tick, borrando ? 32 : 58);
    };
    setTimeout(tick, 2600);
  }
}

revelar();
contar();
foco();
escribir();
