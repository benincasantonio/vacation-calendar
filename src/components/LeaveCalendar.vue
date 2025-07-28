<script setup lang="ts">
import {VueCal as VueCalendar} from 'vue-cal'
import 'vue-cal/style'
import { useLeaveStore } from '@/stores/leave-store.ts'
import { computed } from 'vue'
import dayjs from 'dayjs'


const store = useLeaveStore()

const events = computed(() => {
  return store.leaves.flatMap((leave) => {
    if (leave.type === 'vacation' && leave.startDate && leave.endDate) {
      const start = dayjs(leave.startDate)
      const end = dayjs(leave.endDate)
      const days = end.diff(start, 'day') + 1
      return Array.from({ length: days }, (_, i) => {
        const currentDay = start.add(i, 'day')
        return {
          id: `${leave.id}-${currentDay.format('YYYY-MM-DD')}`,
          start: currentDay.toDate(),
          end: currentDay.endOf('day').toDate(),
          title: days > 1 ? `${leave.type} (Day ${i + 1} of ${days})`: leave.type,
          class: `vacation`,
          meta: {
            status: leave.status
          }
        }
      })
    } else {
      return {
        id: leave.id,
        start: dayjs(leave.startDate).toDate(),
        end: leave.type === 'vacation' ? dayjs(leave.endDate).endOf('day').toDate() : dayjs(leave.startDate).add(leave.hours ?? 0, 'hour').toDate(),
        title: leave.type,
        class: `day-off`,
        meta: {
          status: leave.status
        }
      }
    }
  })
})

function onViewChange(event: {
  start: Date,
}) {
  const startDate = dayjs(event.start).startOf('month')

  if (!store.currentMonth.isAfter(startDate)) {
    store.nextMonth()
  } else {
    store.previousMonth()
  }
}

</script>

<template>
<VueCalendar
  :date-picker="false"
  view="month"
  :views-bar="false"
  events-on-month-view
  :today-button="false"
  :view-date="store.currentMonth.toDate()"
  :events="events"
  @view-change="onViewChange"
></VueCalendar>
</template>

<style scoped>
.vuecal--default-theme :deep(.vuecal__event.vacation) {
  background-color: #ccfbf1; /* bg-teal-100 */
  color: #134e4a;            /* text-teal-900 */
  border-color: #14b8a6;     /* border-teal-500 */
}

.vuecal--default-theme :deep(.vuecal__event.day-off) {
  background-color: #fef3c7; /* bg-amber-100 */
  color: #92400e;            /* text-amber-900 */
  border-color: #ca8a04;     /* border-amber-500 */
}
</style>
