function initBookingForm() {
	const form = document.querySelector('#transport-booking-form')
	if (!form) return

	const popup = form.closest('.transport-popup')
	const start = form.elements.startDate
	const end = form.elements.endDate
	const name = form.elements.customerName
	const phone = form.elements.phone
	const status = form.querySelector('#transport-booking-status')

	// Use local calendar dates, avoiding UTC shifts on phones in other time zones.
	function calendarDate(date) {
		return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
	}

	function nextDay(value) {
		const [year, month, day] = value.split('-').map(Number)
		return calendarDate(new Date(year, month - 1, day + 1))
	}

	function validateDates() {
		const today = calendarDate(new Date())
		start.min = today
		end.min = nextDay(start.value && start.value >= today ? start.value : today)
		start.setCustomValidity(start.value && start.value < today ? 'Choose today or a future start date.' : '')
		end.setCustomValidity(end.value && end.value < end.min ? 'Choose an end date after the start date.' : '')
	}

	function validateContact() {
		name.setCustomValidity(name.value && !name.value.trim() ? 'Enter your name.' : '')
		const digits = phone.value.replace(/\D/g, '')
		const validPhone = /^\+?[\d\s().-]+$/.test(phone.value.trim()) && digits.length >= 7 && digits.length <= 15
		phone.setCustomValidity(phone.value && !validPhone ? 'Enter a phone number with 7 to 15 digits. Spaces, +, brackets and hyphens are allowed.' : '')
	}

	function validate() {
		validateDates()
		validateContact()
	}

	form.addEventListener('input', () => {
		status.textContent = ''
		validate()
	})
	form.addEventListener('change', validate)
	popup?.addEventListener('transport:open', () => {
		form.reset()
		status.textContent = ''
		validate()
	})
	form.addEventListener('submit', event => {
		event.preventDefault()
		validate()
		if (!form.reportValidity()) return
		// CRM integration point. Show success only after the CRM accepts a request.
		// The demo intentionally does not send, store, or log personal information.
		status.textContent = 'Your details are valid. This demo is not connected to booking yet, so your request has not been sent.'
	})
	validate()
}
