<script setup lang="ts">
import {VueCal as VueCalendar} from 'vue-cal'
import 'vue-cal/style'
import { useLeaveStore } from '@/stores/leave-store.ts'
import { computed } from 'vue'
import dayjs from 'dayjs'


const store = useLeaveStore()

const events = computed(() => {
  return store.leaves.map((leave) => {
    return {
      id: leave.id,
      start: dayjs(leave.startDate).toDate(),
      end: leave.type === 'vacation' ? dayjs(leave.endDate).endOf('day').toDate() : dayjs(leave.startDate).add(leave.hours ?? 0, 'hour').toDate(),
      title: leave.type,
      color: leave.status === 'approved' ? '#007bff' : leave.status === 'pending' ? '#ffc107' : '#dc3545',
      meta: {
        status: leave.status
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

</style>
