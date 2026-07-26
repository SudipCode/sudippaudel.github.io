function loader(){
    document.querySelector('.loader-container').classList.add('fade-out');
}

function fadeOut(){
    setTimeout(loader,3000);
}

window.addEventListener('load', fadeOut);