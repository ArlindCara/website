// Mark JS as available so reveal animations only hide content when JS runs.
document.documentElement.classList.add('js');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Header background on scroll ---------- */
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* ---------- Mobile menu ---------- */
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('nav-menu');

const setMenu = (open) => {
	menu.classList.toggle('open', open);
	toggle.setAttribute('aria-expanded', String(open));
	toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
	document.body.style.overflow = open ? 'hidden' : '';
};

toggle.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => {
	if (e.key === 'Escape' && menu.classList.contains('open')) setMenu(false);
});

/* ---------- Active nav link while scrolling ---------- */
const navLinks = [...menu.querySelectorAll('a[href^="#"]')];
const sections = navLinks
	.map((a) => document.querySelector(a.getAttribute('href')))
	.filter(Boolean);

const sectionObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (!entry.isIntersecting) return;
			navLinks.forEach((a) =>
				a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`)
			);
		});
	},
	{ rootMargin: '-45% 0px -50% 0px' }
);
sections.forEach((s) => sectionObserver.observe(s));

/* ---------- Reveal on scroll ---------- */
const revealObserver = new IntersectionObserver(
	(entries, obs) => {
		entries.forEach((entry) => {
			if (!entry.isIntersecting) return;
			entry.target.classList.add('visible');
			obs.unobserve(entry.target);
		});
	},
	{ threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* ---------- Animated counters ---------- */
const animateCount = (el) => {
	const target = Number(el.dataset.count);
	const suffix = el.dataset.suffix || '';
	const prefix = el.dataset.prefix || '';
	if (prefersReducedMotion) {
		el.textContent = prefix + target + suffix;
		return;
	}
	const duration = 1400;
	const start = performance.now();
	const step = (now) => {
		const p = Math.min((now - start) / duration, 1);
		const eased = 1 - Math.pow(1 - p, 3);
		el.textContent = prefix + Math.round(target * eased) + suffix;
		if (p < 1) requestAnimationFrame(step);
	};
	requestAnimationFrame(step);
};

const counterObserver = new IntersectionObserver(
	(entries, obs) => {
		entries.forEach((entry) => {
			if (!entry.isIntersecting) return;
			animateCount(entry.target);
			obs.unobserve(entry.target);
		});
	},
	{ threshold: 0.6 }
);
document.querySelectorAll('[data-count]').forEach((el) => counterObserver.observe(el));

/* ---------- Typing effect in hero ---------- */
const typed = document.getElementById('typed');
const roles = [
	'Software Engineer',
	'Backend Developer',
	'Cloud & DevOps Enthusiast',
	'Flutter Mobile Developer',
	'Cyber Security Passionate',
];

if (typed && !prefersReducedMotion) {
	let roleIndex = 0;
	let charIndex = roles[0].length;
	let deleting = true;

	const tick = () => {
		const word = roles[roleIndex];
		charIndex += deleting ? -1 : 1;
		typed.textContent = word.slice(0, charIndex);

		let delay = deleting ? 45 : 85;
		if (!deleting && charIndex === word.length) {
			delay = 1800;
			deleting = true;
		} else if (deleting && charIndex === 0) {
			deleting = false;
			roleIndex = (roleIndex + 1) % roles.length;
			delay = 300;
		}
		setTimeout(tick, delay);
	};
	setTimeout(tick, 2200);
}

/* ---------- Copy email ---------- */
const toast = document.getElementById('toast');
let toastTimer;
const showToast = (msg) => {
	toast.textContent = msg;
	toast.classList.add('show');
	clearTimeout(toastTimer);
	toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
};

const copyBtn = document.getElementById('copy-email');
copyBtn?.addEventListener('click', async () => {
	const email = copyBtn.dataset.email;
	try {
		await navigator.clipboard.writeText(email);
		showToast('Email copied to clipboard ✓');
	} catch {
		showToast(email);
	}
});

/* ---------- Footer year ---------- */
document.getElementById('year').textContent = new Date().getFullYear();
