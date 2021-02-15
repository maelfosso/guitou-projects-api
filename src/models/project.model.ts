import mongoose from 'mongoose';
import { XormDocument } from './xorm.model';

interface ProjectAttributes {
  title: string;
  description: string;
}

interface ProjectModel extends mongoose.Model<ProjectDocument> {
  build(attrs: ProjectAttributes): ProjectDocument
}

interface ProjectDocument extends mongoose.Document {
  title: string;
  description: string;
  xorms: XormDocument[];
  author: string;
}

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "Untitled Project"
  },
  description: {
    type: String
  },
  xorms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Xorm"
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

const Project = mongoose.model<ProjectDocument, ProjectModel>('Project', ProjectSchema);

export { Project, ProjectDocument, ProjectSchema };
