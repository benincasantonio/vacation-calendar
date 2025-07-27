<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'

const router = useRouter()

function goToLeaveView() {
  router.push({ name: 'leave' })
}

</script>

<template>
  <main>
    <div class="flex h-[100vh] w-full items-center justify-center">
      <Button
        @click="goToLeaveView"
      >Register your leave</Button>
    </div>
  </main>
</template>
