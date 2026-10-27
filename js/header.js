function initHeader() {
	const header = document.querySelector('.header')
	const burgerButton = document.querySelector('.header__burger')
	const mobileMenu = document.querySelector('.mobile-menu')
	const mobileMenuClose = document.querySelector('.mobile-menu__close')
	const mobileMenuOverlay = document.querySelector('.mobile-menu__overlay')
	const mobileMenuLinks = document.querySelectorAll('.mobile-menu__link')

	if (!header) {
		return
	}

	function handleScroll() {
		if (window.scrollY > 20) {
			header.classList.add('header--sticky')
		} else {
			header.classList.remove('header--sticky')
		}
	}

	function openMenu() {
		if (!mobileMenu || !burgerButton) {
			return
		}

		mobileMenu.classList.add('mobile-menu--open')
		document.body.classList.add('body--lock')
		burgerButton.setAttribute('aria-expanded', 'true')
	}

	function closeMenu() {
		if (!mobileMenu || !burgerButton) {
			return
		}

		mobileMenu.classList.remove('mobile-menu--open')
		document.body.classList.remove('body--lock')
		burgerButton.setAttribute('aria-expanded', 'false')
	}

	handleScroll()
	window.addEventListener('scroll', handleScroll)

	if (burgerButton) {
		burgerButton.addEventListener('click', openMenu)
	}

	if (mobileMenuClose) {
		mobileMenuClose.addEventListener('click', closeMenu)
	}

	if (mobileMenuOverlay) {
		mobileMenuOverlay.addEventListener('click', closeMenu)
	}

	mobileMenuLinks.forEach(link => {
		link.addEventListener('click', closeMenu)
	})

	window.addEventListener('resize', () => {
		if (window.innerWidth > 991) {
			closeMenu()
		}
	})

	document.addEventListener('keydown', event => {
		if (event.key === 'Escape') {
			closeMenu()
		}
	})
}
