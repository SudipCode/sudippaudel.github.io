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

if (document.querySelector('.typing-text')) {
  var typed = new Typed('.typing-text', {
    strings : ['front end developer', 'Sub-overseer', 'Web designer', 'graphic designer', 'web developer' ],
    loop : true,
    typeSpeed : 30
  });
}

if (typeof VanillaTilt !== 'undefined') {
  VanillaTilt.init(document.querySelectorAll('.tilt'),{
    max:30
  });
}

const skillsSection = document.querySelector('.Design');

const animateSkillValues = () => {
  document.querySelectorAll('.progress h3 span[data-value]').forEach((label) => {
    label.textContent = '0%';
  });

  document.querySelectorAll('.progress h3 span[data-value]').forEach((label) => {
    const target = Number(label.dataset.value);
    const start = performance.now();

    const updateLabel = (now) => {
      const progress = Math.min((now - start) / 2000, 1);
      label.textContent = `${Math.round(target * progress)}%`;
      if (progress < 1) {
        requestAnimationFrame(updateLabel);
      }
    };

    requestAnimationFrame(updateLabel);
  });

};

const replaySkillAnimation = () => {
  skillsSection.classList.remove('is-visible');
  void skillsSection.offsetWidth;
  skillsSection.classList.add('is-visible');
  animateSkillValues();
};

if (skillsSection && 'IntersectionObserver' in window) {
  const skillsObserver = new IntersectionObserver((entries, observer) => {
    if (entries[0].isIntersecting) {
      skillsSection.classList.add('is-visible');
      animateSkillValues();
      setInterval(replaySkillAnimation, 20000);
      observer.disconnect();
    }
  }, { threshold: 0.2 });

  skillsObserver.observe(skillsSection);
} else if (skillsSection) {
  skillsSection.classList.add('is-visible');
  animateSkillValues();
    setInterval(replaySkillAnimation, 20000);
}

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
  