import type { Leave } from '@/models/leave.ts'
import {type Dayjs} from 'dayjs'

export class LeaveRepository {

  /**
   * Fetches a list of leaves for a given month and year.
   * @param date - The date for which to fetch leaves, typically the first day of the month.
   */
  getLeaves(date: Dayjs): Promise<Leave[]> {
    return new Promise((resolve) => {
      const leaves: Leave[] = Array.from({ length: 10 }, (_, i) => {
      const baseDate = date.add(Math.random() * 29, 'day')
      return {
        id: `leave-${i + 1}`,
        userId: `user-${i + 1}`,
        type: i % 2 === 0 ? 'vacation' : 'time_off',
        status: i % 3 === 0 ? 'approved' : i % 3 === 1 ? 'pending' : 'rejected',
        startDate: baseDate.startOf('day').format('YYYY-MM-DD'),
        endDate: baseDate.endOf('day').format('YYYY-MM-DD'),
        date: baseDate.add(i, 'day').format('YYYY-MM-DD'),
        hours: i % 2 === 0 ? 8: Math.floor(Math.random() * 7) + 1,
        createdAt: new Date().toISOString(),
      };
      }
      );

      resolve(leaves);
    });
  }
}
