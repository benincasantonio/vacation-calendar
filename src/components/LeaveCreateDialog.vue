<script setup lang="ts">

import { Dialog, DialogFooter, DialogHeader, DialogContent, DialogTrigger, DialogTitle, DialogClose, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import LeaveCreateForm from '@/components/LeaveCreateForm.vue'
import { ref } from 'vue'

const dialogOpen = ref(false)

const leaveCreateForm = ref<InstanceType<typeof LeaveCreateForm>>()


function onSubmit() {
  leaveCreateForm.value?.onSubmit().then()
    .finally(() => {
    dialogOpen.value = false
  })
}


</script>

<template>
  <Dialog v-model:open="dialogOpen">
    <DialogTrigger as-child>
      <slot name="trigger" />
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add new Leave</DialogTitle>
        <DialogDescription>
          Fill in the details for the new leave request.
        </DialogDescription>
      </DialogHeader>

      <LeaveCreateForm ref="leaveCreateForm" />

      <DialogFooter>
        <DialogClose>
          <Button variant="destructive">Cancel</Button>
        </DialogClose>

        <Button class="ml-2" @click="onSubmit">Create</Button>
      </DialogFooter>

    </DialogContent>



  </Dialog>
</template>

<style scoped>

</style>
