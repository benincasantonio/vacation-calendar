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
import dayjs from 'dayjs'
import type { LeaveRequest } from '@/models/leave-request.ts'
import { useLeaveStore } from '@/stores/leave-store.ts'

const leaveTypes: LeaveType[] = ['vacation', 'time_off']

const leaveStore = useLeaveStore()

const schema = yup.object({
  type: yup.string().oneOf(leaveTypes).required('Type is required'),
  startDate: yup.string().when('type', {
    is: 'time_off',
    then: (schema) => schema.required('Date is required'),
    otherwise: (schema) => schema.required('Start date is required'),
  }),
  endDate: yup.string().when('type', {
    is: 'vacation',
    then: (schema) => schema.required('End date is required').test(
      'is-after-start',
      'End date must be after or equal to start date',
      function (value) {
        const { startDate } = this.parent
        if (!value || !startDate) return true
        return new Date(value) >= new Date(startDate)
      }
    ),
    otherwise: (schema) => schema.notRequired(),
  }),
  hours: yup.number().min(1).max(8).required('Hours are required'),
})

const { handleSubmit, errors, validate } = useForm({
  validationSchema: schema,
  initialValues: {
    type: 'vacation',
    startDate: dayjs().format('YYYY-MM-DD'),
    hours: 8,
  },
})

const { value: type } = useField<string>('type')
const { value: startDate } = useField<string>('startDate')
const { value: endDate } = useField<string>('endDate')
const { value: hours } = useField<number>('hours')


const onSubmit = handleSubmit(async (values) => {
  const {valid} = await validate()

  if(!valid) {
    return
  }


  await leaveStore.addLeave({
    type: values.type,
    hours: values.hours,
    startDate: values.startDate,
    endDate: values.type === 'vacation' ? values.endDate : undefined,
    userId: 'user-123',
  } as LeaveRequest)
})

defineExpose({
  onSubmit,
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
      <label class="block mb-1" v-if="type == 'vacation'">Start Date</label>
      <label class="block mb-1" v-if="type == 'time_off'">Date</label>
      <Input v-model="startDate" type="date" />
      <span v-if="errors.startDate" class="text-red-500 text-xs">{{ errors.startDate }}</span>
    </div>
    <div v-if="type === 'vacation'">
      <label class="block mb-1">End Date</label>
      <Input v-model="endDate" type="date" />
      <span v-if="errors.endDate" class="text-red-500 text-xs">{{ errors.endDate }}</span>
    </div>
    <div>
      <label class="block mb-1">Hours (daily)</label>
      <Input v-if="type === 'vacation'" :model-value="8" type="number" disabled @update:model-value="onTypeChange" />
      <Input v-else v-model="hours" type="number" min="1" max="8" />
      <span v-if="errors.hours && type !== 'vacation'" class="text-red-500 text-xs">{{ errors.hours }}</span>
    </div>
  </form>
</template>

<style scoped>
.space-y-4 > * + * { margin-top: 1rem; }
</style>
