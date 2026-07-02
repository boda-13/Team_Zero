// ========================================
// TEAM ZERO - PORTFOLIO
// ========================================

(function() {
    'use strict';

    // ========================================
    // PORTFOLIO DATA
    // ========================================
    const portfolioData = [
        {
            id: 1,
            title: 'شركة تكنو',
            category: 'web',
            icon: '🏢',
            description: 'موقع شركة تقنية متكامل',
            image: 'assets/images/portfolio/techco.jpg'
        },
        {
            id: 2,
            title: 'متجر زيتونة',
            category: 'web',
            icon: '🛍️',
            description: 'متجر إلكتروني للمنتجات الطبيعية',
            image: 'assets/images/portfolio/olive.jpg'
        },
        {
            id: 3,
            title: 'هوية براند',
            category: 'design',
            icon: '🎯',
            description: 'هوية بصرية متكاملة لعلامة تجارية',
            image: 'assets/images/portfolio/brand.jpg'
        },
        {
            id: 4,
            title: 'إعلان تسويقي',
            category: 'video',
            icon: '📹',
            description: 'فيديو إعلاني احترافي',
            image: 'assets/images/portfolio/ad.jpg'
        },
        {
            id: 5,
            title: 'منصة تعليمية',
            category: 'web',
            icon: '🎓',
            description: 'منصة تعليمية تفاعلية',
            image: 'assets/images/portfolio/edu.jpg'
        },
        {
            id: 6,
            title: 'تصميم جرافيكي',
            category: 'design',
            icon: '🖌️',
            description: 'تصميمات جرافيكية متميزة',
            image: 'assets/images/portfolio/graphic.jpg'
        },
        {
            id: 7,
            title: 'مونتاج ألعاب',
            category: 'video',
            icon: '🎮',
            description: 'مونتاج احترافي للألعاب',
            image: 'assets/images/portfolio/gaming.jpg'
        },
        {
            id: 8,
            title: 'تطبيق جوال',
            category: 'web',
            icon: '📱',
            description: 'تطبيق موبايل متكامل',
            image: 'assets/images/portfolio/app.jpg'
        }
    ];

    // ========================================
    // PORTFOLIO CONTROLLER
    // ========================================
    class PortfolioController {
        constructor() {
            this.container = document.getElementById('portfolioGrid');
            this.filters = document.querySelectorAll('.filter-btn');
            this.currentFilter = 'all';
            this.items = portfolioData;
            
            this.init();
        }

        init() {
            this.render();
            this.setupFilters();
            this.setupSearch();
        }

        render(filter = this.currentFilter) {
            if (!this.container) return;

            const filtered = filter === 'all' 
                ? this.items 
                : this.items.filter(item => item.category === filter);

            if (filtered.length === 0) {
                this.container.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 4rem;">
                        <i class="fas fa-search" style="font-size: 3rem; color: var(--text-muted);"></i>
                        <p style="color: var(--text-secondary); margin-top: 1rem;">
                            لا توجد مشاريع في هذا التصنيف
                        </p>
                    </div>
                `;
                return;
            }

            this.container.innerHTML = filtered.map(item => `
                <div class="portfolio-item glass" data-id="${item.id}" data-category="${item.category}">
                    <div class="portfolio-image" style="background: var(--gradient-glow);">
                        ${item.icon}
                        <div class="overlay">
                            <a href="#" class="view-project" data-id="${item.id}">
                                <i class="fas fa-eye"></i> مشاهدة
                            </a>
                        </div>
                    </div>
                    <div class="portfolio-info">
                        <h4>${item.title}</h4>
                        <p class="category">${this.getCategoryLabel(item.category)}</p>
                        <p class="description" style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.3rem;">
                            ${item.description}
                        </p>
                    </div>
                </div>
            `).join('');

            // Setup view buttons
            this.container.querySelectorAll('.view-project').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const id = parseInt(btn.dataset.id);
                    this.showProjectDetails(id);
                });
            });

            // Update counter
            this.updateCounter(filtered.length);
        }

        setupFilters() {
            this.filters.forEach(btn => {
                btn.addEventListener('click', () => {
                    this.filters.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    this.currentFilter = btn.dataset.filter;
                    this.render();
                });
            });
        }

        setupSearch() {
            const searchInput = document.getElementById('portfolioSearch');
            if (!searchInput) return;

            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                const filtered = this.items.filter(item => 
                    item.title.toLowerCase().includes(query) ||
                    item.description.toLowerCase().includes(query)
                );
                
                // Temporarily override items for search
                const originalItems = this.items;
                this.items = filtered;
                this.render();
                this.items = originalItems;
            });
        }

        showProjectDetails(id) {
            const project = this.items.find(item => item.id === id);
            if (!project) return;

            // Create modal
            const modal = document.createElement('div');
            modal.className = 'portfolio-modal';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.85);
                backdrop-filter: blur(20px);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem;
                animation: fadeIn 0.3s ease;
            `;

            modal.innerHTML = `
                <div style="
                    background: var(--darker);
                    border: 1px solid var(--glass-border);
                    border-radius: var(--radius);
                    max-width: 600px;
                    width: 100%;
                    padding: 2.5rem;
                    position: relative;
                    animation: scaleIn 0.3s ease;
                ">
                    <button class="close-modal" style="
                        position: absolute;
                        top: 1rem;
                        left: 1rem;
                        background: var(--glass-bg);
                        border: 1px solid var(--glass-border);
                        color: var(--text-primary);
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        cursor: pointer;
                        font-size: 1.2rem;
                        transition: var(--transition);
                    ">✕</button>
                    
                    <div style="font-size: 4rem; text-align: center; margin-bottom: 1rem;">
                        ${project.icon}
                    </div>
                    <h2 style="text-align: center; font-size: 2rem;">${project.title}</h2>
                    <p style="color: var(--text-secondary); text-align: center; margin: 1rem 0;">
                        ${project.description}
                    </p>
                    <p style="color: var(--text-muted); text-align: center;">
                        التصنيف: ${this.getCategoryLabel(project.category)}
                    </p>
                    <div style="text-align: center; margin-top: 2rem;">
                        <a href="#" class="btn-primary" style="display: inline-flex;">
                            <i class="fas fa-external-link-alt"></i> زيارة المشروع
                        </a>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';

            // Close modal
            const closeModal = () => {
                modal.remove();
                document.body.style.overflow = '';
            };

            modal.querySelector('.close-modal').addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });

            // Close on Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') closeModal();
            });
        }

        getCategoryLabel(category) {
            const labels = {
                'web': 'ويب',
                'design': 'تصميم',
                'video': 'فيديو'
            };
            return labels[category] || category;
        }

        updateCounter(count) {
            const counter = document.getElementById('portfolioCount');
            if (counter) {
                counter.textContent = `(${count} مشاريع)`;
            }
        }

        addProject(project) {
            this.items.push({
                id: this.items.length + 1,
                ...project
            });
            this.render();
        }

        deleteProject(id) {
            this.items = this.items.filter(item => item.id !== id);
            this.render();
        }
    }

    // ========================================
    // INITIALIZE
    // ========================================
    document.addEventListener('DOMContentLoaded', () => {
        const portfolio = new PortfolioController();
        
        // Expose to global for admin panel
        window.portfolio = portfolio;

        console.log('📁 Portfolio Loaded');
    });

})();