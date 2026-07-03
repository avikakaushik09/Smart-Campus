import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  userId: string;
  subject: string;
  date: string;
  status: 'present' | 'absent';
}

const AttendanceSchema = new Schema<IAttendance>({
  userId: { type: String, required: true },
  subject: { type: String, required: true },
  date: { type: String, required: true },
  status: { type: String, enum: ['present', 'absent'], required: true },
});

export default mongoose.models.Attendance || mongoose.model<IAttendance>('Attendance', AttendanceSchema);