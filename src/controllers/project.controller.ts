import { Request, Response } from 'express';
import { Project, ProjectDocument } from '../models/project.model';


const getAll = async (req: Request, res: Response) => {
  
  var allProjects = [];

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

  let body = req.body;

  let project = Project.build(body);
  project.author = 'xxxx'; // req.user._id;
  
  try {
    project.save();
  } catch (e) {
    throw new Error("Error when saving XORM");
  }

  return res.status(201).json({
    project:  project
  })
}

const getOne = async function(req: Request, res: Response) {
  const projectId = req.params.projectId;
  let projectOne: ProjectDocument;

  try {
    projectOne = await Project.findById(projectId).populate('xorms') as ProjectDocument;
    console.log(projectOne);
  } catch (e) {
    throw new Error(`Error when fetching one project ${projectId}`);
  }

  return res.status(201).json({
    data: projectOne
  });
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
    projects: [],
    projectsDetails: {}
  };

  for (const xorm of projectOne.xorms) {
    projectGenerated.projects.push({
      id: xorm.id,
      title: xorm.title
    });

    projectGenerated.projectsDetails[xorm.id] = {
      ...xorm.xorm // as JSON
    }
  }

  return res.status(201).json({
    success: true,
    data: projectGenerated
  });
}

export {
  getOne,
  getAll,
  save,
  download
}

interface ProjectGenerated {
  id: string;
  name: string;
  description: string;
  projects: {
    id: string;
    title: string;
  }[],
  projectsDetails: {[key: string]: any } // JSON }
}
