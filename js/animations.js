// 专业级动效系统 - 基于UI/UX最佳实践优化
(function() {
    // 检测用户是否偏好减少动画
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // ==================== 自定义缓动函数 ====================
    const easings = {
        easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
        easeIn: 'cubic-bezier(0.55, 0, 1, 0.45)',
        easeInOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    };

    // ==================== 鼠标跟随光效增强 ====================
    if (!prefersReducedMotion) {
        const cursorGlow = document.createElement('div');
        cursorGlow.id = 'cursor-glow';
        cursorGlow.style.cssText = `
            position: fixed;
            width: 400px;
            height: 400px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(0, 102, 204, 0.08) 0%, rgba(255, 193, 7, 0.05) 40%, transparent 70%);
            pointer-events: none;
            z-index: 9998;
            transform: translate(-50%, -50%);
            transition: opacity 0.4s ${easings.easeOut};
            mix-blend-mode: screen;
            will-change: transform;
        `;
        document.body.appendChild(cursorGlow);
        
        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;
        let isVisible = true;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            isVisible = true;
            cursorGlow.style.opacity = '1';
            
            clearTimeout(hideGlowTimeout);
            const hideGlowTimeout = setTimeout(() => {
                cursorGlow.style.opacity = '0';
                isVisible = false;
            }, 3000);
        });
        
        function animateGlow() {
            glowX += (mouseX - glowX) * 0.08;
            glowY += (mouseY - glowY) * 0.08;
            cursorGlow.style.transform = `translate(${glowX - 200}px, ${glowY - 200}px)`;
            requestAnimationFrame(animateGlow);
        }
        animateGlow();
    }

    // ==================== 按钮涟漪点击效果优化 ====================
    document.addEventListener('click', function(e) {
        const target = e.target.closest('button, a, .card, .btn, .btn-primary, .btn-secondary');
        if (!target) return;
        
        const rect = target.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x - size/2}px;
            top: ${y - size/2}px;
            background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 50%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: rippleEffect 0.6s ${easings.easeOut} forwards;
            pointer-events: none;
            z-index: 100;
        `;
        
        target.style.position = target.style.position || 'relative';
        target.style.overflow = 'hidden';
        target.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });

    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes rippleEffect {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(2.5);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // ==================== 滚动触发动画系统 ====================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 60); // 交错动画，每个元素延迟60ms
                animationObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 观察所有需要动画的元素
    const animateElements = document.querySelectorAll(
        '.section-header, .card, .stat-card, .slide-content, .hero-content, .feature-item, .stats-section, .team-member, .article-container'
    );
    animateElements.forEach(el => {
        el.classList.add('animate-ready');
        animationObserver.observe(el);
    });

    // 滚动动画样式
    const scrollStyle = document.createElement('style');
    scrollStyle.textContent = `
        /* 动画基础状态 */
        .animate-ready {
            opacity: 0;
            transition: opacity 0.6s ${easings.easeOut}, transform 0.6s ${easings.easeOut};
        }
        
        .animate-in {
            opacity: 1;
            transform: translateY(0) rotateX(0) scale(1);
        }
        
        /* 不同元素的入场动画 */
        .animate-ready.fade-in {
            transform: translateY(40px);
        }
        
        .animate-ready.slide-up {
            transform: translateY(60px);
        }
        
        .animate-ready.slide-left {
            transform: translateX(40px);
        }
        
        .animate-ready.slide-right {
            transform: translateX(-40px);
        }
        
        .animate-ready.scale-in {
            transform: scale(0.9);
        }
        
        .animate-ready.fade-scale {
            transform: translateY(30px) scale(0.95);
        }
        
        .section-header.animate-ready {
            transform: translateY(50px) scale(0.95);
        }
        
        .card.animate-ready {
            transform: translateY(50px) rotateX(5deg);
            transform-origin: center bottom;
        }
        
        .stat-card.animate-ready {
            transform: translateY(30px) scale(0.9);
        }
        
        .slide-content.animate-ready {
            transform: translateY(80px);
        }
        
        .hero-content.animate-ready {
            transform: translateY(30px);
        }
        
        .feature-item.animate-ready {
            transform: translateY(40px);
        }
        
        .stats-section.animate-ready {
            transform: translateY(30px) scale(0.95);
        }
        
        .team-member.animate-ready {
            transform: translateY(40px);
        }
        
        .article-container.animate-ready {
            transform: translateY(20px);
        }
        
        /* 数字递增动画 */
        .animate-number {
            display: inline-block;
        }
        
        /* 图片悬浮放大 */
        .card-image img, .slide img, .article-content img {
            transition: transform 0.5s ${easings.spring}, filter 0.3s ${easings.easeOut};
            will-change: transform;
        }
        
        .card-image img:hover, .slide img:hover, .article-content img:hover {
            transform: scale(1.08);
            filter: brightness(1.05) saturate(1.1);
        }
        
        .card-image {
            overflow: hidden;
            border-radius: inherit;
        }
        
        /* 卡片悬浮效果 */
        .card {
            transition: transform 0.4s ${easings.spring}, box-shadow 0.4s ${easings.easeOut};
            will-change: transform;
        }
        
        .card:hover {
            transform: translateY(-8px) scale(1.01);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
        }
        
        /* 按钮悬浮效果 */
        .btn, .btn-primary, .btn-secondary {
            transition: transform 0.2s ${easings.spring}, box-shadow 0.2s ${easings.easeOut}, background 0.2s ${easings.easeOut};
        }
        
        .btn:hover, .btn-primary:hover, .btn-secondary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 50, 100, 0.3);
        }
        
        .btn:active, .btn-primary:active, .btn-secondary:active {
            transform: translateY(0);
        }
        
        /* 导航链接悬浮效果 */
        .nav-links a {
            transition: color 0.2s ${easings.easeOut}, transform 0.2s ${easings.easeOut};
        }
        
        .nav-links a:hover {
            color: var(--secondary-color);
            transform: translateY(-1px);
        }
        
        /* 响应式调整 */
        @media (prefers-reduced-motion: reduce) {
            .animate-ready {
                opacity: 1;
                transform: none;
                transition: none;
            }
            
            .card, .btn, .nav-links a, img {
                transition: none !important;
            }
            
            .card:hover, .btn:hover {
                transform: none;
            }
        }
    `;
    document.head.appendChild(scrollStyle);

    // ==================== 数字递增动画 ====================
    function animateNumbers() {
        const numberElements = document.querySelectorAll('.stat-number, .animate-number');
        numberElements.forEach(el => {
            const target = parseInt(el.dataset.target) || parseInt(el.textContent.replace(/[^0-9]/g, ''));
            const duration = 2000;
            const steps = 60;
            const increment = target / steps;
            let current = 0;
            let hasAnimated = false;
            
            // 初始化显示为0
            el.textContent = '0';
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !hasAnimated) {
                        hasAnimated = true;
                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= target) {
                                current = target;
                                clearInterval(timer);
                            }
                            el.textContent = Math.floor(current).toLocaleString();
                        }, duration / steps);
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });
            
            observer.observe(el);
        });
    }
    animateNumbers();

    // ==================== 导航栏滚动增强 ====================
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    let ticking = false;
    
    function updateNavbar(currentScroll) {
        if (currentScroll > 80) {
            navbar.style.background = 'rgba(0, 50, 100, 0.98)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(0, 50, 100, 0.95)';
            navbar.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.15)';
        }
        
        // 滚动隐藏导航栏
        if (currentScroll > lastScroll && currentScroll > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateNavbar(currentScroll);
            });
            ticking = true;
        }
    });
    
    // 设置导航栏过渡效果
    if (navbar) {
        navbar.style.transition = `transform 0.35s ${easings.easeOut}, background 0.3s ${easings.easeOut}, box-shadow 0.3s ${easings.easeOut}`;
    }

    // ==================== 卡片悬浮增强 ====================
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        let isHovered = false;
        
        card.addEventListener('mouseenter', () => {
            isHovered = true;
            card.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', () => {
            isHovered = false;
            setTimeout(() => {
                if (!isHovered) {
                    card.style.zIndex = '';
                }
            }, 400);
        });
    });

    // ==================== 打字机效果增强 ====================
    const typewriterElements = document.querySelectorAll('[data-typewriter]');
    typewriterElements.forEach(el => {
        const text = el.textContent;
        const speed = parseInt(el.dataset.typewriterSpeed) || 60;
        el.textContent = '';
        el.style.borderRight = '2px solid var(--secondary-color)';
        el.style.paddingRight = '4px';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                el.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            } else {
                el.style.borderRight = 'none';
                el.style.paddingRight = '0';
            }
        };
        
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !prefersReducedMotion) {
                typeWriter();
                observer.disconnect();
            }
        }, { threshold: 0.5 });
        observer.observe(el);
    });

    // ==================== 页面加载淡入效果 ====================
    document.addEventListener('DOMContentLoaded', () => {
        document.body.style.opacity = '0';
        document.body.style.transition = `opacity 0.8s ${easings.easeOut}`;
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });

    // ==================== 平滑滚动到锚点 ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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

    console.log('🎨 专业级动效系统初始化完成');
})();
