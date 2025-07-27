import type { LeaveType } from '@/models/leave.ts'

export interface LeaveRequest {
  id: string;
  userId: string;
  type: LeaveType;

  startDate?: string;
  endDate?: string;

  date?: string;
  hours?: number;

  createdAt: string;
}
