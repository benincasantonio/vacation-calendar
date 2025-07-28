import type { Leave } from '@/models/leave.ts'
import dayjs, {type Dayjs} from 'dayjs'
import { useLocalStorage } from '@vueuse/core'
import type { LeaveRequest } from '@/models/leave-request.ts'

export class LeaveRepository {
  leaves = useLocalStorage<Leave[]>('leaves', [], {
    serializer: {
      read: (value) => {
        return JSON.parse(value);
      },
      write: (value) => JSON.stringify(value),
    },
  });

  /**
   * Fetches a list of leaves for a given month and year.
   * @param date - The date for which to fetch leaves, typically the first day of the month.
   */
  getLeaves(date: Dayjs): Promise<Leave[]> {
    return new Promise((resolve) => {
      const leavesForMonth = this.leaves.value.filter(leave => {
        const startDate = dayjs(leave.startDate);
        const endDate = dayjs(leave.endDate);

        return (startDate.isSame(date, 'month') && startDate.isSame(date, 'year')) ||
          (endDate.isSame(date, 'month') && endDate.isSame(date, 'year'));
      })

      resolve(leavesForMonth);
    });
  }

  addLeave(leave: LeaveRequest): Promise<Leave> {
    const newLeave: Leave = {
      id: `leave-${Date.now()}`,
      status: "pending",
      ...leave,
      createdAt: new Date().toISOString(),
    }

    this.leaves.value = [...this.leaves.value, newLeave];

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(newLeave);
      }, 1000);
    });
  }
}
