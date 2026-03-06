import './style.css'

document.addEventListener('DOMContentLoaded', () => {

    /* ── Scroll Reveal ─────────────────────────────── */
    const revEls = document.querySelectorAll('.rev')
    const revObs = new IntersectionObserver(
        (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revObs.unobserve(e.target) } }),
        { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    )
    revEls.forEach(el => revObs.observe(el))

    /* ── Section Fade In ───────────────────────────── */
    const secObs = new IntersectionObserver(
        (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); secObs.unobserve(e.target) } }),
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
    document.querySelectorAll('section').forEach(el => secObs.observe(el))

    /* ── Nav scroll shadow ─────────────────────────── */
    const nav = document.querySelector('.nav') as HTMLElement
    window.addEventListener('scroll', () => {
        nav?.classList.toggle('scrolled', window.scrollY > 20)
    }, { passive: true })

    /* ── Marquee duplicate ─────────────────────────── */
    const track = document.querySelector('.marquee-track')
    if (track) {
        Array.from(track.children).forEach(c => track.appendChild(c.cloneNode(true)))
    }

    /* ── FAQ Tabs ─────────────────────────────────── */
    const tabs = document.querySelectorAll('.faq-tab')
    const panes = document.querySelectorAll('.faq-pane')
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'))
            panes.forEach(p => p.classList.remove('active'))
            tab.classList.add('active')
            const id = tab.getAttribute('data-tab')!
            document.getElementById(id)?.classList.add('active')
        })
    })

    /* ── FAQ Accordion ────────────────────────────── */
    document.querySelectorAll('.faq-q').forEach(q => {
        q.addEventListener('click', () => {
            const item = q.closest('.faq-item')!
            const isOpen = item.classList.contains('open')
            item.closest('.faq-items')?.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'))
            if (!isOpen) item.classList.add('open')
        })
    })

    /* ── Meteors Effect ───────────────────────────── */
    const meteorsContainer = document.getElementById('meteors-container');
    if (meteorsContainer) {
        const numMeteors = 30;
        for (let i = 0; i < numMeteors; i++) {
            const meteor = document.createElement('span');
            meteor.className = 'meteor';
            meteor.style.left = Math.floor(Math.random() * window.innerWidth) + 'px';
            meteor.style.top = Math.floor(Math.random() * (window.innerHeight / 2)) + 'px';
            meteor.style.animationDelay = (Math.random() * 0.8 + 0.2) + 's';
            meteor.style.animationDuration = Math.floor(Math.random() * 8 + 2) + 's';
            meteorsContainer.appendChild(meteor);
        }
    }
    /* ── Tools Marquee Scroll Reaction ────────────── */
    const marqueeContainer = document.querySelector('.tools-marquee-container')
    if (marqueeContainer) {
        window.addEventListener('scroll', () => {
            const rect = marqueeContainer.getBoundingClientRect()
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0
            if (isVisible) {
                const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
                document.documentElement.style.setProperty('--marquee-scroll', scrollProgress.toString())
            }
        }, { passive: true })
    }
})
