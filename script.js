document.addEventListener('DOMContentLoaded', () => {
    // Parallax effect on hero visual elements
    const heroVisual = document.querySelector('.hero-visual');
    const mockupCard = document.querySelector('.mockup-card');
    
    if (heroVisual && mockupCard) {
        document.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
            
            mockupCard.style.transform = `perspective(1000px) rotateY(${xAxis - 15}deg) rotateX(${yAxis + 5}deg)`;
        });
    }

    // Interactive Bars in Dashboard Mockup
    const bars = document.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        bar.style.animationDelay = `${index * 0.2}s`;
    });

    // Smooth Scrolling for Nav Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar Scrolled State
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(13, 20, 36, 0.8)';
            navbar.style.boxShadow = '0 8px 32px 0 rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.background = 'rgba(13, 20, 36, 0.4)';
            navbar.style.boxShadow = '0 8px 32px 0 rgba(0, 0, 0, 0.3)';
        }
    });

    // Animate features on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(30px)";
        card.style.transition = `all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1) ${index * 0.1}s`;
        observer.observe(card);
    });
});
