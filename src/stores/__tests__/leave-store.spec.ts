import { beforeEach, describe, expect, vi, it, afterEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import dayjs from 'dayjs'
import type { Leave } from '@/models/leave.ts'
import { useLeaveStore } from '@/stores/leave-store.ts'
import type { LeaveRequest } from '@/models/leave-request.ts'

vi.mock('@/repository/leave-repository.ts', () => {
  return {
    LeaveRepository: vi.fn().mockImplementation(() => {
      return {
        getLeaves: vi.fn((date: dayjs.Dayjs): Promise<Leave[]> => {
          return new Promise((resolve) => {
            const leaves: Leave[] = Array.from({ length: 10 }, (_, i) => ({
              id: `leave-${i + 1}`,
              userId: `user-${i + 1}`,
              type: i % 2 === 0 ? 'vacation' : 'time_off',
              status: i % 3 === 0 ? 'approved' : i % 3 === 1 ? 'pending' : 'rejected',
              startDate: date.add(Math.random() * 29, 'day').format('YYYY-MM-DD'),
              endDate: date.add(Math.random() * 29 + 1, 'day').format('YYYY-MM-DD'),
              date: date.add(i, 'day').format('YYYY-MM-DD'),
              hours: i % 2 === 0 ? 8 : Math.floor(Math.random() * 7) + 1,
              createdAt: new Date().toISOString(),
            }));
            resolve(leaves);
          });
        }),
      }
    })
  }
})

describe('LeaveStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.clearAllTimers()
  })

  describe('getLeaves', () => {
    it('should fetch leaves for the current month', async () => {
      const leaveStore = useLeaveStore()

      const leaves = await leaveStore.getLeaves()


      expect(leaves).toHaveLength(10)
      expect(leaves[0]).toHaveProperty('id')
      expect(leaves[0]).toHaveProperty('userId')
      expect(leaves[0]).toHaveProperty('type')
      expect(leaves[0]).toHaveProperty('status')
      expect(leaves[0]).toHaveProperty('startDate')
      expect(leaves[0]).toHaveProperty('endDate')
      expect(leaves[0]).toHaveProperty('date')
      expect(leaves[0]).toHaveProperty('hours')
      expect(leaves[0]).toHaveProperty('createdAt')
    })

  })


  describe('LeaveStore Navigation', () => {
    it('should navigate to the next month', async () => {
      const leaveStore = useLeaveStore()
      const initialMonth = leaveStore.currentMonth

      await leaveStore.nextMonth()

      expect(leaveStore.currentMonth).toEqual(initialMonth.add(1, 'month'))
    })

    it('should navigate to the previous month', () => {
      const leaveStore = useLeaveStore()
      const initialMonth = leaveStore.currentMonth

      leaveStore.previousMonth()

      expect(leaveStore.currentMonth).toEqual(initialMonth.subtract(1, 'month'))
    })

    it('should handle multiple month navigations', async () => {
      const date = dayjs('2025-01-01')

      vi.setSystemTime(date.toDate())

      const leaveStore = useLeaveStore()

      expect(leaveStore.currentMonth.format('YYYY-MM')).toBe('2025-01')

      await leaveStore.nextMonth()
      expect(leaveStore.currentMonth.format('YYYY-MM')).toBe('2025-02')

      await leaveStore.nextMonth()
      expect(leaveStore.currentMonth.format('YYYY-MM')).toBe('2025-03')

      await leaveStore.previousMonth()
      expect(leaveStore.currentMonth.format('YYYY-MM')).toBe('2025-02')
    })

    it('should go to previous year when navigating back from January', async () => {
      const date = dayjs('2025-01-01')

      vi.setSystemTime(date.toDate())

      const leaveStore = useLeaveStore()

      expect(leaveStore.currentMonth.format('YYYY-MM')).toBe('2025-01')

      await leaveStore.previousMonth()
      expect(leaveStore.currentMonth.format('YYYY-MM')).toBe('2024-12')

      await leaveStore.previousMonth()
      expect(leaveStore.currentMonth.format('YYYY-MM')).toBe('2024-11')

    })

    it('should go to next year when navigating forward from January', async () => {
      const date = dayjs('2025-01-01')

      vi.setSystemTime(date.toDate())

      const leaveStore = useLeaveStore()

      await leaveStore.nextMonth()
      await leaveStore.nextMonth()
      await leaveStore.nextMonth()
      await leaveStore.nextMonth()
      await leaveStore.nextMonth()
      await leaveStore.nextMonth()
      await leaveStore.nextMonth()
      await leaveStore.nextMonth()
      await leaveStore.nextMonth()
      await leaveStore.nextMonth()
      await leaveStore.nextMonth()
      await leaveStore.nextMonth()

      expect(leaveStore.currentMonth.format('YYYY-MM')).toBe('2026-01')

    })

    it('should maintain correct day when navigating between months', async () => {
      const date = dayjs('2025-01-15')

      vi.setSystemTime(date.toDate())

      const leaveStore = useLeaveStore()

      await leaveStore.nextMonth()

      expect(leaveStore.currentMonth.date()).toBe(1)

      await leaveStore.nextMonth()
      await leaveStore.previousMonth()

      expect(leaveStore.currentMonth.date()).toBe(1)
    })
  })


  describe('addLeave', () => {

    it('should add a new leave', async () => {
      const leaveStore = useLeaveStore()
      await leaveStore.getLeaves()

      const initialLeaves = [...leaveStore.leaves]

      const request: LeaveRequest = {
        id: 'leave-11',
        userId: 'user-11',
        type: 'vacation',
        startDate: '2025-01-01',
        endDate: '2025-01-02',
        date: '2025-01-01',
        hours: 8,
        createdAt: new Date().toISOString(),
      }


      const addedLeave = await leaveStore.addLeave(request)

      expect(initialLeaves).toHaveLength(10)
      expect(leaveStore.leaves).toHaveLength(11)
      expect(leaveStore.leaves[10]).toEqual(addedLeave)
    })
  })

})

