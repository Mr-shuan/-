// 结对帮扶页面脚本
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const projectCards = document.querySelectorAll('.project-card');
    const newsItems = document.querySelectorAll('.news-item');

    // 检查URL可用性
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
            // 如果CORS失败，尝试用其他方式检测
            try {
                const img = new Image();
                const promise = new Promise((resolve) => {
                    img.onload = () => resolve(true);
                    img.onerror = () => resolve(false);
                    setTimeout(() => resolve(false), 3000);
                });
                img.src = url;
                return await promise;
            } catch {
                return false;
            }
        }
    }

    // 智能跳转函数
    async function smartNavigate(pdfPath, url) {
        const encodedPath = encodeURI(pdfPath);
        
        // 如果没有网页URL，直接打开PDF
        if (!url || url.trim() === '') {
            window.open(encodedPath, '_blank');
            return;
        }
        
        // 先检测URL是否可访问
        const isAvailable = await checkUrlAvailability(url);
        
        if (isAvailable) {
            // URL可访问，打开网页
            window.open(url, '_blank');
        } else {
            // URL不可访问，提示打开PDF
            if (confirm('网页访问失败（403/404等），是否打开PDF版本查看？')) {
                window.open(encodedPath, '_blank');
            }
        }
    }

    // 汉堡菜单切换
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // 卡片点击跳转
    projectCards.forEach(card => {
        card.addEventListener('click', async () => {
            const pdfPath = card.getAttribute('data-pdf');
            const url = card.getAttribute('data-url');
            await smartNavigate(pdfPath, url);
        });
    });

    // 新闻列表点击跳转（阻止默认行为）
    newsItems.forEach(item => {
        const link = item.querySelector('.news-link');
        if (link) {
            link.addEventListener('click', async (e) => {
                e.preventDefault(); // 阻止默认跳转
                e.stopPropagation(); // 阻止事件冒泡
                const pdfPath = item.getAttribute('data-pdf');
                const url = link.getAttribute('href');
                await smartNavigate(pdfPath, url);
            });
        }
    });

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});