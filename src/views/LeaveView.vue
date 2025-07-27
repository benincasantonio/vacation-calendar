<script setup lang="ts">
import {Button} from '@/components/ui/button'
import LeaveCalendar from '@/components/LeaveCalendar.vue'
</script>

<template>
  <div class="flex justify-end w-full p-2">
    <Button class="cursor-pointer">Add Time Off</Button>
  </div>

  <LeaveCalendar />


</template>

<style scoped>

</style>
