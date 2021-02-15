import { Request, Response } from 'express';
import { Project, ProjectDocument } from '../models/project.model';
import { Xorm, XormDocument } from '../models/xorm.model';


const getAll = async (req: Request, res: Response) => {
  let allProjects: ProjectDocument[] = [];

  try {
    allProjects = await Project.find({ author: 'xxxx' });
  } catch(e) {
    throw new Error("Error when fetching projects.");
  }

  return res.status(201).json({
    data: allProjects
  });
}

const save = async (req: Request, res: Response) => {
  let { body } = req;

  let project = Project.build(body);
  project.author = 'xxxx';
  
  try {
    project.save();
  } catch (e) {
    throw new Error("Error when saving XORM");
  }

  return res.status(201).json({
    data: project.toJSON()
  })
}

const getOne = async function(req: Request, res: Response) {
  const { projectId } = req.params;
  let projectOne: ProjectDocument;

  try {
    projectOne = await Project.findById(projectId).populate('xorms') as ProjectDocument;
  } catch (e) {
    throw new Error(`Error when fetching one project ${projectId}`);
  }

  return res.status(201).json({
    data: projectOne
  });
}

const update = async function (req: Request, res: Response) {
  const { body, params } = req;
  const { projectId } = params;

  try {
    await Xorm.findByIdAndUpdate(projectId, body);
  } catch (e) {
    throw new Error(`Error occured when updating project ${projectId}`);
  }

  return res.status(201).json();
}

const remove = async function (req: Request, res: Response) {
  const { projectId } = req.params;

  try {
    const projectOne = await Project.findById(projectId);
    if (!projectOne) {
      throw new Error(`Sorry but the project ${projectId} does not exists`);
    }

    await Xorm.remove({_id: { "$in": projectOne.xorms }});
  } catch {
    throw new Error(`Error occured when deleting project ${projectId}`);
  }

  return res.status(201).json();
}

const download = async function(req: Request, res: Response) {
  const projectId = req.params.projectId;
  let projectGenerated: ProjectGenerated;
  let projectOne

  try {
    projectOne = await Project.findById(projectId).populate('xorms');
  } catch (e) {
    throw new Error('Error when finding project to generated');
  }

  if (!projectOne) {
    return res.status(201).json({
      data: undefined
    });
  }

  projectGenerated = {
    id: projectOne.id,
    name: projectOne.title,
    description: projectOne.description,
    xorms: [],
    xormsDetails: {}
  };

  for (let _i = 0; _i < projectOne.xorms.length; _i++) {
    const xorm = projectOne.xorms[_i] as XormDocument;

    projectGenerated.xorms.push({
      id: xorm.id,
      title: xorm.title
    });

    projectGenerated.xormsDetails[xorm.id] = {
      ...xorm.xorm
    }
  }

  return res.status(201).json({
    data: projectGenerated
  });
}

export {
  getOne,
  getAll,
  save,
  update,
  remove,
  download
}

interface ProjectGenerated {
  id: string;
  name: string;
  description: string;
  xorms: {
    id: string;
    title: string;
  }[],
  xormsDetails: {[key: string]: any } // JSON }
}
