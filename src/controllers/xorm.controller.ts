import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { Xorm, XormDocument } from '../models/xorm.model';


const getAll = async (req: Request, res: Response) => {
  
  var allXorms = [];

  try {
    allXorms = await Xorm.find({ author: 'xxxx' });
  } catch(e) {
    throw new Error("Error when fetching xorms.");
  }

  return res.status(201).json({
    data: allXorms
  });
}

const save = async (req: Request, res: Response) => {

  let body = req.body;

  let xorm = Xorm.build(body);
  xorm.author = 'xxxx'; // req.user._id;
  
  try {
    xorm.save();
  } catch (e) {
    throw new Error("Error when saving XORM");
  }

  return res.status(201).json({
    xorm:  xorm
  })
}

const getOne = async function(req: Request, res: Response) {
  const xormId = req.params.xormId;
  let xormOne: XormDocument;

  try {
    xormOne = await Xorm.findById(xormId).populate('forms') as XormDocument;
    console.log(xormOne);
  } catch (e) {
    throw new Error(`Error when fetching one xorm ${xormId}`);
  }

  return res.status(201).json({
    data: xormOne
  });
}

const download = async function(req: Request, res: Response) {
  const xormId = req.params.xormId;
  let xormGenerated: XormGenerated;
  let xormOne

  try {
    xormOne = await Xorm.findById(xormId).populate('forms');
  } catch (e) {
    throw new Error('Error when finding xorm to generated');
  }

  if (!xormOne) {
    return res.status(201).json({
      data: undefined
    });
  }

  xormGenerated = {
    id: xormOne.id,
    name: xormOne.title,
    description: xormOne.description,
    xorms: [],
    xormsDetails: {}
  };

  for (const form of xormOne.forms) {
    xormGenerated.xorms.push({
      id: form.id,
      title: form.title
    });

    xormGenerated.xormsDetails[form.id] = {
      ...form.form // as JSON
    }
  }

  return res.status(201).json({
    success: true,
    data: xormGenerated
  });
}

export default {
  getOne,
  getAll,
  save,
  download
}

interface XormGenerated {
  id: string;
  name: string;
  description: string;
  xorms: {
    id: string;
    title: string;
  }[],
  xormsDetails: {[key: string]: any } // JSON }
}
