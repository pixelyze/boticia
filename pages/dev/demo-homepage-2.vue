<template>
  <div class="ab">

    <!-- Cursor -->
    <div class="cur" ref="curEl" />

    <!-- ── NAV ──────────────────────────────────── -->
    <header class="ab-nav" ref="navEl">
      <a href="#" class="ab-nav__logo">Boticia</a>
      <nav class="ab-nav__links">
        <a href="#">Mariages</a>
        <a href="#">Événements</a>
        <a href="#">Éditorial</a>
        <a href="#" class="ab-nav__cta">Prendre contact</a>
      </nav>
      <button class="ab-nav__burger" @click="menuOpen = !menuOpen">
        <span /><span />
      </button>
    </header>

    <!-- Mobile menu -->
    <div class="ab-menu" :class="{ open: menuOpen }">
      <a href="#" @click="menuOpen=false">Mariages</a>
      <a href="#" @click="menuOpen=false">Événements</a>
      <a href="#" @click="menuOpen=false">Éditorial</a>
      <a href="#" @click="menuOpen=false">Prendre contact</a>
    </div>

    <!-- ── HERO ──────────────────────────────────── -->
    <section class="hero">
      <!-- Background photo -->
      <div class="hero__photo" ref="heroPhotoEl">
        <img src="/images/events/decoration_florale_mariage_sophiethomas_boticia_29.jpg" alt="" />
      </div>

      <!-- Left panel — white -->
      <div class="hero__panel">
        <p class="hero__eyebrow reveal-up">Design floral · Provence & Paris</p>
        <h1 class="hero__h1">
          <span class="reveal-clip">La nature</span>
          <span class="reveal-clip delay-1">comme</span>
          <span class="reveal-clip delay-2 tc">matière<br/>première</span>
        </h1>
        <p class="hero__sub reveal-up delay-3">
          Compositions florales uniques pour vos mariages, événements d'exception et projets éditoriaux.
        </p>
        <div class="hero__actions reveal-up delay-4">
          <a href="#" class="btn-dark">Demander un devis</a>
          <a href="#" class="btn-ghost">Voir le portfolio →</a>
        </div>
      </div>
    </section>

    <!-- ── CHIFFRES ───────────────────────────────── -->
    <div class="stats reveal">
      <div class="stat" v-for="s in stats" :key="s.n">
        <span class="stat__n">{{ s.n }}</span>
        <span class="stat__l">{{ s.label }}</span>
      </div>
    </div>

    <!-- ── MANIFESTO ──────────────────────────────── -->
    <section class="mani reveal">
      <div class="mani__inner">
        <span class="eyebrow">Notre philosophie</span>
        <h2 class="mani__h2">
          Chaque création naît<br/>d'une écoute attentive.
        </h2>
        <p class="mani__body">
          Nous travaillons exclusivement avec des fleurs de saison, sourcées auprès de producteurs locaux et de marchés d'exception. Notre approche sculpturale marie la rigueur du design contemporain à la beauté imprévisible du vivant. Chaque composition est conçue une seule fois — pour vous, pour ce moment-là.
        </p>
        <div class="mani__pills">
          <span>Fleurs de saison</span>
          <span>Style sculptural</span>
          <span>Éco-responsable</span>
          <span>Sur-mesure</span>
        </div>
      </div>
      <div class="mani__img">
        <img src="/images/events/composition_florale_table_mariage_boticia.jpg" alt="" />
      </div>
    </section>

    <!-- ── SERVICES ───────────────────────────────── -->
    <section class="svcs">
      <div class="svcs__head reveal">
        <span class="eyebrow">Expertises</span>
        <h2>Trois façons de<br/>vous accompagner</h2>
      </div>
      <div class="svcs__grid">
        <div class="svc-card reveal" v-for="s in services" :key="s.num"
             :style="{ '--delay': s.delay }">
          <div class="svc-card__num">{{ s.num }}</div>
          <div class="svc-card__img">
            <img :src="s.img" :alt="s.title" />
          </div>
          <h3>{{ s.title }}</h3>
          <p>{{ s.desc }}</p>
          <a href="#" class="svc-card__link">En savoir plus →</a>
        </div>
      </div>
    </section>

    <!-- ── PORTFOLIO ──────────────────────────────── -->
    <section class="port reveal">
      <div class="port__head">
        <span class="eyebrow">Portfolio</span>
        <h2>Créations récentes</h2>
        <a href="#" class="btn-ghost small">Voir tout →</a>
      </div>
      <div class="port__grid">
        <div class="port__item pi-1">
          <img src="/images/events/decoration_florale_mariage_sophiethomas_boticia_11.jpg" alt="" />
          <div class="port__tag">Mariage · 2025</div>
        </div>
        <div class="port__item pi-2">
          <img src="/images/events/scenographie-florale-boticia.jpg" alt="" />
          <div class="port__tag">Scénographie · 2025</div>
        </div>
        <div class="port__item pi-3">
          <img src="/images/events/decoration_florale_mariage_sophiethomas_boticia_42.jpg" alt="" />
          <div class="port__tag">Mariage · 2024</div>
        </div>
        <div class="port__item pi-4">
          <img src="/images/events/atelier_composition_florale_team_building_boticia_3.jpg" alt="" />
          <div class="port__tag">Atelier · 2024</div>
        </div>
      </div>
    </section>

    <!-- ── TÉMOIGNAGE ─────────────────────────────── -->
    <section class="testi reveal">
      <div class="testi__left">
        <span class="eyebrow light">Ce qu'elles disent</span>
        <div class="testi__nav">
          <button @click="prevTesti" class="testi__btn">←</button>
          <span class="testi__count">{{ testiIdx + 1 }} / {{ testimonials.length }}</span>
          <button @click="nextTesti" class="testi__btn">→</button>
        </div>
      </div>
      <div class="testi__content">
        <Transition name="testi-fade" mode="out-in">
          <div :key="testiIdx" class="testi__card">
            <div class="testi__stars">★★★★★</div>
            <blockquote>{{ testimonials[testiIdx].quote }}</blockquote>
            <cite>{{ testimonials[testiIdx].author }}</cite>
          </div>
        </Transition>
      </div>
    </section>

    <!-- ── PRESSE ─────────────────────────────────── -->
    <div class="press reveal">
      <span class="press__label">Vu dans</span>
      <div class="press__logos">
        <span v-for="p in press" :key="p">{{ p }}</span>
      </div>
    </div>

    <!-- ── CTA FINAL ──────────────────────────────── -->
    <section class="cta reveal">
      <div class="cta__img">
        <img src="/images/events/decoration_florale_mariage_sophiethomas_boticia_29.jpg" alt="" />
        <div class="cta__img-veil" />
      </div>
      <div class="cta__content">
        <span class="eyebrow light">Votre projet</span>
        <h2>Commençons<br/>à rêver ensemble.</h2>
        <p>Chaque projet est unique. Partagez-nous votre vision et nous créerons quelque chose d'inoubliable.</p>
        <a href="#" class="btn-light">Demander un devis</a>
      </div>
    </section>

    <!-- ── FOOTER ─────────────────────────────────── -->
    <footer class="foot">
      <div class="foot__top">
        <div class="foot__brand">
          <div class="foot__logo">Boticia</div>
          <p>Atelier de design floral<br/>Provence · Paris · International</p>
        </div>
        <div class="foot__col">
          <h4>Navigation</h4>
          <a href="#">Mariages</a>
          <a href="#">Événements</a>
          <a href="#">Éditorial & Set Design</a>
          <a href="#">Ateliers</a>
          <a href="#">À propos</a>
        </div>
        <div class="foot__col">
          <h4>Contact</h4>
          <a href="#">hello@boticia.fr</a>
          <a href="#">Instagram</a>
          <a href="#">Pinterest</a>
        </div>
        <div class="foot__col">
          <h4>Newsletter</h4>
          <p class="foot__nl-desc">Les coulisses de l'atelier, les saisons florales, l'inspiration.</p>
          <div class="foot__nl">
            <input type="email" placeholder="votre@email.com" />
            <button>→</button>
          </div>
        </div>
      </div>
      <div class="foot__bottom">
        <span>© 2026 Boticia — Design floral</span>
        <span>Mentions légales · Politique de confidentialité</span>
      </div>
    </footer>

  </div>
</template>

<script setup>
definePageMeta({ layout: false, ssr: false });

useHead({
  link: [{
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,500;1,400;1,500&family=Barlow:wght@300;400;500&display=swap",
  }],
});

const menuOpen = ref(false);
const testiIdx = ref(0);
const curEl = ref(null);
const navEl = ref(null);
const heroPhotoEl = ref(null);

const stats = [
  { n: "180+", label: "Mariages réalisés" },
  { n: "12",   label: "Années d'expérience" },
  { n: "3",    label: "Pays" },
  { n: "100%", label: "Sur-mesure" },
];

const services = [
  {
    num: "01", delay: "0s",
    title: "Mariages sur-mesure",
    desc: "De la cérémonie à la réception, chaque détail floral est orchestré pour sublimer votre journée. Un accompagnement complet, de la conception à la pose.",
    img: "/images/events/composition_florale_table_mariage_boticia.jpg",
  },
  {
    num: "02", delay: "0.15s",
    title: "Scénographie d'événements",
    desc: "Lancements de marque, soirées corporate, dîners de gala — des scénographies florales qui marquent les esprits et racontent une histoire.",
    img: "/images/events/scenographie-florale-boticia.jpg",
  },
  {
    num: "03", delay: "0.3s",
    title: "Éditorial & Set design",
    desc: "Shootings photo, défilés, vitrines de luxe — la fleur comme matière créative au service de votre vision artistique.",
    img: "/images/events/atelier_composition_florale_team_building_boticia_3.jpg",
  },
];

const testimonials = [
  {
    quote: "« Boticia a transcendé nos attentes. Les compositions florales de notre mariage étaient d'une poésie rare — chaque arrangement racontait notre histoire avec une précision et une grâce que nous n'aurions pas pu imaginer. »",
    author: "— Camille & Julien · Mariage au Château de la Messardière, Saint-Tropez",
  },
  {
    quote: "« Travailler avec Boticia sur notre lancement de collection a été une révélation. Leur capacité à traduire une identité de marque en langage floral est exceptionnelle. Un partenaire créatif de premier plan. »",
    author: "— Directrice artistique · Maison de couture parisienne",
  },
  {
    quote: "« Une sensibilité artistique hors du commun. Pour notre gala annuel, Boticia a créé une scénographie florale qui a bluffé nos 400 invités. Professionnel, créatif, et d'une fiabilité absolue. »",
    author: "— Responsable événements · Groupe hôtelier 5 étoiles",
  },
];

const press = ["Vogue", "Elle Décoration", "Marie Claire Maison", "Côté Sud", "Madame Figaro"];

const prevTesti = () => {
  testiIdx.value = (testiIdx.value - 1 + testimonials.length) % testimonials.length;
};
const nextTesti = () => {
  testiIdx.value = (testiIdx.value + 1) % testimonials.length;
};

onMounted(() => {
  // Scroll reveals
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
    { threshold: 0.1 }
  );
  document.querySelectorAll(".reveal,.reveal-up,.reveal-clip").forEach((el) => io.observe(el));

  // Hero parallax
  const onScroll = () => {
    if (heroPhotoEl.value) {
      heroPhotoEl.value.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    }
    navEl.value?.classList.toggle("solid", window.scrollY > 60);
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  // Cursor
  let mx = 0, my = 0;
  document.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    if (curEl.value) curEl.value.style.transform = `translate(${mx}px,${my}px)`;
  });
  document.querySelectorAll("a,button,input").forEach((el) => {
    el.addEventListener("mouseenter", () => curEl.value?.classList.add("big"));
    el.addEventListener("mouseleave", () => curEl.value?.classList.remove("big"));
  });
});
</script>

<style>
/* ── Reset & tokens ── */
.ab *, .ab *::before, .ab *::after { box-sizing: border-box; margin: 0; padding: 0; }

.ab {
  --white:   #FDFAF6;
  --off:     #F5EFE6;
  --ink:     #1A1714;
  --ink2:    #3a342e;
  --terra:   #B8694B;
  --sage:    #6B7C5E;
  --border:  rgba(26,23,20,.1);
  --serif:   'Bodoni Moda', Georgia, serif;
  --sans:    'Barlow', system-ui, sans-serif;
  --ease:    cubic-bezier(.25,.46,.45,.94);

  background: var(--white);
  color: var(--ink);
  font-family: var(--sans);
  font-weight: 300;
  cursor: none;
  overflow-x: hidden;
}

/* ── Cursor ── */
.cur {
  position: fixed; top: -6px; left: -6px;
  width: 12px; height: 12px;
  background: var(--terra); border-radius: 50%;
  pointer-events: none; z-index: 9999;
  transition: width .35s var(--ease), height .35s var(--ease), background .35s;
  will-change: transform;
}
.cur.big { width: 48px; height: 48px; background: transparent; border: 1px solid var(--terra); top: -24px; left: -24px; }

/* ── Nav ── */
.ab-nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.8rem 3.5rem;
  transition: background .4s, padding .4s, border-color .4s;
}
.ab-nav.solid {
  background: rgba(253,250,246,.94);
  backdrop-filter: blur(12px);
  padding: 1rem 3.5rem;
  border-bottom: 1px solid var(--border);
}
.ab-nav__logo {
  font-family: var(--serif); font-size: 1.5rem; font-style: italic;
  font-weight: 400; color: var(--ink); text-decoration: none;
  letter-spacing: .05em;
}
.ab-nav__links { display: flex; align-items: center; gap: 2.5rem; }
.ab-nav__links a {
  text-decoration: none; font-size: .78rem; letter-spacing: .08em;
  color: var(--ink); opacity: .55; transition: opacity .3s;
}
.ab-nav__links a:hover { opacity: 1; }
.ab-nav__cta {
  opacity: 1 !important; color: var(--terra) !important;
  border-bottom: 1px solid var(--terra) !important; padding-bottom: 1px;
}
.ab-nav__burger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: none; padding: 4px; }
.ab-nav__burger span { display: block; width: 22px; height: 1px; background: var(--ink); }
.ab-menu {
  display: none; position: fixed; inset: 0; z-index: 199;
  background: var(--white); flex-direction: column;
  align-items: center; justify-content: center; gap: 2.5rem;
}
.ab-menu.open { display: flex; }
.ab-menu a { font-family: var(--serif); font-size: 2rem; font-style: italic; color: var(--ink); text-decoration: none; }

/* ── Eyebrow ── */
.eyebrow {
  display: block; font-size: .65rem; letter-spacing: .28em;
  text-transform: uppercase; color: var(--terra); margin-bottom: 1.2rem;
}
.eyebrow.light { color: rgba(245,239,230,.6); }

/* ── HERO ── */
.hero {
  position: relative; min-height: 100vh;
  display: grid; grid-template-columns: 42% 1fr;
}
.hero__photo {
  position: absolute; right: 0; top: 0;
  width: 62%; height: 110%;
  will-change: transform;
}
.hero__photo img {
  width: 100%; height: 100%; object-fit: cover; object-position: center 20%;
}
.hero__panel {
  position: relative; z-index: 2;
  display: flex; flex-direction: column; justify-content: flex-end;
  padding: 0 4rem 6rem 3.5rem;
  background: var(--white);
}
.hero__eyebrow { color: var(--terra); font-size: .68rem; letter-spacing: .25em; text-transform: uppercase; margin-bottom: 2rem; }
.hero__h1 {
  font-family: var(--serif);
  font-size: clamp(3rem, 5.5vw, 6rem);
  font-weight: 400; line-height: 1.05;
  color: var(--ink); margin-bottom: 2rem;
}
.hero__h1 .tc { color: var(--terra); font-style: italic; }
.hero__sub {
  font-size: .95rem; line-height: 1.8; opacity: .6;
  max-width: 36ch; margin-bottom: 2.5rem;
}
.hero__actions { display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; }
.btn-dark {
  display: inline-block; background: var(--ink); color: var(--white);
  text-decoration: none; padding: .9rem 2rem;
  font-size: .75rem; letter-spacing: .12em; text-transform: uppercase;
  font-weight: 500; transition: background .3s;
}
.btn-dark:hover { background: var(--terra); }
.btn-ghost {
  font-size: .82rem; color: var(--ink); text-decoration: none;
  border-bottom: 1px solid var(--ink); padding-bottom: 1px;
  transition: color .3s, border-color .3s;
}
.btn-ghost:hover { color: var(--terra); border-color: var(--terra); }
.btn-ghost.small { font-size: .75rem; }

/* ── Stats ── */
.stats {
  display: grid; grid-template-columns: repeat(4,1fr);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  background: var(--off);
}
.stat {
  padding: 2.5rem 2rem; text-align: center;
  border-right: 1px solid var(--border);
}
.stat:last-child { border-right: none; }
.stat__n {
  display: block; font-family: var(--serif); font-size: 2.4rem;
  font-weight: 400; color: var(--ink); line-height: 1; margin-bottom: .4rem;
}
.stat__l { font-size: .7rem; letter-spacing: .12em; text-transform: uppercase; opacity: .5; }

/* ── Manifesto ── */
.mani {
  display: grid; grid-template-columns: 1fr 480px; gap: 0;
  min-height: 600px;
}
.mani__inner {
  padding: 7rem 5rem 7rem 3.5rem;
  display: flex; flex-direction: column; justify-content: center;
  background: var(--white);
}
.mani__h2 {
  font-family: var(--serif);
  font-size: clamp(2rem, 4vw, 3.8rem);
  font-weight: 400; line-height: 1.15; font-style: italic;
  margin-bottom: 2rem; color: var(--ink);
}
.mani__body {
  font-size: .95rem; line-height: 1.9; opacity: .65; max-width: 52ch; margin-bottom: 2rem;
}
.mani__pills { display: flex; flex-wrap: wrap; gap: .6rem; }
.mani__pills span {
  border: 1px solid var(--border); border-radius: 100px;
  padding: .35rem .9rem; font-size: .7rem; letter-spacing: .1em;
  text-transform: uppercase; color: var(--sage);
}
.mani__img { overflow: hidden; }
.mani__img img { width: 100%; height: 100%; object-fit: cover; }

/* ── Services ── */
.svcs { padding: 7rem 3.5rem; background: var(--off); }
.svcs__head { margin-bottom: 4rem; }
.svcs__head h2 {
  font-family: var(--serif); font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 400; line-height: 1.15;
}
.svcs__grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 2rem; }
.svc-card {
  background: var(--white); overflow: hidden;
  transition: transform .4s var(--ease), box-shadow .4s;
  transition-delay: var(--delay);
}
.svc-card:hover { transform: translateY(-6px); box-shadow: 0 24px 48px rgba(0,0,0,.08); }
.svc-card__num {
  padding: 1.5rem 1.5rem .5rem;
  font-family: var(--serif); font-size: 1.8rem; font-style: italic;
  color: var(--terra); opacity: .5;
}
.svc-card__img { height: 240px; overflow: hidden; }
.svc-card__img img { width: 100%; height: 100%; object-fit: cover; transition: transform .7s var(--ease); }
.svc-card:hover .svc-card__img img { transform: scale(1.06); }
.svc-card h3 {
  font-family: var(--serif); font-size: 1.3rem; font-weight: 400;
  padding: 1.5rem 1.5rem .6rem; line-height: 1.3;
}
.svc-card p { font-size: .84rem; line-height: 1.75; opacity: .6; padding: 0 1.5rem 1rem; }
.svc-card__link {
  display: block; padding: 0 1.5rem 1.5rem;
  font-size: .75rem; color: var(--terra); text-decoration: none;
  letter-spacing: .05em;
}

/* ── Portfolio ── */
.port { padding: 7rem 3.5rem; background: var(--white); }
.port__head {
  display: flex; align-items: baseline; justify-content: space-between;
  margin-bottom: 2.5rem;
}
.port__head h2 {
  font-family: var(--serif); font-size: clamp(1.8rem, 3.5vw, 3rem);
  font-weight: 400;
}
.port__grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  grid-template-rows: 340px 220px;
  gap: .7rem;
}
.port__item { position: relative; overflow: hidden; }
.port__item img { width: 100%; height: 100%; object-fit: cover; transition: transform .7s var(--ease); }
.port__item:hover img { transform: scale(1.05); }
.pi-1 { grid-row: 1 / 3; }
.pi-2 { grid-column: 2; grid-row: 1; }
.pi-3 { grid-column: 3; grid-row: 1; }
.pi-4 { grid-column: 2 / 4; grid-row: 2; }
.port__tag {
  position: absolute; bottom: .8rem; left: .8rem;
  font-size: .62rem; letter-spacing: .16em; text-transform: uppercase;
  background: rgba(253,250,246,.88); backdrop-filter: blur(6px);
  padding: .3rem .7rem; color: var(--ink); opacity: 0;
  transition: opacity .3s;
}
.port__item:hover .port__tag { opacity: 1; }

/* ── Testimonial ── */
.testi {
  display: grid; grid-template-columns: 260px 1fr;
  background: var(--ink); padding: 6rem 3.5rem;
  gap: 4rem; align-items: center;
}
.testi__left { display: flex; flex-direction: column; gap: 1.5rem; }
.testi__nav { display: flex; align-items: center; gap: 1rem; }
.testi__btn {
  background: none; border: 1px solid rgba(245,239,230,.2);
  color: var(--off); width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  cursor: none; font-size: 1rem;
  transition: border-color .3s, background .3s;
}
.testi__btn:hover { border-color: var(--terra); background: var(--terra); }
.testi__count { font-size: .7rem; letter-spacing: .15em; opacity: .4; color: var(--off); }
.testi__card { color: var(--off); }
.testi__stars { color: var(--terra); letter-spacing: .2em; font-size: .8rem; margin-bottom: 2rem; }
.testi__card blockquote {
  font-family: var(--serif); font-size: clamp(1.1rem, 2.2vw, 1.8rem);
  font-style: italic; font-weight: 400; line-height: 1.7;
  margin-bottom: 1.5rem;
}
.testi__card cite { font-size: .72rem; letter-spacing: .1em; opacity: .5; }

/* Transition */
.testi-fade-enter-active, .testi-fade-leave-active { transition: opacity .4s, transform .4s; }
.testi-fade-enter-from { opacity: 0; transform: translateX(20px); }
.testi-fade-leave-to  { opacity: 0; transform: translateX(-20px); }

/* ── Press ── */
.press {
  display: flex; align-items: center; gap: 3rem;
  padding: 2.5rem 3.5rem;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  background: var(--off);
  flex-wrap: wrap;
}
.press__label { font-size: .62rem; letter-spacing: .22em; text-transform: uppercase; opacity: .35; white-space: nowrap; }
.press__logos { display: flex; gap: 3rem; flex-wrap: wrap; align-items: center; }
.press__logos span {
  font-family: var(--serif); font-size: 1rem; font-style: italic;
  opacity: .35; transition: opacity .3s; cursor: none;
}
.press__logos span:hover { opacity: .9; }

/* ── CTA final ── */
.cta {
  position: relative; min-height: 520px;
  display: flex; align-items: center; justify-content: flex-end;
  overflow: hidden;
}
.cta__img {
  position: absolute; inset: 0;
}
.cta__img img { width: 100%; height: 100%; object-fit: cover; filter: brightness(.4); }
.cta__img-veil {
  position: absolute; inset: 0;
  background: linear-gradient(to left, rgba(26,23,20,.7) 50%, transparent 100%);
}
.cta__content {
  position: relative; z-index: 1;
  max-width: 520px; margin-right: 3.5rem;
  color: var(--off);
}
.cta__content h2 {
  font-family: var(--serif); font-size: clamp(2rem, 4.5vw, 4rem);
  font-weight: 400; font-style: italic; line-height: 1.1;
  margin-bottom: 1.2rem;
}
.cta__content p { font-size: .9rem; line-height: 1.8; opacity: .65; margin-bottom: 2.5rem; max-width: 40ch; }
.btn-light {
  display: inline-block; border: 1px solid var(--off); color: var(--off);
  text-decoration: none; padding: .9rem 2rem;
  font-size: .75rem; letter-spacing: .12em; text-transform: uppercase;
  transition: background .3s, color .3s;
}
.btn-light:hover { background: var(--off); color: var(--ink); }

/* ── Footer ── */
.foot {
  padding: 5rem 3.5rem 2.5rem;
  background: var(--ink); color: var(--off);
  border-top: 1px solid rgba(245,239,230,.08);
}
.foot__top {
  display: grid; grid-template-columns: 1.5fr 1fr 1fr 1.5fr;
  gap: 3rem; margin-bottom: 4rem;
}
.foot__logo {
  font-family: var(--serif); font-size: 2rem; font-style: italic;
  margin-bottom: .6rem;
}
.foot__brand p { font-size: .78rem; opacity: .35; line-height: 1.7; }
.foot__col h4 {
  font-size: .6rem; letter-spacing: .22em; text-transform: uppercase;
  color: var(--terra); margin-bottom: 1.2rem;
}
.foot__col a {
  display: block; color: var(--off); text-decoration: none;
  font-size: .82rem; opacity: .45; margin-bottom: .6rem; transition: opacity .3s;
}
.foot__col a:hover { opacity: 1; }
.foot__nl-desc { font-size: .78rem; opacity: .4; line-height: 1.6; margin-bottom: 1rem; }
.foot__nl { display: flex; }
.foot__nl input {
  flex: 1; background: rgba(245,239,230,.06); border: 1px solid rgba(245,239,230,.12);
  border-right: none; color: var(--off); padding: .7rem 1rem;
  font-family: var(--sans); font-size: .8rem; outline: none;
}
.foot__nl input::placeholder { opacity: .35; }
.foot__nl button {
  background: var(--terra); border: none; color: var(--off);
  padding: .7rem 1.2rem; cursor: none; font-size: 1rem;
  transition: background .3s;
}
.foot__nl button:hover { background: #9e5038; }
.foot__bottom {
  display: flex; justify-content: space-between; align-items: center;
  border-top: 1px solid rgba(245,239,230,.08); padding-top: 2rem;
  font-size: .65rem; opacity: .3; letter-spacing: .08em;
}

/* ── Reveal animations ── */
.reveal {
  opacity: 0; transform: translateY(32px);
  transition: opacity .9s var(--ease), transform .9s var(--ease);
}
.reveal.in { opacity: 1; transform: none; }

.reveal-up {
  opacity: 0; transform: translateY(20px);
  transition: opacity .7s var(--ease), transform .7s var(--ease);
}
.reveal-up.in { opacity: 1; transform: none; }
.reveal-up.delay-3 { transition-delay: .5s; }
.reveal-up.delay-4 { transition-delay: .7s; }

.reveal-clip {
  display: block; overflow: hidden;
  opacity: 0; transform: translateY(40px);
  transition: opacity .8s var(--ease), transform .8s var(--ease);
}
.reveal-clip.in { opacity: 1; transform: none; }
.reveal-clip.delay-1 { transition-delay: .15s; }
.reveal-clip.delay-2 { transition-delay: .3s; }

/* ── Responsive ── */
@media (max-width: 960px) {
  .ab-nav__links { display: none; }
  .ab-nav__burger { display: flex; }
  .ab-nav { padding: 1.2rem 1.5rem; }
  .hero { grid-template-columns: 1fr; min-height: auto; }
  .hero__photo { position: relative; width: 100%; height: 60vh; }
  .hero__panel { padding: 3rem 1.5rem 4rem; background: var(--white); }
  .stats { grid-template-columns: repeat(2,1fr); }
  .stat { border-bottom: 1px solid var(--border); }
  .mani { grid-template-columns: 1fr; }
  .mani__inner { padding: 4rem 1.5rem; }
  .mani__img { height: 300px; }
  .svcs { padding: 4rem 1.5rem; }
  .svcs__grid { grid-template-columns: 1fr; gap: 1.5rem; }
  .port { padding: 4rem 1.5rem; }
  .port__grid { grid-template-columns: 1fr 1fr; grid-template-rows: auto; }
  .pi-1 { grid-row: auto; grid-column: 1 / 3; height: 280px; }
  .pi-4 { grid-column: auto; }
  .testi { grid-template-columns: 1fr; padding: 4rem 1.5rem; }
  .press { padding: 2rem 1.5rem; }
  .cta { padding: 4rem 1.5rem; justify-content: flex-start; }
  .cta__content { margin-right: 0; }
  .cta__img-veil { background: rgba(26,23,20,.6); }
  .foot { padding: 4rem 1.5rem 2rem; }
  .foot__top { grid-template-columns: 1fr 1fr; gap: 2.5rem; }
  .cur { display: none; }
  .ab { cursor: auto; }
}
</style>
