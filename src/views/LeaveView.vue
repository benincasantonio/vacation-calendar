<script setup lang="ts">
import {Button} from '@/components/ui/button'
import LeaveCalendar from '@/components/LeaveCalendar.vue'
import LeaveCreateDialog from '@/components/LeaveCreateDialog.vue'
</script>

<template>
  <div class="flex justify-end w-full p-2">
    <LeaveCreateDialog>
      <template #trigger>
        <Button class="cursor-pointer">Add Time Off</Button>
      </template>
    </LeaveCreateDialog>
  </div>

  <LeaveCalendar />


</template>

<style scoped>

</style>
