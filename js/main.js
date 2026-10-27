document.addEventListener('DOMContentLoaded', () => {
	if (typeof initCallbackForm === 'function') {
		initCallbackForm()
	}

	if (typeof initHeroSlider === 'function') {
		initHeroSlider()
	}

	if (typeof initVehicleCarousels === 'function') {
		initVehicleCarousels()
	}

	if (typeof initHeader === 'function') {
		initHeader()
	}

	if (typeof initBookingForm === 'function') {
		initBookingForm()
	}

	if (typeof initTransportPopup === 'function') {
		initTransportPopup()
	}
})
