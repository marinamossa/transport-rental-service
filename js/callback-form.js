function initCallbackForm() {
    document.querySelectorAll('.callback__form').forEach(form => {
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
            status.textContent = ''
        })
        form.addEventListener('submit', event => {
            event.preventDefault()
            validatePhone()
            if (!form.reportValidity()) return
            status.textContent = 'Online callback requests are unavailable. Please contact us by phone or email.'
        })
    })

    initCallbackPopup()
}

function initCallbackPopup() {
    const popup = document.querySelector('.callback-popup')
    if (!popup) return

    const sessionKey = 'heng-rental-callback-shown'
    try {
        if (sessionStorage.getItem(sessionKey)) return
    } catch {
        // The popup still works when storage is blocked.
    }

    const close = () => { popup.hidden = true }
    popup.querySelector('.callback-popup__close').addEventListener('click', close)
    popup.addEventListener('keydown', event => {
        if (event.key === 'Escape') close()
    })

    function showPopup() {
        if (document.hidden || document.body.classList.contains('body--lock') ||
            document.activeElement?.closest('.callback__form')) {
            window.setTimeout(showPopup, 1000)
            return
        }

        popup.hidden = false
        try {
            sessionStorage.setItem(sessionKey, '1')
        } catch {
            // The timer runs only once on this page.
        }
    }

    const schedule = () => window.setTimeout(showPopup, 20000)
    if (document.readyState === 'complete') {
        schedule()
    } else {
        window.addEventListener('load', schedule, { once: true })
    }
}
