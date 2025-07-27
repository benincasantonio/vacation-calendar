import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Leave } from '@/models/leave.ts'
import { LeaveRepository } from '@/repository/leave-repository.ts'
import dayjs, { type Dayjs } from 'dayjs'
import type { LeaveRequest } from '@/models/leave-request.ts'

export const useLeaveStore = defineStore('leave-store', () => {
  const leaves = ref<Leave[]>([])
  const leaveRepository = new LeaveRepository()
  const currentMonth = ref<Dayjs>(dayjs().startOf('month'))

  const nextMonth = async () => {
    currentMonth.value = currentMonth.value.add(1, 'month')
    await getLeaves()
  }

  const previousMonth = async () => {
    currentMonth.value = currentMonth.value.subtract(1, 'month')
    await getLeaves()
  }

  async function getLeaves() : Promise<Leave[]> {
    leaves.value = await leaveRepository.getLeaves(currentMonth.value)

    return leaves.value;
  }

  async function addLeave(request: LeaveRequest): Promise<Leave> {
    const newLeave: Leave = {
      id: `leave-${leaves.value.length + 1}`,
      userId: request.userId,
      type: request.type,
      status: 'pending',
      startDate: request.startDate,
      endDate: request.endDate,
      date: dayjs(request.startDate).format('YYYY-MM-DD'),
      hours: request.hours,
      createdAt: new Date().toISOString(),
    }

    leaves.value = [...leaves.value, newLeave]

    return newLeave
  }


  return {
    // getters
    currentMonth: computed(() => currentMonth.value),
    leaves: computed(() => leaves.value),
    //actions
    previousMonth,
    nextMonth,
    // actions
    getLeaves,
    addLeave
  }
})
