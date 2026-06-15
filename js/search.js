// 搜索功能 - 动态获取页面内容，支持HTML/PDF双跳转
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const searchModal = document.getElementById('searchModal');
    const searchClose = document.getElementById('searchClose');
    const searchResults = document.getElementById('searchResults');

    // 页面分类映射
    const pageCategory = {
        'index.html': '首页',
        'rural-education.html': '乡村支教',
        'pairing-help.html': '结对帮扶',
        'sports.html': '十五运会'
    };

    // PDF文件映射 - 标题关键字对应PDF路径
    const pdfMapping = {
        // 01.20240825.青春为中国式现代化挺膺担当丨"我带乡里的孩子一起玩无人机"！.pdf
        '青春为中国式现代化挺膺担当': 'pdf/01.20240825.青春为中国式现代化挺膺担当丨"我带乡里的孩子一起玩无人机"！.pdf',
        '我带乡里的孩子一起玩无人机': 'pdf/01.20240825.青春为中国式现代化挺膺担当丨"我带乡里的孩子一起玩无人机"！.pdf',

        // 02.20240902.莲梦启航：扬帆于莲花盛放的智慧海洋.pdf
        '莲梦启航': 'pdf/02.20240902.莲梦启航：扬帆于莲花盛放的智慧海洋.pdf',

        // 03.20241025.莲塘清韵伴科教，携手共筑乡村梦.pdf
        '莲塘清韵伴科教': 'pdf/03.20241025.莲塘清韵伴科教，携手共筑乡村梦.pdf',
        '携手共筑乡村梦': 'pdf/03.20241025.莲塘清韵伴科教，携手共筑乡村梦.pdf',

        // 04.20250711.出征！广州应用科技学院"柳韵数兴"实践队携手湛江市那柳村共话2025"三下乡" - 大学生云报.pdf
        '出征': 'pdf/04.20250711.出征！广州应用科技学院"柳韵数兴"实践队携手湛江市那柳村共话2025"三下乡" - 大学生云报.pdf',
        '柳韵数兴': 'pdf/04.20250711.出征！广州应用科技学院"柳韵数兴"实践队携手湛江市那柳村共话2025"三下乡" - 大学生云报.pdf',
        '共话2025三下乡': 'pdf/04.20250711.出征！广州应用科技学院"柳韵数兴"实践队携手湛江市那柳村共话2025"三下乡" - 大学生云报.pdf',

        // 05.20250713.百千万工程 _"柳韵数兴"实践队与那柳村共话非遗蛤蒌粽传承 - 大学生云报.pdf
        '百千万工程': 'pdf/05.20250713.百千万工程 _"柳韵数兴"实践队与那柳村共话非遗蛤蒌粽传承 - 大学生云报.pdf',
        '非遗蛤蒌粽': 'pdf/05.20250713.百千万工程 _"柳韵数兴"实践队与那柳村共话非遗蛤蒌粽传承 - 大学生云报.pdf',
        '共话非遗蛤蒌粽传承': 'pdf/05.20250713.百千万工程 _"柳韵数兴"实践队与那柳村共话非遗蛤蒌粽传承 - 大学生云报.pdf',

        // 06.20250714.青春"数"绘乡村美！大学生实践队助力那柳村文化"出圈"_南方+_南方plus.pdf
        '青春数绘乡村美': 'pdf/06.20250714.青春"数"绘乡村美！大学生实践队助力那柳村文化"出圈"_南方+_南方plus.pdf',
        '文化出圈': 'pdf/06.20250714.青春"数"绘乡村美！大学生实践队助力那柳村文化"出圈"_南方+_南方plus.pdf',

        // 07.20250721.数字赋能，古村焕新！广应科"柳韵数兴"实践队为那柳村注入"青春动能"_湛江云媒（湛江新闻网）.pdf
        '数字赋能': 'pdf/07.20250721.数字赋能，古村焕新！广应科"柳韵数兴"实践队为那柳村注入"青春动能"_湛江云媒（湛江新闻网）.pdf',
        '古村焕新': 'pdf/07.20250721.数字赋能，古村焕新！广应科"柳韵数兴"实践队为那柳村注入"青春动能"_湛江云媒（湛江新闻网）.pdf',
        '青春动能': 'pdf/07.20250721.数字赋能，古村焕新！广应科"柳韵数兴"实践队为那柳村注入"青春动能"_湛江云媒（湛江新闻网）.pdf',

        // 08.20250722.广州应用科技学院师生前往湛江那柳村调研.pdf
        '师生前往湛江那柳村调研': 'pdf/08.20250722.广州应用科技学院师生前往湛江那柳村调研.pdf',

        // 09.20250724."百千万工程"突击队 _ 广州应用科技学院"柳韵教兴"实践队赴湖光镇那柳村开展多元化实践服务活动.pdf
        '百千万工程突击队': 'pdf/09.20250724."百千万工程"突击队 _ 广州应用科技学院"柳韵教兴"实践队赴湖光镇那柳村开展多元化实践服务活动.pdf',
        '柳韵教兴': 'pdf/09.20250724."百千万工程"突击队 _ 广州应用科技学院"柳韵教兴"实践队赴湖光镇那柳村开展多元化实践服务活动.pdf',
        '多元化实践服务': 'pdf/09.20250724."百千万工程"突击队 _ 广州应用科技学院"柳韵教兴"实践队赴湖光镇那柳村开展多元化实践服务活动.pdf',

        // 10.20250801.百千万工程 _ 聆听峥嵘岁月 共守初心使命——广州应用科技学院"柳韵数兴"实践队采访湛江市那柳村退伍老党员 - 大学生云报.pdf
        '聆听峥嵘岁月': 'pdf/10.20250801.百千万工程 _ 聆听峥嵘岁月 共守初心使命——广州应用科技学院"柳韵数兴"实践队采访湛江市那柳村退伍老党员 - 大学生云报.pdf',
        '退伍老党员': 'pdf/10.20250801.百千万工程 _ 聆听峥嵘岁月 共守初心使命——广州应用科技学院"柳韵数兴"实践队采访湛江市那柳村退伍老党员 - 大学生云报.pdf',
        '共守初心使命': 'pdf/10.20250801.百千万工程 _ 聆听峥嵘岁月 共守初心使命——广州应用科技学院"柳韵数兴"实践队采访湛江市那柳村退伍老党员 - 大学生云报.pdf',

        // 11.20250801.百千万工程 _ 聆听峥嵘岁月 共守初心使命——广州应用科技学院"柳韵数兴"实践队采访湛江市那柳村退伍老党员 - 科教在线.pdf
        '聆听峥嵘岁月科教在线': 'pdf/11.20250801.百千万工程 _ 聆听峥嵘岁月 共守初心使命——广州应用科技学院"柳韵数兴"实践队采访湛江市那柳村退伍老党员 - 科教在线.pdf',

        // 12.20250803.百千万工程 _"持家本领"带出乡村振兴"她"力量——广州应用科技学院实践队对话"全国三八红旗手"许东微 - 大学生云报.pdf
        '持家本领': 'pdf/12.20250803.百千万工程 _"持家本领"带出乡村振兴"她"力量——广州应用科技学院实践队对话"全国三八红旗手"许东微 - 大学生云报.pdf',
        '全国三八红旗手': 'pdf/12.20250803.百千万工程 _"持家本领"带出乡村振兴"她"力量——广州应用科技学院实践队对话"全国三八红旗手"许东微 - 大学生云报.pdf',
        '许东微': 'pdf/12.20250803.百千万工程 _"持家本领"带出乡村振兴"她"力量——广州应用科技学院实践队对话"全国三八红旗手"许东微 - 大学生云报.pdf',

        // 13.20250803.百千万工程 _"持家本领"带出乡村振兴"她"力量——广州应用科技学院实践队对话"全国三八红旗手"许东微 - - 基层网.pdf
        '持家本领基层网': 'pdf/13.20250803.百千万工程 _"持家本领"带出乡村振兴"她"力量——广州应用科技学院实践队对话"全国三八红旗手"许东微 - - 基层网.pdf',

        // 14.20250811.广州应用科技学院学子携手那柳村共话非遗蛤蒌粽传承.pdf
        '学子携手那柳村': 'pdf/14.20250811.广州应用科技学院学子携手那柳村共话非遗蛤蒌粽传承.pdf',

        // 15.20250821.广州应用科技学院：聆听峥嵘岁月，共守初心使命.pdf
        '聆听峥嵘岁月共守初心使命': 'pdf/15.20250821.广州应用科技学院：聆听峥嵘岁月，共守初心使命.pdf',

        // 16.20250822."持家本领"带出乡村振兴"她"力量：广州应用科技学院学子对话"全国三八红旗手"许东微.pdf
        '持家本领广州应用科技学院学子': 'pdf/16.20250822."持家本领"带出乡村振兴"她"力量：广州应用科技学院学子对话"全国三八红旗手"许东微.pdf',

        // 17.20250829.百千万工程 _广州应用科技学院：人工智能下乡，科技助力民生 - 大学生云报.pdf
        '人工智能下乡': 'pdf/17.20250829.百千万工程 _广州应用科技学院：人工智能下乡，科技助力民生 - 大学生云报.pdf',
        '人工智能下乡大学生云报': 'pdf/17.20250829.百千万工程 _广州应用科技学院：人工智能下乡，科技助力民生 - 大学生云报.pdf',

        // 18.20250831.百千万工程 _ 广州应用科技学院"柳韵数兴"实践队：科技赋能乡村振兴，多元实践绘就那柳村新画卷 - 大学生云报.pdf
        '柳韵数兴实践队科技赋能乡村振兴': 'pdf/18.20250831.百千万工程 _ 广州应用科技学院"柳韵数兴"实践队：科技赋能乡村振兴，多元实践绘就那柳村新画卷 - 大学生云报.pdf',
        '多元实践绘就那柳村新画卷': 'pdf/18.20250831.百千万工程 _ 广州应用科技学院"柳韵数兴"实践队：科技赋能乡村振兴，多元实践绘就那柳村新画卷 - 大学生云报.pdf',

        // 19.20250908.广州应用科技学院：人工智能下乡，科技助力民生.pdf
        '人工智能下乡科技助力民生': 'pdf/19.20250908.广州应用科技学院：人工智能下乡，科技助力民生.pdf',

        // 20.20250915.广州应用科技学院：对话"湛江好人"，致敬最可爱的人.pdf
        '对话湛江好人': 'pdf/20.20250915.广州应用科技学院：对话"湛江好人"，致敬最可爱的人.pdf',
        '湛江好人': 'pdf/20.20250915.广州应用科技学院：对话"湛江好人"，致敬最可爱的人.pdf',
        '致敬最可爱的人': 'pdf/20.20250915.广州应用科技学院：对话"湛江好人"，致敬最可爱的人.pdf',

        // 21.20250922.广州应用科技学院：喜迎十五运，志愿挺担当.pdf
        '喜迎十五运': 'pdf/21.20250922.广州应用科技学院：喜迎十五运，志愿挺担当.pdf',
        '志愿挺担当': 'pdf/21.20250922.广州应用科技学院：喜迎十五运，志愿挺担当.pdf',

        // 22.20251013.广州应用科技学院：科技赋能乡村振兴，多元实践绘就那柳村新画卷.pdf
        '科技赋能乡村振兴多元实践': 'pdf/22.20251013.广州应用科技学院：科技赋能乡村振兴，多元实践绘就那柳村新画卷.pdf',

        // 23.20251125.广州应用科技学院"小海豚"：十五运会体操成年组赛场的青春守护力量.pdf
        '小海豚': 'pdf/23.20251125.广州应用科技学院"小海豚"：十五运会体操成年组赛场的青春守护力量.pdf',
        '体操成年组赛场': 'pdf/23.20251125.广州应用科技学院"小海豚"：十五运会体操成年组赛场的青春守护力量.pdf',
        '青春守护力量': 'pdf/23.20251125.广州应用科技学院"小海豚"：十五运会体操成年组赛场的青春守护力量.pdf',

        // 24.20251128.广州应用科技学院多维度护航十五运会：从立项到全运会赛场，贡献"湾区样本".pdf
        '多维度护航十五运会': 'pdf/24.20251128.广州应用科技学院多维度护航十五运会：从立项到全运会赛场，贡献"湾区样本".pdf',
        '湾区样本': 'pdf/24.20251128.广州应用科技学院多维度护航十五运会：从立项到全运会赛场，贡献"湾区样本".pdf'
    };

    // 根据标题查找对应的PDF
    function findPdfByTitle(title) {
        // 标准化标题用于匹配
        const normalizedTitle = title.replace(/\s+/g, '').replace(/[""'']/g, '');

        // 遍历映射表查找匹配的PDF
        for (const [key, pdfPath] of Object.entries(pdfMapping)) {
            const normalizedKey = key.replace(/\s+/g, '').replace(/[""'']/g, '');
            if (normalizedTitle.includes(normalizedKey) || normalizedKey.includes(normalizedTitle)) {
                return pdfPath;
            }
        }
        return null;
    }

    // 智能跳转函数 - HTML失败时跳转PDF
    function smartNavigate(url, title, pdfUrl) {
        if (pdfUrl) {
            // 有PDF时，1秒后自动跳转PDF
            setTimeout(() => {
                window.location.href = pdfUrl;
            }, 1000);
        } else {
            // 没有PDF时直接跳转HTML
            window.location.href = url;
        }
    }

    // 获取当前页面名称
    function getCurrentPageName() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        return filename;
    }

    // 动态获取新闻数据
    function getDynamicSearchData() {
        const searchData = [];
        const currentPage = getCurrentPageName();

        // 1. 从当前页面的 .news-item 获取新闻标题
        const newsItems = document.querySelectorAll('.news-item, .card');
        newsItems.forEach(item => {
            const titleEl = item.querySelector('.news-title, .news-link, h3, a');
            const dateEl = item.querySelector('.news-date, .card-time');
            const linkEl = item.querySelector('a');

            if (titleEl) {
                let title = titleEl.textContent.trim() || titleEl.innerText?.trim() || '';
                const date = dateEl ? dateEl.textContent.trim() : '';

                // 清理标题中的多余空格和换行
                title = title.replace(/\s+/g, ' ').trim();

                if (title && title.length > 0) {
                    const currentPageName = pageCategory[currentPage] || '内容';
                    const pdfPath = findPdfByTitle(title);
                    searchData.push({
                        title: title,
                        category: currentPageName,
                        url: linkEl ? linkEl.href : window.location.href,
                        pdfUrl: pdfPath
                    });
                }
            }
        });

        // 2. 添加页面导航链接
        const navLinks = document.querySelectorAll('.nav-links a, .footer-section a');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#') && href.endsWith('.html')) {
                const filename = href.split('/').pop();
                const category = pageCategory[filename];
                const linkText = link.textContent.trim();

                if (category && linkText) {
                    searchData.push({
                        title: linkText,
                        category: category,
                        url: href,
                        pdfUrl: null
                    });
                }
            }
        });

        // 3. 从轮播图获取内容
        const slides = document.querySelectorAll('.slide, .carousel-slide, .hero-slide');
        slides.forEach(slide => {
            const titleEl = slide.querySelector('h1, h2, h3');
            if (titleEl) {
                const title = titleEl.textContent.trim();
                const currentPageName = pageCategory[currentPage] || '首页';
                const pdfPath = findPdfByTitle(title);
                if (title) {
                    searchData.push({
                        title: title,
                        category: currentPageName,
                        url: window.location.href.split('#')[0],
                        pdfUrl: pdfPath
                    });
                }
            }
        });

        // 4. 从卡片内容获取
        const cards = document.querySelectorAll('.service-card, .project-card, .activity-card');
        cards.forEach(card => {
            const titleEl = card.querySelector('h3, h4');
            if (titleEl) {
                const title = titleEl.textContent.trim();
                const currentPageName = pageCategory[currentPage] || '内容';
                const pdfPath = findPdfByTitle(title);
                if (title) {
                    searchData.push({
                        title: title,
                        category: currentPageName,
                        url: window.location.href,
                        pdfUrl: pdfPath
                    });
                }
            }
        });

        return searchData;
    }

    // 执行搜索
    function performSearch(query) {
        query = query.toLowerCase().trim();

        if (!query) {
            searchResults.innerHTML = '<div class="no-results">请输入搜索关键词</div>';
            return;
        }

        // 获取动态数据
        const searchData = getDynamicSearchData();

        // 搜索匹配
        const results = searchData.filter(item =>
            item.title.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)
        );

        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="no-results">
                    <p>未找到"${query}"相关内容</p>
                    <p style="margin-top: 10px; font-size: 13px;">试试其他关键词，或浏览各板块页面</p>
                </div>
            `;
        } else {
            searchResults.innerHTML = results.map((item, index) => `
                <div class="search-item">
                    <a href="javascript:void(0);" onclick="smartNavigate_${index}('${item.url}', '${item.title.replace(/'/g, "\\'")}', ${item.pdfUrl ? `'${item.pdfUrl}'` : 'null'})">
                        <div class="search-item-title">${item.title}</div>
                        <div class="search-item-meta">
                            <span>${item.category}</span>
                            ${item.pdfUrl ? '<span style="color: #4CAF50; margin-left: 8px;">PDF</span>' : ''}
                        </div>
                    </a>
                </div>
            `).join('');

            // 绑定智能跳转函数
            results.forEach((item, index) => {
                window[`smartNavigate_${index}`] = function(url, title, pdfUrl) {
                    if (pdfUrl) {
                        window.location.href = pdfUrl;
                    } else {
                        window.location.href = url;
                    }
                };
            });
        }
    }

    // 搜索按钮点击
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value;
            performSearch(query);
            if (searchModal) {
                searchModal.classList.add('active');
            }
        });
    }

    // 回车键搜索
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value;
                performSearch(query);
                if (searchModal) {
                    searchModal.classList.add('active');
                }
            }
        });
    }

    // 关闭弹窗
    if (searchClose) {
        searchClose.addEventListener('click', () => {
            searchModal.classList.remove('active');
        });
    }

    // 点击遮罩关闭
    if (searchModal) {
        searchModal.addEventListener('click', (e) => {
            if (e.target === searchModal) {
                searchModal.classList.remove('active');
            }
        });
    }

    // ESC键关闭
    document.addEventListener('keyup', (e) => {
        if (e.key === 'Escape' && searchModal && searchModal.classList.contains('active')) {
            searchModal.classList.remove('active');
        }
    });
}

// 页面加载完成后初始化搜索功能
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
} else {
    initSearch();
}