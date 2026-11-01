import { HistoryRecord } from '../types';

const STORAGE_KEY = 'foodverse_ai_history_v1';

export class HistoryService {
  /**
   * Get all history records for a user
   */
  static getRecords(userId?: string): HistoryRecord[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const records: HistoryRecord[] = JSON.parse(raw);
      if (userId) {
        return records.filter(r => r.userId === userId || r.userId === 'guest-evaluator');
      }
      return records;
    } catch (e) {
      console.error('Failed to load history from storage:', e);
      return [];
    }
  }

  /**
   * Save a new record
   */
  static saveRecord(record: Omit<HistoryRecord, 'id' | 'timestamp'>): HistoryRecord {
    const newRecord: HistoryRecord = {
      ...record,
      id: 'rec_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toISOString(),
    };

    try {
      const existing = this.getRecords();
      const updated = [newRecord, ...existing];
      // Limit to 60 most recent to keep local storage clean
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.slice(0, 60)));
    } catch (e) {
      console.error('Failed to save record to localStorage:', e);
    }

    return newRecord;
  }

  /**
   * Delete a record by ID
   */
  static deleteRecord(id: string): void {
    try {
      const existing = this.getRecords();
      const filtered = existing.filter(r => r.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.error('Failed to delete record:', e);
    }
  }

  /**
   * Clear all records for user
   */
  static clearAll(userId?: string): void {
    try {
      if (!userId) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        const remaining = this.getRecords().filter(r => r.userId !== userId && r.userId !== 'guest-evaluator');
        localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
      }
    } catch (e) {
      console.error('Failed to clear records:', e);
    }
  }
}
