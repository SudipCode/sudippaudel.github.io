let menu = document.querySelector('#menu-bars');
let header = document.querySelector('header');

menu.onclick = () =>{
    menu.classList.toggle('fa-times');
    header.classList.toggle('active');
}

window.onscroll = () =>{
    menu.classList.remove('fa-times');
    header.classList.remove('active');
};

var typed = new Typed('.typing-text', {
    strings : ['front end developer', 'Sub-overseer', 'Web designer', 'graphic designer', 'web developer' ],
    loop : true,
    typeSpeed : 30
});

VanillaTilt.init(document.querySelectorAll('.tilt'),{
    max:30
});

window.addEventListener('load', () => {
    const header2 = document.querySelector('.header .header-2');

    if (header2) {
      if (window.scrollY > 80) {
        header2.classList.add('active');
      } else {
        header2.classList.remove('active');
      }
    }
});
  