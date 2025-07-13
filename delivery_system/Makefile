# Makefile

start:
	@echo "🚀 Serverni ishga tushurish..."
	node index.js

check-db:
	@echo "🔍 Ma'lumotlar bazasiga ulanishni tekshirish..."
	node -e "require('./db').query('SELECT 1').then(() => console.log('✅ DB ulandi')).catch(err => console.error('❌ DB xatolik:', err))"

lint:
	@echo "🧹 Kodni formatlash (eslint ishlatilsa)..."
	npx eslint .

routes-check:
	@echo "🔍 Routes fayllarni yuklashni tekshirish..."
	node -e "['./routes/products', './routes/orders', './routes/auth'].forEach(p => { try { require(p); console.log('✅', p, 'Yuklandi') } catch(e) { console.error('❌', p, 'Xato:', e.message) } })"

test-all: check-db routes-check
	@echo "✅ Hammasi tayyor!"

.PHONY: start check-db lint routes-check test-all
