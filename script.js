// 1. Animación de apertura (Solucionado para que nunca se quede bloqueado)
window.addEventListener('load', () => {
    const opening = document.getElementById('opening');
    if (opening) {
        setTimeout(() => {
            opening.classList.add('hide');
            setTimeout(() => {
                opening.style.display = 'none';
            }, 500);
        }, 450);
    }
});

// 2. Animación al hacer scroll
const obs = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
    }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(x => obs.observe(x));

// 3. Reemplazar Infografía
const infographicInput = document.getElementById('infographicInput');
const infographicImage = document.getElementById('infographicImage');
if (infographicInput && infographicImage) {
    infographicInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            infographicImage.src = URL.createObjectURL(file);
        }
    });
}

// 4. Gestión del Vídeo (Local o Enlace de YouTube/Vimeo)
const videoInput = document.getElementById('videoInput');
const videoUrl = document.getElementById('videoUrl');
const setVideoUrlBtn = document.getElementById('setVideoUrl');
const videoFrame = document.getElementById('videoFrame');

if (videoInput) {
    videoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const videoUrlObj = URL.createObjectURL(file);
            videoFrame.innerHTML = `<video controls style="width: 100%; height: 100%; border-radius: 4px;"><source src="${videoUrlObj}" type="${file.type}">Tu navegador no soporta vídeos.</video>`;
        }
    });
}

if (setVideoUrlBtn && videoUrl) {
    setVideoUrlBtn.addEventListener('click', () => {
        let url = videoUrl.value.trim();
        if (!url) return;
        
        // Convertir enlaces de YouTube normales a modo embebido si es necesario
        if (url.includes('youtube.com/watch?v=')) {
            url = url.replace('watch?v=', 'embed/');
        } else if (url.includes('youtu.be/')) {
            url = url.replace('youtu.be/', 'www.youtube.com/embed/');
        }

        videoFrame.innerHTML = `<iframe src="${url}" style="width: 100%; height: 100%; border: 0; border-radius: 4px;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    });
}

// 5. Carrusel interactivo de las 9 diapositivas con pantalla completa
document.addEventListener("DOMContentLoaded", function () {
    const slides = [
        "assets/diapositiva1.jpg",
        "assets/diapositiva2.jpg",
        "assets/diapositiva3.jpg",
        "assets/diapositiva4.jpg",
        "assets/diapositiva5.jpg",
        "assets/diapositiva6.jpg",
        "assets/diapositiva7.jpg",
        "assets/diapositiva8.jpg",
        "assets/diapositiva9.jpg"
    ];

    let currentSlide = 0;
    const viewer = document.getElementById('presentationViewer');
    const carouselImg = document.getElementById('carouselImage');
    const slideIndicator = document.getElementById('slideIndicator');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const slideSelector = document.getElementById('slideSelector');

    function updateSlide() {
        if (!carouselImg) return;
        carouselImg.src = slides[currentSlide];
        if (slideIndicator) {
            slideIndicator.textContent = `${currentSlide + 1} / ${slides.length}`;
        }
        
        if (slideSelector) {
            [...slideSelector.children].forEach((btn, idx) => {
                if (idx === currentSlide) {
                    btn.style.background = '#333';
                    btn.style.color = '#fff';
                } else {
                    btn.style.background = '#e5e5e5';
                    btn.style.color = '#333';
                }
            });
        }
    }

    if (slideSelector) {
        slideSelector.innerHTML = "";
        slides.forEach((_, idx) => {
            const btn = document.createElement('button');
            btn.textContent = idx + 1;
            btn.style.cssText = 'width: 32px; height: 32px; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; font-size: 0.85rem; transition: background 0.2s;';
            btn.onclick = () => {
                currentSlide = idx;
                updateSlide();
            };
            slideSelector.appendChild(btn);
        });
        updateSlide();
    }

    if (prevBtn && nextBtn) {
        prevBtn.onclick = () => {
            currentSlide = (currentSlide === 0) ? slides.length - 1 : currentSlide - 1;
            updateSlide();
        };

        nextBtn.onclick = () => {
            currentSlide = (currentSlide === slides.length - 1) ? 0 : currentSlide + 1;
            updateSlide();
        };
    }

    if (fullscreenBtn && viewer) {
        fullscreenBtn.onclick = () => {
            if (!document.fullscreenElement) {
                viewer.requestFullscreen().catch(() => alert('Tu navegador bloqueó la pantalla completa.'));
            } else {
                document.exitFullscreen();
            }
        };

        document.addEventListener('fullscreenchange', () => {
            fullscreenBtn.textContent = document.fullscreenElement ? '✕ Salir de pantalla completa' : '⛶ Pantalla completa';
        });
    }

    document.addEventListener('keydown', e => {
        if (document.fullscreenElement === viewer) {
            if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
            if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
        }
    });
});