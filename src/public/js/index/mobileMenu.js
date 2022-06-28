const $mobileNavbar = document.querySelector('.mobileMenu')

const handleClick = () => {
    const $navList = document.querySelector('.navlist')
    const $body = document.body
    
    $navList.classList.toggle('active')
    $mobileNavbar.classList.toggle('active')

    $body.style.overflowY = $body.style.overflowY == 'hidden' ? '' : 'hidden'
}

const clickEvent = () => {
    $mobileNavbar.addEventListener("click", handleClick)
}

clickEvent()
