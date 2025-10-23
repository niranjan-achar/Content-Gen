import os

from databases import Database

DATABASE_URL = os.getenv('DATABASE_URL')
if not DATABASE_URL:
    DATABASE_URL = 'postgresql://localhost/contentgen'

db = Database(DATABASE_URL)


async def connect():
    await db.connect()


async def disconnect():
    await db.disconnect()
