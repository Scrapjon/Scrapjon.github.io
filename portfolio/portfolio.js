function generateSlideshow(targetId, images, options = {}) {
    const container = document.getElementById(targetId);
    if (!container) return;

    const auto = options.auto ?? false;
    const delay = options.delay ?? 4000;

    let index = 0;
    let interval = null;

    // Create main wrapper
    const slideshow = document.createElement("div");
    slideshow.className = "slideshow-container";

    // Create slides
    images.forEach((src, i) => {
        const slide = document.createElement("div");
        slide.className = "mySlides fade";

        const number = document.createElement("div");
        number.className = "numbertext";
        number.textContent = `${i + 1} / ${images.length}`;

        const img = document.createElement("img");
        img.src = src;
        img.style.width = "100%";

        slide.appendChild(number);
        slide.appendChild(img);
        slideshow.appendChild(slide);
    });

    // Prev button
    const prev = document.createElement("a");
    prev.className = "prev";
    prev.innerHTML = "&#10094;";
    slideshow.appendChild(prev);

    // Next button
    const next = document.createElement("a");
    next.className = "next";
    next.innerHTML = "&#10095;";
    slideshow.appendChild(next);

    // Dots container
    const dotsWrapper = document.createElement("div");
    dotsWrapper.style.textAlign = "center";

    images.forEach(() => {
        const dot = document.createElement("span");
        dot.className = "dot";
        dotsWrapper.appendChild(dot);
    });

    container.appendChild(slideshow);
    container.appendChild(dotsWrapper);

    const slides = slideshow.querySelectorAll(".mySlides");
    const dots = dotsWrapper.querySelectorAll(".dot");

    function showSlide(n) {
        index = (n + slides.length) % slides.length;

        slides.forEach(slide => slide.style.display = "none");
        dots.forEach(dot => dot.classList.remove("active"));

        slides[index].style.display = "block";
        dots[index].classList.add("active");
    }

    function nextSlide() { showSlide(index + 1); }
    function prevSlide() { showSlide(index - 1); }

    prev.addEventListener("click", prevSlide);
    next.addEventListener("click", nextSlide);

    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => showSlide(i));
    });

    if (auto) {
        interval = setInterval(nextSlide, delay);

        slideshow.addEventListener("mouseenter", () => clearInterval(interval));
        slideshow.addEventListener("mouseleave", () => {
            interval = setInterval(nextSlide, delay);
        });
    }

    showSlide(0);
}

window.addEventListener("load", () => {
    generateSlideshow("dreamslayer-slideshow", [
        "images/Dreamslayer/Dreamslayer1.jpg",
        "images/Dreamslayer/Dreamslayer2.jpg",
        "images/Dreamslayer/Dreamslayer3.jpg",
        "images/Dreamslayer/Dreamslayer4.jpg"
    ], {
        auto: true,
        delay: 5000
    });

    generateSlideshow("icewall-slideshow", [
        "images/IceWall/IceWall1.jpg",
        "images/IceWall/IceWall2.jpg",
        "images/IceWall/IceWall3.jpg"
    ], {
        auto: true,
        delay: 5000
    })
});