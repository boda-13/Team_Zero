// ========================================
// DATABASE MODEL
// ========================================

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../database/db.json');

class Database {
    constructor() {
        this.data = this.load();
    }

    load() {
        try {
            if (fs.existsSync(DB_PATH)) {
                const raw = fs.readFileSync(DB_PATH, 'utf8');
                return JSON.parse(raw);
            }
        } catch (error) {
            console.error('Error loading database:', error);
        }
        return this.getDefaultData();
    }

    getDefaultData() {
        return {
            projects: [
                { id: 1, title: 'شركة تكنو', category: 'web', description: 'موقع شركة تقنية' },
                { id: 2, title: 'متجر زيتونة', category: 'web', description: 'متجر إلكتروني' }
            ],
            team: [
                { id: 1, name: 'أحمد محمد', role: 'المدير التنفيذي' },
                { id: 2, name: 'سارة خالد', role: 'مصممة UI/UX' }
            ],
            services: [
                { id: 1, name: 'تطوير المواقع', description: 'بناء مواقع احترافية' },
                { id: 2, name: 'التصميم الإبداعي', description: 'هويات بصرية مميزة' }
            ],
            messages: [],
            analytics: {
                visits: 0,
                pageViews: {},
                lastVisit: null
            }
        };
    }

    save() {
        try {
            fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2));
            return true;
        } catch (error) {
            console.error('Error saving database:', error);
            return false;
        }
    }

    get(collection) {
        return this.data[collection] || [];
    }

    add(collection, item) {
        if (!this.data[collection]) {
            this.data[collection] = [];
        }
        item.id = this.getNextId(collection);
        this.data[collection].push(item);
        this.save();
        return item;
    }

    update(collection, id, updates) {
        const index = this.data[collection].findIndex(item => item.id === id);
        if (index === -1) return null;
        
        this.data[collection][index] = { ...this.data[collection][index], ...updates };
        this.save();
        return this.data[collection][index];
    }

    delete(collection, id) {
        const index = this.data[collection].findIndex(item => item.id === id);
        if (index === -1) return false;
        
        this.data[collection].splice(index, 1);
        this.save();
        return true;
    }

    getNextId(collection) {
        const items = this.data[collection] || [];
        return items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
    }
}

module.exports = new Database();