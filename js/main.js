// 轮播图功能
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const cards = document.querySelectorAll('.card');
    const statNumbers = document.querySelectorAll('.stat-number');

    let currentSlide = 0;

    // 显示指定的幻灯片
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            dots[i].classList.remove('active');
        });
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    // 点击圆点切换
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });

    // 自动轮播
    if (slides.length > 0) {
        setInterval(() => {
            let nextIndex = (currentSlide + 1) % slides.length;
            showSlide(nextIndex);
        }, 5000);
    }

    // 移动端菜单
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // 数字动画
    function animateNumbers() {
        statNumbers.forEach((stat) => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    stat.textContent = target.toLocaleString();
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current).toLocaleString();
                }
            }, 16);
        });
    }

    // 滚动时触发数字动画
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                observer.disconnect();
            }
        });
    }, { threshold: 0.3 });

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        observer.observe(statsSection);
    }

    // 检测网页可用性
    async function checkUrlAvailability(url) {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 3000);
            
            const response = await fetch(url, {
                method: 'HEAD',
                signal: controller.signal,
                mode: 'cors'
            });
            
            clearTimeout(timeout);
            return response.ok;
        } catch {
            return false;
        }
    }

    // 智能跳转函数 - 先跳网页，失败再提示PDF
    async function navigateToContent(pdfUrl, webUrl) {
        const encodedPdfUrl = encodeURI(pdfUrl);
        
        // 如果没有网页URL，直接打开PDF
        if (!webUrl || webUrl.trim() === '') {
            window.open(encodedPdfUrl, '_blank');
            return;
        }
        
        // 尝试打开网页
        const newWindow = window.open(webUrl, '_blank');
        
        // 如果弹出窗口被阻止（返回null），提示用户并打开PDF
        if (!newWindow && pdfUrl) {
            if (confirm('浏览器阻止了弹窗，请点击确定打开PDF版本查看')) {
                window.open(encodedPdfUrl, '_blank');
            }
        }
        // 如果成功打开网页，就不再检测，用户可以正常浏览
    }

    // 卡片点击事件（带加载状态反馈）
    cards.forEach((card) => {
        card.addEventListener('click', async () => {
            // 添加加载状态
            card.style.opacity = '0.7';
            card.style.pointerEvents = 'none';
            
            const pdfUrl = card.getAttribute('data-pdf');
            const webUrl = card.getAttribute('data-url');
            
            await navigateToContent(pdfUrl, webUrl);
            
            // 恢复状态
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.pointerEvents = 'auto';
            }, 1000);
        });
    });

    // 平滑滚动（仅用于页内锚点）
    document.querySelectorAll('a[href="#contact"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 图片懒加载
    const lazyImages = document.querySelectorAll('.lazy-load');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');
                if (src) {
                    img.src = src;
                    img.classList.remove('lazy-load');
                }
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '100px'
    });

    lazyImages.forEach(img => imageObserver.observe(img));
});
