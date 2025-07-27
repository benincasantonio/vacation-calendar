<script setup lang="ts">
import Select from '@/components/ui/select/Select.vue'
import SelectTrigger from '@/components/ui/select/SelectTrigger.vue'
import SelectValue from '@/components/ui/select/SelectValue.vue'
import SelectContent from '@/components/ui/select/SelectContent.vue'
import SelectGroup from '@/components/ui/select/SelectGroup.vue'
import SelectLabel from '@/components/ui/select/SelectLabel.vue'
import SelectItem from '@/components/ui/select/SelectItem.vue'
import Input from '@/components/ui/input/Input.vue'
import type { LeaveType } from '@/models/leave.ts'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

const leaveTypes: LeaveType[] = ['vacation', 'time_off']

const schema = yup.object({
  type: yup.string().oneOf(leaveTypes).required('Type is required'),
  startDate: yup.string().required('Start date is required'),
  endDate: yup.string().required('End date is required'),
  date: yup.string(),
  hours: yup.number().min(1).max(8).required('Hours are required'),
})

const { handleSubmit, errors } = useForm({
  validationSchema: schema,
})

const { value: type } = useField<string>('type')
const { value: startDate } = useField<string>('startDate')
const { value: endDate } = useField<string>('endDate')
const { value: date } = useField<string>('date')
const { value: hours } = useField<number>('hours')

const emit = defineEmits<{ (e: 'submit', payload: any): void }>()

const onSubmit = handleSubmit((values) => {
  emit('submit', values)
})
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-4">
    <div>
      <label class="block mb-1">Type</label>
      <Select v-model="type">
        <SelectTrigger class="w-[180px]">
          <SelectValue placeholder="Select leave type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Leave Types</SelectLabel>
            <SelectItem v-for="typeOption in leaveTypes" :key="typeOption" :value="typeOption">
              {{ typeOption }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <span v-if="errors.type" class="text-red-500 text-xs">{{ errors.type }}</span>
    </div>
    <div>
      <label class="block mb-1">Start Date</label>
      <Input v-model="startDate" type="date" />
      <span v-if="errors.startDate" class="text-red-500 text-xs">{{ errors.startDate }}</span>
    </div>
    <div>
      <label class="block mb-1">End Date</label>
      <Input v-model="endDate" type="date" />
      <span v-if="errors.endDate" class="text-red-500 text-xs">{{ errors.endDate }}</span>
    </div>
    <div>
      <label class="block mb-1">Single Date</label>
      <Input v-model="date" type="date" />
      <span v-if="errors.date" class="text-red-500 text-xs">{{ errors.date }}</span>
    </div>
    <div>
      <label class="block mb-1">Hours</label>
      <Input v-model="hours" type="number" min="1" max="8" />
      <span v-if="errors.hours" class="text-red-500 text-xs">{{ errors.hours }}</span>
    </div>
    <button type="submit" class="btn btn-primary">Submit</button>
  </form>
</template>

<style scoped>
.space-y-4 > * + * { margin-top: 1rem; }
</style>
