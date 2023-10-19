import './top_nav.css'

document.querySelector('#top-nav').innerHTML = `
<nav class="navigation-bar">
    <ul>
        <li class="navigation-item">
            <a class="nav-link" href="/">Home</a>
        </li>
        <li class="navigation-item">
            <a class="nav-link" href="/pages/dot_maker.html">Dot Maker</a>
        </li>
        <li class="navigation-item">
            <a class="nav-link" href="https://enantoka.github.io/Practice-1/">Abstract</a>
        </li>
    </ul>
</nav>
`

const links = document.querySelectorAll('.navigation-bar ul li a');
links.forEach(link => {
    if(location.pathname === link.pathname) {
        setLinkActive(link);
    }
})

function setLinkActive(element) {
    element.classList.toggle('active');
}
