import mongoose, { Document, Schema } from 'mongoose';

export interface IImage extends Document {
  file_id: string;
  url: string;
  userId?: mongoose.Types.ObjectId;
}

const ImageSchema: Schema = new Schema(
  {
    file_id: {
      type: String,
      required: [true, 'File ID is required'],
      trim: true
    },
    url: {
      type: String,
      required: [true, 'URL is required'],
      trim: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      unique: true, // One image per user for avatar
      sparse: true // Allows null values while maintaining unique constraint
    }
  },
  {
    timestamps: true,
   
  }
);

// Indexes
ImageSchema.index({ userId: 1 });
ImageSchema.index({ file_id: 1 });

export default mongoose.model<IImage>('Image', ImageSchema);