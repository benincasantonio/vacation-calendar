<script setup lang="ts">

import { Dialog, DialogFooter, DialogHeader, DialogContent, DialogTrigger, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
</script>

<template>
  <Dialog>
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

      <DialogFooter>
        <DialogClose>
          <Button variant="destructive">Cancel</Button>
        </DialogClose>

        <Button class="ml-2">Create</Button>
      </DialogFooter>

    </DialogContent>



  </Dialog>
</template>

<style scoped>

</style>
