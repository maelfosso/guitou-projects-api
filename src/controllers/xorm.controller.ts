import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Type } from 'typescript';
import { BadRequestError } from '../errors/bad-request-error';
import { Project } from '../models/project.model';
import { Xorm, XormDocument } from '../models/xorm.model';

const save = async (req: Request, res: Response) => {
  let body = req.body;
  const { projectId } = req.params;

  let xorm = new Xorm(body);
  xorm.project = projectId;
  
  const projectOne = await Project.findById(projectId);
  if (!projectOne) {
    throw new BadRequestError('The project referenced does not exists!');
  }

  try {
    await xorm.save();

    projectOne.xorms = [...projectOne.xorms, xorm.id];
    if (!projectOne.settings.xorms.primary) {
      projectOne.settings.xorms.primary = xorm.id;
    }
    await projectOne.save();
  } catch (e) {
    throw new BadRequestError("Error when saving XORM");
  }

  return res.status(200).json(xorm);
}

const getAll = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  let allXorms = [];

  const project = await Project.findByIdWithXorms(projectId); //.populate('xorms');
  if (!project) {
    throw new BadRequestError('The project referenced does not exists!');
  }

  allXorms = project.xorms.map((x:XormDocument) => {
    return {
      ...x.toJSON(),
      level: project.settings.xorms.primary == x.id ? 'primary' : 'secondary'
    }
  });

  return res.status(201).json(allXorms);
}

const getOne = async function(req: Request, res: Response) {
  const { projectId, xormId } = req.params;
  let xormOne: XormDocument | undefined;
  let data;

  const projectOne = await Project.findOneWithXorms(
    {
      $and: [
        { _id: projectId },
        { xorms: Types.ObjectId(xormId) }
      ]
    }
  );
  if (!projectOne) {
    throw new BadRequestError('The project referenced does not exists!');
  }

  xormOne = projectOne.xorms.find((x: XormDocument) => x.id == xormId);
  if (!xormOne) {
    throw new BadRequestError('A xorm from this project referenced does not exists!');
  }    
  
  const { primary, pKeyOrigin } = projectOne.settings.xorms;
  data = {
    ...xormOne.toJSON(),
    level: primary == xormId ? 'primary' : 'secondary',
    pKeyOrigin    
  }

  return res.status(200).json(data);
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
      $pull: { xorms: Types.ObjectId(xormId) },
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
