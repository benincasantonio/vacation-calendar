<script setup lang="ts">
import { RouterView } from 'vue-router'
import LeaveCalendar from '@/components/LeaveCalendar.vue'
import { useLeaveStore } from '@/stores/leave-store.ts'

const store = useLeaveStore()

store.getLeaves()
</script>

<template>
  <RouterView />
  <LeaveCalendar/>
</template>

<style scoped>

</style>
