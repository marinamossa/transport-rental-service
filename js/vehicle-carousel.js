/*infinity slider*/

function initVehicleCarousels() {
	const sliders = document.querySelectorAll('.vehicles')

	if (!sliders.length) {
		return
	}

	sliders.forEach(slider => {
		const track = slider.querySelector('.vehicles__track')
		const prevButton = slider.querySelector('.vehicles__arrow--prev')
		const nextButton = slider.querySelector('.vehicles__arrow--next')
		const originalCards = Array.from(slider.querySelectorAll('.vehicle-card'))

		if (!track || !prevButton || !nextButton || !originalCards.length) {
			return
		}

		let visibleCards = getVisibleCards()
		let clonesCount = Math.min(visibleCards, originalCards.length)
		let currentIndex = clonesCount
		let isTransitioning = false

		let startX = 0
		let isDragging = false

		setupSlider()
		bindEvents()
		updatePosition(false)

		function getVisibleCards() {
			if (window.innerWidth <= 767) {
				return 2
			}

			if (window.innerWidth <= 991) {
				return 3
			}

			if (window.innerWidth <= 1199) {
				return 4
			}

			return 5
		}

		function getGap() {
			const styles = window.getComputedStyle(track)
			const gapValue = styles.columnGap || styles.gap || '0px'
			return parseFloat(gapValue) || 0
		}

		function getCardWidth() {
			const firstCard = track.querySelector('.vehicle-card')
			return firstCard ? firstCard.offsetWidth : 0
		}

		function setupSlider() {
			track.innerHTML = ''

			visibleCards = getVisibleCards()
			clonesCount = Math.min(visibleCards, originalCards.length)

			const firstClones = originalCards
				.slice(0, clonesCount)
				.map(card => card.cloneNode(true))

			const lastClones = originalCards
				.slice(-clonesCount)
				.map(card => card.cloneNode(true))

			lastClones.forEach(card => {
				card.classList.add('vehicle-card--clone')
				track.appendChild(card)
			})

			originalCards.forEach(card => {
				track.appendChild(card)
			})

			firstClones.forEach(card => {
				card.classList.add('vehicle-card--clone')
				track.appendChild(card)
			})

			track.style.display = 'flex'
			track.style.transition = 'transform 0.35s ease'
			track.style.willChange = 'transform'

			Array.from(track.children).forEach(card => {
				card.style.flex = '0 0 auto'
			})

			currentIndex = clonesCount
		}

		function updatePosition(withAnimation = true) {
			const gap = getGap()
			const cardWidth = getCardWidth()
			const moveValue = currentIndex * (cardWidth + gap)

			if (!withAnimation) {
				track.style.transition = 'none'
			} else {
				track.style.transition = 'transform 0.35s ease'
			}

			track.style.transform = `translateX(-${moveValue}px)`
		}

		function goToNext() {
			if (isTransitioning) {
				return
			}

			isTransitioning = true
			currentIndex += 1
			updatePosition(true)
		}

		function goToPrev() {
			if (isTransitioning) {
				return
			}

			isTransitioning = true
			currentIndex -= 1
			updatePosition(true)
		}

		function handleInfiniteLoop() {
			const totalOriginal = originalCards.length

			if (currentIndex >= totalOriginal + clonesCount) {
				currentIndex = clonesCount
				updatePosition(false)
			}

			if (currentIndex < clonesCount) {
				currentIndex = totalOriginal + currentIndex
				updatePosition(false)
			}

			isTransitioning = false
		}

		function refreshSlider() {
			setupSlider()

			requestAnimationFrame(() => {
				updatePosition(false)
			})
		}

		function bindEvents() {
			nextButton.addEventListener('click', goToNext)
			prevButton.addEventListener('click', goToPrev)

			track.addEventListener('transitionend', handleInfiniteLoop)

			window.addEventListener('resize', refreshSlider)

			track.addEventListener('touchstart', event => {
				startX = event.touches[0].clientX
				isDragging = true
			})

			track.addEventListener('touchmove', event => {
				if (!isDragging) {
					return
				}

				const currentX = event.touches[0].clientX
				const diffX = startX - currentX

				if (Math.abs(diffX) > 50) {
					if (diffX > 0) {
						goToNext()
					} else {
						goToPrev()
					}

					isDragging = false
				}
			})

			track.addEventListener('touchend', () => {
				isDragging = false
			})
		}
	})
}
