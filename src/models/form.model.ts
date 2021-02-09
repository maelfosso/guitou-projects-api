import mongoose from 'mongoose';

interface FormAttributes {
  title: string;
  description: string;
}

interface FormModel extends mongoose.Model<FormDocument> {
  build(attrs: FormAttributes): FormDocument
}

interface FormDocument extends mongoose.Document {
  title: string;
  description: string;
  xorm: string;
  author: string;
  createdAt: Date;
  form: mongoose.Schema.Types.Mixed,
}

const FormSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "Untitled form"
  },
  description: {
    type: String
  },
  form: mongoose.Schema.Types.Mixed,
  settings: {
    display_data: {
      web: {
        columns: [mongoose.Schema.Types.Mixed],
        data: []
      },
      mobile: {
        template: String,
        fields: mongoose.Schema.Types.Mixed
      }
    }
  },
  data: [mongoose.Schema.Types.ObjectId],
  author: mongoose.Schema.Types.ObjectId,
  xorm: mongoose.Schema.Types.ObjectId,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { strict: false });

const Form = mongoose.model<FormDocument, FormModel>('Form', FormSchema);

export { Form, FormDocument, FormSchema };
