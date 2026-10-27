function initTransportPopupSlider() {
	const popup = document.querySelector('#transport-popup')

	if (!popup) {
		return
	}

	const slider = popup.querySelector('#transport-popup-slider')
	const track = popup.querySelector('.transport-popup__slider-track')
	const prevButton = popup.querySelector('.transport-popup__slider-arrow--prev')
	const nextButton = popup.querySelector('.transport-popup__slider-arrow--next')
	const dotsContainer = popup.querySelector('.transport-popup__slider-dots')

	if (!slider || !track || !prevButton || !nextButton || !dotsContainer) {
		return
	}

	const popupState = {
		images: [],
		currentIndex: 0,
		startX: 0,
		isDragging: false,
	}

	function renderSlides(images, title = 'Transport image') {
		track.innerHTML = ''
		dotsContainer.innerHTML = ''

		popupState.images = images
		popupState.currentIndex = 0

		images.forEach((imageSrc, index) => {
			const slide = document.createElement('div')
			slide.className = 'transport-popup__slide'
			if (index === 0) {
				slide.classList.add('transport-popup__slide--active')
			}

			const img = document.createElement('img')
			img.className = 'transport-popup__image'
			img.src = imageSrc.trim()
			img.alt = `${title} ${index + 1}`

			slide.appendChild(img)
			track.appendChild(slide)

			const dot = document.createElement('button')
			dot.type = 'button'
			dot.className = 'transport-popup__slider-dot'
			if (index === 0) {
				dot.classList.add('transport-popup__slider-dot--active')
			}
			dot.setAttribute('aria-label', `Go to photo ${index + 1}`)

			dot.addEventListener('click', () => {
				goToSlide(index)
			})

			dotsContainer.appendChild(dot)
		})

		updateSliderControls()
		updateSliderPosition()
	}

	function updateSliderPosition() {
		const slides = track.querySelectorAll('.transport-popup__slide')
		const dots = dotsContainer.querySelectorAll('.transport-popup__slider-dot')

		slides.forEach((slide, index) => {
			slide.classList.toggle(
				'transport-popup__slide--active',
				index === popupState.currentIndex,
			)
		})

		dots.forEach((dot, index) => {
			dot.classList.toggle(
				'transport-popup__slider-dot--active',
				index === popupState.currentIndex,
			)
		})

		const moveValue = popupState.currentIndex * 100
		track.style.transform = `translateX(-${moveValue}%)`
	}

	function updateSliderControls() {
		const hasMultipleSlides = popupState.images.length > 1

		prevButton.style.display = hasMultipleSlides ? '' : 'none'
		nextButton.style.display = hasMultipleSlides ? '' : 'none'
		dotsContainer.style.display = hasMultipleSlides ? 'flex' : 'none'
	}

	function goToSlide(index) {
		if (!popupState.images.length) {
			return
		}

		if (index < 0) {
			popupState.currentIndex = popupState.images.length - 1
		} else if (index >= popupState.images.length) {
			popupState.currentIndex = 0
		} else {
			popupState.currentIndex = index
		}

		updateSliderPosition()
	}

	function goToNextSlide() {
		goToSlide(popupState.currentIndex + 1)
	}

	function goToPrevSlide() {
		goToSlide(popupState.currentIndex - 1)
	}

	function setImagesFromCard(cardElement) {
		if (!cardElement) {
			return
		}

		const title = cardElement.dataset.transportTitle || 'Transport image'
		const imageList = cardElement.dataset.transportImages
		const fallbackImage =
			cardElement.dataset.transportImage || 'img/vehicle-bike.svg'

		let images = []

		if (imageList && imageList.trim() !== '') {
			images = imageList
				.split(',')
				.map(item => item.trim())
				.filter(Boolean)
		}

		if (!images.length) {
			images = [fallbackImage]
		}

		renderSlides(images, title)
	}

	prevButton.addEventListener('click', goToPrevSlide)
	nextButton.addEventListener('click', goToNextSlide)

	track.addEventListener('touchstart', event => {
		popupState.startX = event.touches[0].clientX
		popupState.isDragging = true
	})

	track.addEventListener('touchmove', event => {
		if (!popupState.isDragging) {
			return
		}

		const currentX = event.touches[0].clientX
		const diffX = popupState.startX - currentX

		if (Math.abs(diffX) > 50) {
			if (diffX > 0) {
				goToNextSlide()
			} else {
				goToPrevSlide()
			}

			popupState.isDragging = false
		}
	})

	track.addEventListener('touchend', () => {
		popupState.isDragging = false
	})

	window.transportPopupSlider = {
		setImagesFromCard,
	}
}
