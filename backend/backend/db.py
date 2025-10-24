import os

from databases import Database

DATABASE_URL = os.getenv('DATABASE_URL')
if not DATABASE_URL:
    DATABASE_URL = 'postgresql://localhost/contentgen'
    print("⚠️ Warning: DATABASE_URL not set, using default")
else:
    print(f"📊 Database URL configured: {DATABASE_URL[:30]}...")

db = Database(DATABASE_URL, min_size=1, max_size=5)


async def connect():
    print("🔌 Establishing database connection pool...")
    await db.connect()
    print("✅ Database connection pool established")


async def disconnect():
    print("🔌 Closing database connection pool...")
    await db.disconnect()
    print("✅ Database connection pool closed")
