import mongoose, { Schema, Document } from 'mongoose';

export interface ITimetable extends Document {
  userId: string;
  subject: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
}

const TimetableSchema = new Schema<ITimetable>({
  userId: { type: String, required: true },
  subject: { type: String, required: true },
  day: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  room: { type: String, default: '' },
});

export default mongoose.models.Timetable || mongoose.model<ITimetable>('Timetable', TimetableSchema);