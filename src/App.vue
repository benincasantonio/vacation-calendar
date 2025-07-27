<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useLeaveStore } from '@/stores/leave-store.ts'

const store = useLeaveStore()

store.getLeaves()
</script>

<template>
  <RouterView />
</template>

<style scoped>

</style>
