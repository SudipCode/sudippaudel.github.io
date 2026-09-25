let listVideo = document.querySelectorAll('.video-list .vid');
let mainVideo = document.querySelector('.main-video video');
let title = document.querySelector('.main-video .title');



listVideo.forEach(video=>{
video.onclick = () =>{
    listVideo.forEach(vid => vid.classList.remove('active'));
    video.classList.add('active')
    if(video.classList.contains('active')){
                    let src = video.children[0].getAttribute('src');
                    mainVideo.src=src
                    let text =video.children[1].innerHTML;
                    title.innerHTML =text;
    };
};

});

const youtubeGrid = document.querySelector('#youtube-grid');

const youtubeVideoIds = [];

const renderYoutubeVideos = () => {
    if (!youtubeGrid) {
        return;
    }

    youtubeGrid.innerHTML = '';
    youtubeVideoIds.forEach((videoId) => {
        const card = document.createElement('article');
        card.className = 'youtube-card';

        const frame = document.createElement('iframe');
        frame.src = `https://www.youtube.com/embed/${videoId}`;
        frame.title = 'YouTube video';
        frame.loading = 'lazy';
        frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        frame.allowFullscreen = true;

        const cardFooter = document.createElement('div');
        cardFooter.className = 'youtube-card-footer';

        const cardTitle = document.createElement('span');
        cardTitle.textContent = 'YouTube video';

        cardFooter.append(cardTitle);
        card.append(frame, cardFooter);
        youtubeGrid.append(card);
    });
};

if (youtubeGrid) {
    renderYoutubeVideos();
}