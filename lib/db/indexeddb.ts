'use client';

import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'neomonix-db';
const DB_VERSION = 1;

export type NeomonixDB = IDBPDatabase;

let dbPromise: Promise<NeomonixDB> | null = null;

export function getDB(): Promise<NeomonixDB> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('vocabCards')) {
          const store = db.createObjectStore('vocabCards', { keyPath: 'id' });
          store.createIndex('languageCode', 'languageCode');
          store.createIndex('dueDate', 'dueDate');
          store.createIndex('frequency', 'frequency');
          store.createIndex('srsLevel', 'srsLevel');
        }

        if (!db.objectStoreNames.contains('sessions')) {
          const store = db.createObjectStore('sessions', { keyPath: 'id' });
          store.createIndex('languageCode', 'languageCode');
          store.createIndex('startedAt', 'startedAt');
        }

        if (!db.objectStoreNames.contains('phrases')) {
          const store = db.createObjectStore('phrases', { keyPath: 'id' });
          store.createIndex('languageCode', 'languageCode');
          store.createIndex('category', 'category');
          store.createIndex('drillStatus', 'drillStatus');
        }

        if (!db.objectStoreNames.contains('videos')) {
          const store = db.createObjectStore('videos', { keyPath: 'id' });
          store.createIndex('languageCode', 'languageCode');
          store.createIndex('watchStatus', 'watchStatus');
        }

        if (!db.objectStoreNames.contains('journalEntries')) {
          const store = db.createObjectStore('journalEntries', { keyPath: 'id' });
          store.createIndex('date', 'date');
        }

        if (!db.objectStoreNames.contains('userProgress')) {
          db.createObjectStore('userProgress', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}
