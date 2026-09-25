
const getParticleThemeColor = () => getComputedStyle(document.body)
  .getPropertyValue('--theme-color')
  .trim() || '#0f766e';

const particleThemeColor = getParticleThemeColor();

particlesJS('particles-js',
  
  {
    "particles": {
      "number": {
        "value": 90,
        "density": {
          "enable": true,
          "value_area": 900
        }
      },
      "color": {
        "value": particleThemeColor
      },
      "shape": {
        "type": "star",
        "stroke": {
          "width": 0,
          "color": particleThemeColor
        },
        "polygon": {
          "nb_sides": 12
        },
        "image": {
          "src": "img/github.svg",
          "width": 100,
          "height": 100
        }
      },
      "opacity": {
        "value": 0.6,
        "random": false,
        "anim": {
          "enable": false,
          "speed": 1,
          "opacity_min": 1,
          "sync": false
        }
      },
      "size": {
        "value": 5,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 1000,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 250,
        "color": particleThemeColor,
        "opacity": .6,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 6,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "attract": {
          "enable": false,
          "rotateX": 800,
          "rotateY": 1300
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "repulse"
        },
        "onclick": {
          "enable": true,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 500,
          "line_linked": {
            "opacity": 6
          }
        },
        "bubble": {
          "distance": 500,
          "size": 40,
          "duration": 2,
          "opacity": 8,
          "speed": 4
        },
        "repulse": {
          "distance": 200
        },
        "push": {
          "particles_nb": 3
        },
        "remove": {
          "particles_nb": 1
        }
      }
    },
    "retina_detect": true,
    "config_demo": {
      "hide_card": false,
      "background_color": "#FFD700.",
      "background_image": "",
      "background_position": "40% 60%",
      "background_repeat": "repeat",
      "background_size": "cover"
    }
  }

);

window.updateParticleTheme = () => {
  const particles = window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS;

  if (!particles) {
    return;
  }

  const color = getParticleThemeColor();
  particles.particles.color.value = color;
  particles.particles.line_linked.color = color;

  if (particles.fn && particles.fn.particlesRefresh) {
    particles.fn.particlesRefresh();
  }
};