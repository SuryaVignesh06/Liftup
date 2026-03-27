import './style.css'
import { LightPillar } from './LightPillar'

document.addEventListener('DOMContentLoaded', () => {

    /* ── Light Pillar Background (Optimized) ─────── */
    document.querySelectorAll('.light-pillar-bg').forEach(container => {
        new LightPillar(container as HTMLElement, {
            topColor: '#5227FF',
            bottomColor: '#FF9FFC',
            intensity: 0.8,
            rotationSpeed: 0.15,
            pillarWidth: 3.5,
            pillarHeight: 0.4,
            glowAmount: 0.003,
            noiseIntensity: 0.4,
            pillarRotation: 15,
            quality: 'medium'
        })
    })

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

    /* ── Typing Animation (program.html hero) ──────── */
    const typingEl = document.getElementById('program-hero-heading') as HTMLElement | null
    if (typingEl) {
        // Parts: [text, isBreak, isEm]
        const segments: { text: string; tag: 'text' | 'br' | 'em' }[] = [
            { text: '15 Days to Build & Ship an', tag: 'text' },
            { text: '', tag: 'br' },
            { text: 'AI Product.', tag: 'em' },
        ]
        const cursor = document.createElement('span')
        cursor.className = 'typing-cursor'
        cursor.textContent = '\u00A0'

        let segIdx = 0, charIdx = 0
        const speed = 38 // ms per char

        const typeNext = () => {
            if (segIdx >= segments.length) {
                // done — remove cursor after pause
                setTimeout(() => cursor.remove(), 1200)
                return
            }
            const seg = segments[segIdx]
            if (seg.tag === 'br') {
                typingEl.insertBefore(document.createElement('br'), cursor)
                segIdx++; charIdx = 0
                setTimeout(typeNext, speed)
                return
            }
            const slice = seg.text.slice(0, charIdx + 1)
            // Find or create the current span/em node
            let node = typingEl.querySelector(`[data-seg="${segIdx}"]`) as HTMLElement | null
            if (!node) {
                node = document.createElement(seg.tag === 'em' ? 'em' : 'span')
                node.dataset.seg = String(segIdx)
                typingEl.insertBefore(node, cursor)
            }
            node.textContent = slice

            if (charIdx < seg.text.length - 1) {
                charIdx++
                setTimeout(typeNext, speed)
            } else {
                segIdx++; charIdx = 0
                setTimeout(typeNext, speed + 20)
            }
        }

        typingEl.appendChild(cursor)
        typingEl.classList.add('in') // ensure it's visible immediately
        setTimeout(typeNext, 600)
    }

    /* ── Typing Animation (builders.html hero) ─────── */
    const buildersHeading = document.getElementById('builders-hero-heading') as HTMLElement | null
    if (buildersHeading) {
        const bSegments: { text: string; tag: 'text' | 'br' | 'em' }[] = [
            { text: 'Hire Builders', tag: 'text' },
            { text: '', tag: 'br' },
            { text: 'Who Have Already Shipped.', tag: 'em' },
        ]
        const bCursor = document.createElement('span')
        bCursor.className = 'typing-cursor'
        bCursor.textContent = '\u00A0'

        let bSeg = 0, bChar = 0
        const bSpeed = 42

        const bTypeNext = () => {
            if (bSeg >= bSegments.length) {
                setTimeout(() => bCursor.remove(), 1200)
                return
            }
            const seg = bSegments[bSeg]
            if (seg.tag === 'br') {
                buildersHeading.insertBefore(document.createElement('br'), bCursor)
                bSeg++; bChar = 0
                setTimeout(bTypeNext, bSpeed)
                return
            }
            const slice = seg.text.slice(0, bChar + 1)
            let node = buildersHeading.querySelector(`[data-bseg="${bSeg}"]`) as HTMLElement | null
            if (!node) {
                node = document.createElement(seg.tag === 'em' ? 'em' : 'span')
                node.dataset.bseg = String(bSeg)
                buildersHeading.insertBefore(node, bCursor)
            }
            node.textContent = slice
            if (bChar < seg.text.length - 1) {
                bChar++
                setTimeout(bTypeNext, bSpeed)
            } else {
                bSeg++; bChar = 0
                setTimeout(bTypeNext, bSpeed + 20)
            }
        }

        buildersHeading.appendChild(bCursor)
        buildersHeading.classList.add('in')
        setTimeout(bTypeNext, 600)
    }


    /* ── Nav scroll shadow (Throttled) ─────────── */
    const nav = document.querySelector('.nav') as HTMLElement
    let scrollTicking = false
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(() => {
                nav?.classList.toggle('scrolled', window.scrollY > 20)
                scrollTicking = false
            })
            scrollTicking = true
        }
    }, { passive: true })

    /* ── Mobile Nav Hamburger ───────────────────── */
    const hamburger = document.getElementById('nav-hamburger')
    const mobileOverlay = document.getElementById('nav-mobile-overlay')
    const mobileClose = document.getElementById('nav-mobile-close')

    hamburger?.addEventListener('click', () => mobileOverlay?.classList.add('open'))
    mobileClose?.addEventListener('click', () => mobileOverlay?.classList.remove('open'))
    mobileOverlay?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => mobileOverlay.classList.remove('open'))
    })

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

    /* ── Meteors Effect (Optimized Count) ─────────── */
    const meteorsContainer = document.getElementById('meteors-container');
    if (meteorsContainer) {
        const numMeteors = 15; // Reduced from 30
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

    /* ── Tools Marquee Scroll Reaction (Throttled & Observed) ── */
    const marqueeContainer = document.querySelector('.tools-marquee-container')
    if (marqueeContainer) {
        let marqueeTicking = false
        let isMarqueeVisible = false

        const marqueeObs = new IntersectionObserver((entries) => {
            isMarqueeVisible = entries[0].isIntersecting
        }, { threshold: 0 })
        marqueeObs.observe(marqueeContainer)

        window.addEventListener('scroll', () => {
            if (!isMarqueeVisible) return
            if (!marqueeTicking) {
                window.requestAnimationFrame(() => {
                    const rect = marqueeContainer.getBoundingClientRect()
                    const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
                    document.documentElement.style.setProperty('--marquee-scroll', scrollProgress.toString())
                    marqueeTicking = false
                })
                marqueeTicking = true
            }
        }, { passive: true })
    }

    /* ── Curriculum Advisory Board Interaction ────── */
    const boardCards = document.querySelectorAll('.board-card');
    boardCards.forEach(card => {
        card.addEventListener('click', () => {
            if (card.classList.contains('active')) {
                // If clicking the active card, deactivate
                boardCards.forEach(c => {
                    c.classList.remove('active');
                    c.classList.remove('blurred');
                });
            } else {
                // If clicking a card (blurred or initial), activate it and blur others
                boardCards.forEach(c => {
                    if (c === card) {
                        c.classList.add('active');
                        c.classList.remove('blurred');
                    } else {
                        c.classList.add('blurred');
                        c.classList.remove('active');
                    }
                });
            }
        });
    });
})
