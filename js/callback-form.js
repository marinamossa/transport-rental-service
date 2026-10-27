function initCallbackForm() {
    const form = document.querySelector('.callback__form')
    if (!form) return
    const phone = form.querySelector('[name="phone"]')
    const status = form.querySelector('.callback__status')
    function validatePhone() {
        const value = phone.value.trim()
        const digits = value.replace(/\D/g, '')
        const valid = /^\+?[0-9() .-]+$/.test(value) && digits.length >= 7 && digits.length <= 15
        phone.setCustomValidity(!value || valid ? '' : 'Please enter a valid phone number (7–15 digits).')
    }
    phone.addEventListener('input', () => {
        validatePhone()
        status.textContent = 'Preview form · sending is not connected yet.'
    })
    form.addEventListener('submit', event => {
        // UI preview only. No phone number is sent or stored.
        event.preventDefault()
        validatePhone()
        if (!form.reportValidity()) return
        status.textContent = 'This form is a preview. Your request has not been sent.'
    })
}
