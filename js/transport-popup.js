function initTransportPopup() {
	const popup = document.querySelector('#transport-popup')
	const overlay = popup?.querySelector('.transport-popup__overlay')
	const closeButton = popup?.querySelector('.transport-popup__close')
	const cardLinks = document.querySelectorAll('.vehicle-card__link')
	const bookingCloseButton = popup?.querySelector('[data-popup-close]')
	const dialog = popup?.querySelector('.transport-popup__dialog')
	let returnFocus = null

	if (!popup || !overlay || !closeButton || !cardLinks.length) {
		return
	}

	const sliderTrack = popup.querySelector('.transport-popup__slider-track')
	const prevButton = popup.querySelector('.transport-popup__slider-arrow--prev')
	const nextButton = popup.querySelector('.transport-popup__slider-arrow--next')
	const dots = popup.querySelectorAll('.transport-popup__slider-dot')

	if (!sliderTrack) {
		return
	}

	let slides = popup.querySelectorAll('.transport-popup__slide')
	let currentSlideIndex = 0
	let startX = 0
	let isDragging = false

	function updateSlider() {
		slides = popup.querySelectorAll('.transport-popup__slide')

		if (!slides.length) {
			return
		}

		sliderTrack.style.transform = `translateX(-${currentSlideIndex * 100}%)`

		dots.forEach((dot, index) => {
			dot.classList.toggle(
				'transport-popup__slider-dot--active',
				index === currentSlideIndex,
			)
		})
	}

	function goToSlide(index) {
		slides = popup.querySelectorAll('.transport-popup__slide')

		if (!slides.length) {
			return
		}

		if (index < 0) {
			currentSlideIndex = slides.length - 1
		} else if (index >= slides.length) {
			currentSlideIndex = 0
		} else {
			currentSlideIndex = index
		}

		updateSlider()
	}

	function goToNextSlide() {
		goToSlide(currentSlideIndex + 1)
	}

	function goToPrevSlide() {
		goToSlide(currentSlideIndex - 1)
	}

	function openPopup() {
		returnFocus = document.activeElement
		popup.dispatchEvent(new Event('transport:open'))
		popup.classList.add('transport-popup--open')
		popup.setAttribute('aria-hidden', 'false')
		document.body.classList.add('body--lock')

		currentSlideIndex = 0
		updateSlider()
		if (dialog) dialog.scrollTop = 0
		closeButton.focus({ preventScroll: true })
	}

	function closePopup() {
		popup.classList.remove('transport-popup--open')
		// Move focus out of the dialog before hiding it from assistive technology.
		returnFocus?.focus({ preventScroll: true })
		popup.setAttribute('aria-hidden', 'true')
		document.body.classList.remove('body--lock')
	}

	cardLinks.forEach(link => {
		link.addEventListener('click', event => {
			event.preventDefault()
			openPopup()
		})
	})

	closeButton.addEventListener('click', closePopup)
	bookingCloseButton?.addEventListener('click', closePopup)
	overlay.addEventListener('click', closePopup)

	if (prevButton) {
		prevButton.addEventListener('click', goToPrevSlide)
	}

	if (nextButton) {
		nextButton.addEventListener('click', goToNextSlide)
	}

	dots.forEach((dot, index) => {
		dot.addEventListener('click', () => {
			goToSlide(index)
		})
	})

	sliderTrack.addEventListener('touchstart', event => {
		startX = event.touches[0].clientX
		isDragging = true
	})

	sliderTrack.addEventListener('touchmove', event => {
		if (!isDragging) {
			return
		}

		const currentX = event.touches[0].clientX
		const diffX = startX - currentX

		if (Math.abs(diffX) > 50) {
			if (diffX > 0) {
				goToNextSlide()
			} else {
				goToPrevSlide()
			}

			isDragging = false
		}
	})

	sliderTrack.addEventListener('touchend', () => {
		isDragging = false
	})

	// Keep keyboard navigation within the open modal.
	popup.addEventListener('keydown', event => {
		if (event.key !== 'Tab') return
		const focusable = Array.from(popup.querySelectorAll('a[href], button, input, [tabindex="0"]'))
			.filter(element => !element.disabled && element.getClientRects().length)
		const first = focusable[0]
		const last = focusable[focusable.length - 1]
		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault()
			last?.focus()
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault()
			first?.focus()
		}
	})

	document.addEventListener('keydown', event => {
		if (
			event.key === 'Escape' &&
			popup.classList.contains('transport-popup--open')
		) {
			closePopup()
		}
	})

	updateSlider()
}
