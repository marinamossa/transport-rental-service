function initHeroSlider() {
	const heroSection = document.querySelector('.hero')

	if (!heroSection) {
		return
	}

	const slides = heroSection.querySelectorAll('.hero__slide')
	const dots = heroSection.querySelectorAll('.slider-pagination__dot')

	if (!slides.length) {
		return
	}

	let currentIndex = 0
	let sliderTimer = null
	const autoplayDelay = 5000

	function setActiveSlide(index) {
		slides.forEach((slide, slideIndex) => {
			slide.classList.toggle('hero__slide--active', slideIndex === index)
		})

		dots.forEach((dot, dotIndex) => {
			dot.classList.toggle('slider-pagination__dot--active', dotIndex === index)
		})

		currentIndex = index
	}

	function nextSlide() {
		const nextIndex = (currentIndex + 1) % slides.length
		setActiveSlide(nextIndex)
	}

	function startAutoplay() {
		stopAutoplay()
		sliderTimer = setInterval(nextSlide, autoplayDelay)
	}

	function stopAutoplay() {
		if (sliderTimer) {
			clearInterval(sliderTimer)
			sliderTimer = null
		}
	}

	dots.forEach((dot, index) => {
		dot.addEventListener('click', () => {
			setActiveSlide(index)
			startAutoplay()
		})
	})

	heroSection.addEventListener('mouseenter', stopAutoplay)
	heroSection.addEventListener('mouseleave', startAutoplay)

	setActiveSlide(0)
	startAutoplay()
}
