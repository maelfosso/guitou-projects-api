import { Request, Response } from 'express';
import { Project } from '../models/project.model';
import { Xorm, XormDocument } from '../models/xorm.model';

const save = async (req: Request, res: Response) => {
  let body = req.body;
  const { projectId } = req.params;

  let xorm = new Xorm(body);
  xorm.project = projectId;
  
  try {
    
    const projectOne = await Project.findById(projectId);
    if (!projectOne) {
      throw new Error('The project referenced does not exists!');
    }

    await xorm.save();

    projectOne.xorms = [...projectOne.xorms, xorm.id];
    if (!projectOne.settings.xorms.primary) {
      projectOne.settings.xorms.primary = xorm.id;
    }
    await projectOne.save();
  } catch (e) {
    throw new Error("Error when saving XORM");
  }

  return res.status(201).json({
    data: xorm
  })
}

const getAll = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  let allXorms = [];

  try {
    const projectOne = await Project.findById(projectId).populate('xorms');
    if (!projectOne) {
      throw new Error('The project referenced does not exists!');
    }

    allXorms = projectOne.xorms.map((x:XormDocument) => {
      return {
        ...x.toJSON(),
        level: projectOne.settings.xorms.primary == x.id ? 'primary' : 'secondary'
      }
    });
  } catch(e) {
    throw new Error("Error when fetching xorms....");
  }

  return res.status(201).json({
    data: allXorms
  });
}

const getOne = async function(req: Request, res: Response) {
  const { projectId, xormId } = req.params;
  let xormOne: XormDocument | undefined;
  let data;

  try {
    const projectOne = await Project.findOne(
      {
        $and: [
          { _id: projectId },
          { xorms: xormId }
        ]
      }
    ).populate('xorms');
    if (!projectOne) {
      throw new Error('The project referenced does not exists!');
    }

    xormOne = projectOne.xorms.find((x: XormDocument) => x.id == xormId);
    if (!xormOne) {
      throw new Error('A xorm from this project referenced does not exists!');
    }    
    
    const { primary, pKeyOrigin } = projectOne.settings.xorms;
    data = {
      ...xormOne.toJSON(),
      level: primary == xormId ? 'primary' : 'secondary',
      pKeyOrigin    
    }
  } catch (e) {
    throw new Error("Error when fetch one xorm - " + xormId);
  }

  return res.status(201).json({
    data
  });
}

const update = async function(req: Request, res: Response) {
  const { xormId } = req.params;
  const { body } = req;
  
  const set = {
    [body.toUpdate]: body.values
  }
  
  try {
    await Xorm.findByIdAndUpdate(xormId, { "$set": set });
  } catch (e) {
    throw new Error(`Error when update xorm: ${xormId}`);
  }

  return res.status(201).json();
}

const remove = async function(req: Request, res: Response) {
  const { projectId, xormId } = req.params;
  
  try {
    await Project.findByIdAndUpdate(projectId, {
      $pull: { xorms: xormId },
    });
    await Xorm.remove({ _id: xormId });
  } catch (e) {
    throw new Error(`Error when update xorm: ${xormId}`);
  }

  return res.status(201).json();
}

export {
  save,
  getAll,
  getOne,
  update,
  remove
};
