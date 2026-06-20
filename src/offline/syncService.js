import { deleteRecord, getAllRecords } from './indexedDB';
import api from '../services/api';

export async function syncQueuedSales() {
  const queued = await getAllRecords('queue');
  for (const item of queued) {
    await api.post('/sales', item.payload);
    await deleteRecord('queue', item.id);
  }
}
