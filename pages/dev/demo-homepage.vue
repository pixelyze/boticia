<template>
  <div class="dr">

    <!-- Cursor -->
    <div class="cursor" ref="cursorEl" />
    <div class="cursor-dot" ref="dotEl" />

    <!-- Nav -->
    <nav class="nav" ref="navEl">
      <div class="nav-logo">BOTICIA</div>
      <div class="nav-links">
        <a href="#">Mariages</a>
        <a href="#">Événements</a>
        <a href="#">Ateliers</a>
        <a href="#" class="nav-cta">Demande de devis</a>
      </div>
    </nav>

    <!-- Hero -->
    <section class="hero">
      <div class="hero-img">
        <img src="/images/events/scenographie-florale-boticia.jpg" alt="" />
        <div class="hero-veil" />
      </div>
      <div class="hero-content">
        <span class="hero-tag">Atelier de design floral · Provence & Paris</span>
        <h1 class="hero-title">
          <span class="hl">L'art</span>
          <span class="hl ind">floral</span>
          <span class="hl">qui raconte</span>
          <em class="hl ind gold">votre histoire</em>
        </h1>
      </div>
      <div class="hero-scroll-hint">
        <span>Découvrir</span>
        <div class="scroll-line" />
      </div>
    </section>

    <!-- Marquee -->
    <div class="marquee-wrap">
      <div class="marquee-track">
        <template v-for="_ in 3" :key="_">
          <span>Mariages</span><em>✦</em>
          <span>Événements corporatifs</span><em>✦</em>
          <span>Set design</span><em>✦</em>
          <span>Scénographie florale</span><em>✦</em>
          <span>Ateliers créatifs</span><em>✦</em>
        </template>
      </div>
    </div>

    <!-- Manifeste -->
    <section class="manifeste reveal">
      <div class="manifeste-inner">
        <div class="manifeste-left">
          <span class="qmark">"</span>
          <p class="quote">Chaque fleur est une intention. Chaque composition, une émotion. Nous créons des instants qui durent.</p>
        </div>
        <div class="manifeste-right">
          <span class="label">Notre approche</span>
          <p>Boticia est un atelier de design floral basé en Provence, qui donne vie à vos moments les plus précieux — mariages, événements d'entreprise, shootings photo. Chaque création est unique, pensée pour vous.</p>
          <a href="#" class="link-arr">Découvrir notre univers <span>→</span></a>
        </div>
      </div>
    </section>

    <!-- Gallery -->
    <section class="gallery reveal">
      <div class="gallery-grid">
        <div class="gi gi-large">
          <img src="/images/events/decoration_florale_mariage_sophiethomas_boticia_29.jpg" alt="" />
          <div class="gi-cap">Mariage · Sophie & Thomas</div>
        </div>
        <div class="gallery-col">
          <div class="gi gi-tall">
            <img src="/images/events/composition_florale_table_mariage_boticia.jpg" alt="" />
            <div class="gi-cap">Décor de table</div>
          </div>
          <div class="gi gi-sm">
            <img src="/images/events/atelier_composition_florale_team_building_boticia_3.jpg" alt="" />
            <div class="gi-cap">Atelier floral</div>
          </div>
        </div>
      </div>
      <div class="gallery-cta">
        <a href="#" class="btn-outline">Voir toutes les créations</a>
      </div>
    </section>

    <!-- Services -->
    <section class="services reveal">
      <div class="services-head">
        <span class="label">Ce que nous créons</span>
        <h2>Des expériences<br/>florales sur mesure</h2>
      </div>
      <div class="services-grid">
        <div class="svc" v-for="s in services" :key="s.num">
          <div class="svc-num">{{ s.num }}</div>
          <h3>{{ s.title }}</h3>
          <p>{{ s.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Testimonial -->
    <section class="testi reveal">
      <div class="testi-inner">
        <div class="stars">★ ★ ★ ★ ★</div>
        <blockquote>« Boticia a transformé notre mariage en quelque chose d'absolument magique. Les compositions florales étaient d'une beauté à couper le souffle. »</blockquote>
        <cite>— Camille & Julien · Mariage en Provence</cite>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-sec reveal">
      <div class="cta-bg-text">BOTICIA</div>
      <div class="cta-inner">
        <span class="label light">Votre projet</span>
        <h2>Commençons<br/>ensemble</h2>
        <p>Partagez-nous votre vision, nous lui donnerons vie.</p>
        <a href="#" class="btn-primary">Faire une demande de devis</a>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-top">
        <div>
          <div class="footer-logo">BOTICIA</div>
          <p class="footer-sub">Atelier de design floral<br/>Provence · Paris</p>
        </div>
        <nav class="footer-nav">
          <a href="#">Mariages</a>
          <a href="#">Événements</a>
          <a href="#">Ateliers</a>
          <a href="#">À propos</a>
          <a href="#">Contact</a>
        </nav>
      </div>
      <div class="footer-bottom">
        <span>© 2026 Boticia</span>
        <span>Mentions légales</span>
      </div>
    </footer>

  </div>
</template>

<script setup>
definePageMeta({ layout: false, ssr: false });

useHead({
  link: [
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap",
    },
  ],
});

const services = [
  { num: "01", title: "Mariages", desc: "De la cérémonie à la réception, chaque détail floral est pensé pour sublimer votre journée unique." },
  { num: "02", title: "Événements", desc: "Lancements de marque, soirées corporate, dîners de gala — des scénographies mémorables." },
  { num: "03", title: "Set Design", desc: "Shootings photo, vitrines, espaces éphémères — la fleur comme matière créative." },
  { num: "04", title: "Ateliers", desc: "Apprenez l'art floral en petit groupe, en Provence ou à Paris." },
];

const cursorEl = ref(null);
const dotEl = ref(null);
const navEl = ref(null);

onMounted(() => {
  // Scroll reveals
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("revealed")),
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // Nav on scroll
  window.addEventListener("scroll", () => {
    navEl.value?.classList.toggle("scrolled", window.scrollY > 80);
  });

  // Custom cursor
  let mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    if (dotEl.value) dotEl.value.style.transform = `translate(${mx}px,${my}px)`;
  });
  const tick = () => {
    cx += (mx - cx) * 0.1; cy += (my - cy) * 0.1;
    if (cursorEl.value) cursorEl.value.style.transform = `translate(${cx}px,${cy}px)`;
    requestAnimationFrame(tick);
  };
  tick();

  document.querySelectorAll("a,button").forEach((el) => {
    el.addEventListener("mouseenter", () => cursorEl.value?.classList.add("hov"));
    el.addEventListener("mouseleave", () => cursorEl.value?.classList.remove("hov"));
  });
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

.dr {
  --ink:      #100f0a;
  --ink2:     #1a1810;
  --cream:    #F5F0E8;
  --cream2:   #EDE6D4;
  --gold:     #C8A96E;
  --sage:     #3b5040;
  --r: 'Cormorant Garamond', Georgia, serif;
  --s: 'Jost', sans-serif;

  background: var(--ink);
  color: var(--cream);
  font-family: var(--s);
  font-weight: 300;
  cursor: none;
  overflow-x: hidden;
}

/* ── Cursor ── */
.cursor {
  position: fixed; top: -20px; left: -20px;
  width: 38px; height: 38px;
  border: 1px solid rgba(200,169,110,.6);
  border-radius: 50%;
  pointer-events: none; z-index: 9999;
  transition: width .35s, height .35s, border-color .35s;
  will-change: transform;
}
.cursor.hov { width: 56px; height: 56px; border-color: var(--cream); }
.cursor-dot {
  position: fixed; top: -3px; left: -3px;
  width: 6px; height: 6px;
  background: var(--gold); border-radius: 50%;
  pointer-events: none; z-index: 9999;
  will-change: transform;
}

/* ── Nav ── */
.nav {
  position: fixed; inset: 0 0 auto;
  display: flex; align-items: center; justify-content: space-between;
  padding: 2rem 3.5rem;
  z-index: 200;
  transition: padding .4s, background .4s, border-color .4s;
}
.nav.scrolled {
  background: rgba(16,15,10,.92);
  backdrop-filter: blur(14px);
  padding: 1.1rem 3.5rem;
  border-bottom: 1px solid rgba(200,169,110,.12);
}
.nav-logo {
  font-family: var(--r); font-size: 1.4rem; font-weight: 500;
  letter-spacing: .35em; color: var(--cream);
}
.nav-links { display: flex; align-items: center; gap: 2.5rem; }
.nav-links a {
  color: var(--cream); text-decoration: none;
  font-size: .75rem; letter-spacing: .1em; opacity: .6;
  transition: opacity .3s;
}
.nav-links a:hover { opacity: 1; }
.nav-cta {
  border: 1px solid var(--gold) !important;
  padding: .55rem 1.3rem !important;
  opacity: 1 !important; color: var(--gold) !important;
  transition: background .3s, color .3s !important;
}
.nav-cta:hover { background: var(--gold) !important; color: var(--ink) !important; }

/* ── Hero ── */
.hero {
  position: relative; min-height: 100vh;
  display: flex; align-items: flex-end;
  padding: 0 3.5rem 5rem;
  overflow: hidden;
}
.hero-img {
  position: absolute; inset: 0;
  z-index: 0;
}
.hero-img img {
  width: 100%; height: 100%; object-fit: cover; object-position: center 30%;
  filter: brightness(.55);
}
.hero-veil {
  position: absolute; inset: 0;
  background:
    linear-gradient(to right, rgba(16,15,10,.85) 35%, transparent 75%),
    linear-gradient(to top,   rgba(16,15,10,.7) 0%,  transparent 50%);
}
.hero-content { position: relative; z-index: 1; max-width: 680px; }
.hero-tag {
  display: block;
  font-size: .7rem; letter-spacing: .28em; text-transform: uppercase;
  color: var(--gold); margin-bottom: 2.5rem;
  opacity: 0; animation: fadeIn .8s ease .3s forwards;
}
.hero-title {
  font-family: var(--r);
  font-size: clamp(4rem, 8.5vw, 9rem);
  font-weight: 300; line-height: .9; letter-spacing: -.02em;
}
.hl {
  display: block;
  opacity: 0; transform: translateY(60px);
}
.hl:nth-child(1) { animation: slideUp .9s cubic-bezier(.16,1,.3,1) .4s forwards; }
.hl:nth-child(2) { animation: slideUp .9s cubic-bezier(.16,1,.3,1) .55s forwards; }
.hl:nth-child(3) { animation: slideUp .9s cubic-bezier(.16,1,.3,1) .7s forwards; }
.hl:nth-child(4) { animation: slideUp .9s cubic-bezier(.16,1,.3,1) .85s forwards; }
.hl.ind { padding-left: 1.8em; }
.hl.gold { color: var(--gold); font-style: italic; }
.hero-scroll-hint {
  position: absolute; bottom: 3.5rem; right: 3.5rem;
  display: flex; flex-direction: column; align-items: center; gap: 1rem;
  z-index: 1; opacity: 0; animation: fadeIn 1s ease 1.6s forwards;
}
.hero-scroll-hint span {
  font-size: .6rem; letter-spacing: .22em; text-transform: uppercase;
  writing-mode: vertical-rl; opacity: .45;
}
.scroll-line {
  width: 1px; height: 64px;
  background: linear-gradient(to bottom, var(--gold), transparent);
  animation: pulse-line 2.2s ease-in-out infinite;
}

/* ── Marquee ── */
.marquee-wrap {
  background: var(--gold); overflow: hidden; padding: 1rem 0;
}
.marquee-track {
  display: flex; gap: 2.5rem; align-items: center;
  width: max-content; white-space: nowrap;
  animation: marquee 22s linear infinite;
}
.marquee-track span {
  font-size: .72rem; letter-spacing: .18em; text-transform: uppercase;
  color: var(--ink); font-weight: 500;
}
.marquee-track em {
  color: var(--ink); font-style: normal; font-size: .55rem; opacity: .6;
}

/* ── Manifeste ── */
.manifeste {
  padding: 8rem 3.5rem;
  background: var(--cream); color: var(--ink);
}
.manifeste-inner {
  display: grid; grid-template-columns: 1.1fr 1fr; gap: 6rem;
  max-width: 1160px; margin: 0 auto; align-items: start;
}
.qmark {
  display: block;
  font-family: var(--r); font-size: 7rem; line-height: .4;
  color: var(--gold); margin-bottom: .5rem;
}
.quote {
  font-family: var(--r);
  font-size: clamp(1.4rem, 2.2vw, 2.1rem);
  font-style: italic; font-weight: 300; line-height: 1.55;
}
.label {
  display: block; font-size: .65rem; letter-spacing: .26em;
  text-transform: uppercase; color: var(--gold); margin-bottom: 1.5rem;
}
.label.light { color: rgba(200,169,110,.65); }
.manifeste-right p {
  font-size: .95rem; line-height: 1.85; opacity: .68; margin-bottom: 2rem;
}
.link-arr {
  display: inline-flex; align-items: center; gap: .5rem;
  font-size: .82rem; letter-spacing: .04em;
  color: var(--ink); text-decoration: none;
  border-bottom: 1px solid rgba(0,0,0,.25); padding-bottom: 2px;
  transition: border-color .3s;
}
.link-arr span { display: inline-block; transition: transform .35s; }
.link-arr:hover span { transform: translateX(6px); }

/* ── Gallery ── */
.gallery { padding: 8rem 3.5rem; background: var(--ink); }
.gallery-grid {
  display: grid; grid-template-columns: 1.65fr 1fr; gap: .8rem;
  max-width: 1160px; margin: 0 auto; height: 580px;
}
.gallery-col { display: flex; flex-direction: column; gap: .8rem; }
.gi { position: relative; overflow: hidden; }
.gi img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform .8s cubic-bezier(.25,.46,.45,.94);
}
.gi:hover img { transform: scale(1.05); }
.gi-large { height: 100%; }
.gi-tall { flex: 1.6; }
.gi-sm { flex: 1; }
.gi-cap {
  position: absolute; bottom: 1rem; left: 1rem;
  font-size: .65rem; letter-spacing: .16em; text-transform: uppercase;
  color: var(--cream); opacity: 0; transition: opacity .35s;
  background: rgba(16,15,10,.55); backdrop-filter: blur(6px);
  padding: .35rem .8rem;
}
.gi:hover .gi-cap { opacity: 1; }
.gallery-cta { text-align: center; margin-top: 3.5rem; }
.btn-outline {
  display: inline-block;
  border: 1px solid var(--gold); color: var(--gold);
  text-decoration: none; padding: .9rem 2.5rem;
  font-size: .72rem; letter-spacing: .18em; text-transform: uppercase;
  transition: background .3s, color .3s;
}
.btn-outline:hover { background: var(--gold); color: var(--ink); }

/* ── Services ── */
.services { padding: 8rem 3.5rem; background: var(--cream2); color: var(--ink); }
.services-head { max-width: 1160px; margin: 0 auto 4.5rem; }
.services-head h2 {
  font-family: var(--r);
  font-size: clamp(2.5rem, 5vw, 5rem);
  font-weight: 300; line-height: 1.05; margin-top: .8rem;
}
.services-grid {
  max-width: 1160px; margin: 0 auto;
  display: grid; grid-template-columns: repeat(4,1fr); gap: 3rem;
}
.svc { border-top: 1px solid rgba(0,0,0,.12); padding-top: 1.8rem; }
.svc-num {
  font-family: var(--r); font-size: 2.8rem; font-weight: 300;
  color: var(--gold); line-height: 1; margin-bottom: .8rem;
}
.svc h3 {
  font-family: var(--r); font-size: 1.4rem; font-weight: 400; margin-bottom: .6rem;
}
.svc p { font-size: .85rem; line-height: 1.75; opacity: .6; }

/* ── Testimonial ── */
.testi {
  padding: 9rem 3.5rem;
  background: var(--sage); text-align: center;
}
.testi-inner { max-width: 780px; margin: 0 auto; }
.stars { color: var(--gold); font-size: .9rem; letter-spacing: .35em; margin-bottom: 3rem; }
.testi blockquote {
  font-family: var(--r);
  font-size: clamp(1.4rem, 2.8vw, 2.4rem);
  font-style: italic; font-weight: 300; line-height: 1.65;
  color: var(--cream); margin-bottom: 2rem;
}
.testi cite {
  font-size: .7rem; letter-spacing: .18em; text-transform: uppercase; color: var(--gold);
}

/* ── CTA ── */
.cta-sec {
  padding: 10rem 3.5rem;
  background: var(--ink2); text-align: center;
  position: relative; overflow: hidden;
}
.cta-bg-text {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--r); font-size: clamp(8rem, 20vw, 22rem);
  font-weight: 500; letter-spacing: .05em;
  color: rgba(255,255,255,.022);
  pointer-events: none; user-select: none;
}
.cta-inner { position: relative; z-index: 1; }
.cta-sec h2 {
  font-family: var(--r);
  font-size: clamp(3rem, 8vw, 8rem);
  font-weight: 300; line-height: .95;
  color: var(--cream); margin: 1.2rem 0 2rem;
}
.cta-sec p { font-size: .95rem; opacity: .5; margin-bottom: 3rem; }
.btn-primary {
  display: inline-block;
  background: var(--gold); color: var(--ink);
  text-decoration: none; padding: 1.1rem 3rem;
  font-size: .75rem; font-weight: 500;
  letter-spacing: .16em; text-transform: uppercase;
  transition: background .3s, transform .3s, box-shadow .3s;
}
.btn-primary:hover {
  background: var(--cream); transform: translateY(-3px);
  box-shadow: 0 24px 48px rgba(0,0,0,.35);
}

/* ── Footer ── */
.footer {
  padding: 4rem 3.5rem;
  background: #080704;
  border-top: 1px solid rgba(200,169,110,.08);
}
.footer-top {
  display: flex; justify-content: space-between; align-items: flex-start;
  margin-bottom: 3rem;
}
.footer-logo {
  font-family: var(--r); font-size: 1.8rem; letter-spacing: .3em;
  font-weight: 400; color: var(--cream); margin-bottom: .5rem;
}
.footer-sub { font-size: .78rem; opacity: .35; line-height: 1.7; }
.footer-nav { display: flex; gap: 2rem; align-items: center; flex-wrap: wrap; }
.footer-nav a {
  color: var(--cream); text-decoration: none;
  font-size: .75rem; letter-spacing: .05em; opacity: .4;
  transition: opacity .3s;
}
.footer-nav a:hover { opacity: .9; }
.footer-bottom {
  display: flex; justify-content: space-between;
  font-size: .65rem; opacity: .25; letter-spacing: .1em;
}

/* ── Reveal ── */
.reveal {
  opacity: 0; transform: translateY(36px);
  transition: opacity 1s ease, transform 1s ease;
}
.reveal.revealed { opacity: 1; transform: none; }

/* ── Keyframes ── */
@keyframes fadeIn  { to { opacity: 1; } }
@keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
@keyframes marquee { to { transform: translateX(-33.333%); } }
@keyframes pulse-line {
  0%,100% { opacity: 0; transform: scaleY(0); transform-origin: top; }
  50%      { opacity: 1; transform: scaleY(1); }
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .nav-links { display: none; }
  .hero { padding: 0 1.5rem 4rem; }
  .manifeste { padding: 5rem 1.5rem; }
  .manifeste-inner { grid-template-columns: 1fr; gap: 3rem; }
  .gallery { padding: 5rem 1.5rem; }
  .gallery-grid { grid-template-columns: 1fr; height: auto; }
  .gallery-col { flex-direction: row; }
  .gi-tall, .gi-sm { height: 220px; flex: 1; }
  .gi-large { height: 340px; }
  .services { padding: 5rem 1.5rem; }
  .services-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
  .testi { padding: 5rem 1.5rem; }
  .cta-sec { padding: 6rem 1.5rem; }
  .footer { padding: 3rem 1.5rem; }
  .footer-top { flex-direction: column; gap: 2.5rem; }
  .cursor, .cursor-dot { display: none; }
  .dr { cursor: auto; }
}
</style>
