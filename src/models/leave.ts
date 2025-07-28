export type LeaveType = 'vacation' | 'time_off';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface Leave {
  id: string;
  userId: string;
  type: LeaveType;
  status: LeaveStatus;

  startDate?: string;
  endDate?: string;
  hours?: number;

  createdAt: string;
}
