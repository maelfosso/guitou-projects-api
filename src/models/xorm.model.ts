import mongoose from 'mongoose';
import { FormDocument } from './form.model';

interface XormAttributes {
  title: string;
  description: string;
}

interface XormModel extends mongoose.Model<XormDocument> {
  build(attrs: XormAttributes): XormDocument
}

interface XormDocument extends mongoose.Document {
  title: string;
  description: string;
  forms: FormDocument[];
  author: string;
}

const XormSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "Untitled Xorm"
  },
  description: {
    type: String
  },
  forms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Form"
  }],
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
  data: mongoose.Schema.Types.ObjectId,

  collaborators: [{
    name: String,
    email: String,
    username: String,
    password: String,
    phone: String,
    role: String,
    salt: String
  }],

  author: mongoose.Schema.Types.ObjectId,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { strict: false });

const Xorm = mongoose.model<XormDocument, XormModel>('Xorm', XormSchema);

export { Xorm, XormDocument, XormSchema };
