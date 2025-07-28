import type { LeaveType } from '@/models/leave.ts'

export interface LeaveRequest {
  userId: string;
  type: LeaveType;

  startDate?: string;
  endDate?: string;

  hours?: number;
}
