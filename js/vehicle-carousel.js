function initVehicleCarousels() {
	const catalog = document.querySelector('#catalog .vehicles')
	if (!catalog) return

	const viewport = catalog.querySelector('.vehicles__slider')
	const controls = catalog.querySelector('.vehicles__header')
	const previous = catalog.querySelector('.vehicles__arrow--prev')
	const next = catalog.querySelector('.vehicles__arrow--next')
	const filters = catalog.querySelectorAll('[data-vehicle-filter]')
	const cards = catalog.querySelectorAll('[data-vehicle-type]')

	function updateArrows() {
		const end = viewport.scrollWidth - viewport.clientWidth
		previous.setAttribute('aria-disabled', String(viewport.scrollLeft <= 1))
		next.setAttribute('aria-disabled', String(viewport.scrollLeft >= end - 1))
	}

	function scrollPage(button, direction) {
		if (button.getAttribute('aria-disabled') === 'true') return
		viewport.scrollBy({ left: viewport.clientWidth * direction })
	}

	filters.forEach(filter => {
		filter.addEventListener('click', () => {
			const category = filter.dataset.vehicleFilter
			filters.forEach(button => {
				button.setAttribute('aria-pressed', String(button === filter))
			})
			cards.forEach(card => {
				card.hidden = category !== 'all' && card.dataset.vehicleType !== category
			})
			viewport.scrollTo({ left: 0, behavior: 'instant' })
			updateArrows()
		})
	})

	previous.addEventListener('click', () => scrollPage(previous, -1))
	next.addEventListener('click', () => scrollPage(next, 1))
	viewport.addEventListener('scroll', updateArrows, { passive: true })
	new ResizeObserver(updateArrows).observe(viewport)
	controls.hidden = false
	updateArrows()
}
