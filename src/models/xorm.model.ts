import mongoose from 'mongoose';

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
  project: string;
  author: string;
  createdAt: Date;
  level: String,
  pKeyOrigin: String,
  xorm: mongoose.Schema.Types.Mixed,
}

const XormSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "Untitled xorm"
  },
  description: {
    type: String
  },
  xorm: mongoose.Schema.Types.Mixed,
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
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project"
  },
  data: [mongoose.Schema.Types.ObjectId],
  author: mongoose.Schema.Types.ObjectId,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { strict: false });

const Xorm = mongoose.model<XormDocument, XormModel>('Xorm', XormSchema);

export { Xorm, XormDocument, XormSchema };
