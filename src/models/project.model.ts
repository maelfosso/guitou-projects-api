import mongoose, { FilterQuery, Types } from 'mongoose';
import { XormDocument } from './xorm.model';

interface ProjectAttributes {
  title: string;
  description: string;
}

interface ProjectModel extends mongoose.Model<ProjectDocument> {
  build(attrs: ProjectAttributes): ProjectDocument;
  findByIdWithXorms(id: string): Promise<ProjectPopulatedDocument>;
  findOneWithXorms(filter?: FilterQuery<ProjectDocument>): Promise<ProjectPopulatedDocument>;
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
  primaryKey: {
    current: String,
    used: [{
      type: String
    }]
  },
  settings: {
    xorms: {
      primary: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Xorm"
      },
      pKeyOrigin: {
        type: String,
        enum: ['autogenerated', 'autoincrement', 'entered'],
        default: 'autogenerated'
      }
    },
    collaborators: [],
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


interface ProjectDocument extends mongoose.Document {
  title: string;
  description: string;
  xorms: Types.ObjectId[] | Record<string, unknown>[] | XormDocument[];
  settings: {
    xorms: {
      primary: string,
      pKeyOrigin: string
    }
  },
  author: string;
}

interface ProjectPopulatedDocument extends ProjectDocument {
  xorms: XormDocument[]
}

ProjectSchema.statics.findByIdWithXorms = async function(
  id: string
) {
  return Project.findById(id).populate('xorms').exec();
}

ProjectSchema.statics.findOneWithXorms = async function(
  filter: FilterQuery<ProjectDocument>
) {
  return Project.findOne(filter).populate('xorms').exec();
}

const Project = mongoose.model<ProjectDocument, ProjectModel>('Project', ProjectSchema);

export { Project, ProjectDocument, ProjectPopulatedDocument, ProjectSchema };
