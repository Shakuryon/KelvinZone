document.addEventListener('DOMContentLoaded', () => {
    const mainNav = document.getElementById('navbarCont');
    const scrollThres = 30; // N of pixels before transformin'

    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThres) {
            mainNav.classList.add('scrolled');
            
        }

        else {
            mainNav.classList.remove('scrolled');
        }
    })

    const title = document.title;
    let i = 0;

    function typeTitle() {
        document.title = title.slice(0, i++);
        if (i <= title.length) {
            setTimeout(typeTitle, 95);
        }
    }

    typeTitle();
})