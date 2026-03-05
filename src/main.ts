import './style.css'

document.addEventListener('DOMContentLoaded', () => {

    /* ── Scroll Reveal ─────────────────────────────── */
    const revEls = document.querySelectorAll('.rev')
    const revObs = new IntersectionObserver(
        (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revObs.unobserve(e.target) } }),
        { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    )
    revEls.forEach(el => revObs.observe(el))

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
})
