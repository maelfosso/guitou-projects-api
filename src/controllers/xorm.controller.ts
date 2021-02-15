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
  let allXorms = [];
  const { projectId } = req.params;

  try {
    // allXorms = await Xorm.find({ author: req.user._id, project: req.params.projectId });
    // allXorms = await Xorm.find({ project: projectId });
    const projectOne = await Project.findById(projectId).populate('xorms');
    if (!projectOne) {
      throw new Error('The project referenced does not exists!');
    }

    allXorms = projectOne.xorms.map(x => {
      return {
        ...x.toObject(),
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
  let xormOne: XormDocument | null;
  let data;

  try {
    // xormOne = await Xorm.findById(xormId);
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

    xormOne = projectOne.xorms.find(x => x.id == xormId);
    if (!xormOne) {
      throw new Error('A xorm from this project referenced does not exists!');
    }    
    
    const { primary, pKeyOrigin } = projectOne.settings.xorms;
    data = {
      ...xormOne.toObject(),
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
  const { body } = req; // JSON.parse(JSON.stringify(req.body));
  
  const set = {
    [req.body.toUpdate]: req.body.values
  }
  
  try {
    await Xorm.findOneAndUpdate({ _id: xormId }, { "$set": set });
  } catch (e) {
    throw new Error(`Error when update xorm: ${xormId}`);
  }

  return res.status(201).json();

}

const remove = async function(req: Request, res: Response) {
  const { projectId, xormId } = req.params;
  
  try {
    await Xorm.remove({ _id: xormId });
    // Also remove xormId into projectId documents
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

// const fetchAllCollaborators = async (req: Request, res: Response) => {
//   const { xormId }= req.params;

//   var xormOne = {};
//   var success = true;
//   var collaborators = undefined;

//   try {
//     xormOne = await Xorm.findById(xormId);
//     collaborators = xormOne.collaborators;
//   } catch (e) {
//     debug("Error when fetch one xorm - " + xormId);
//     debug(e);

//     xormOne = {}
//     success = false;
//   }

//   return res.json({
//     success: success,
//     data: collaborators
//   });
// }

// exports.addCollaborator = async (req, res) => {
//   debug("addCollaborator");
//   var xormId = req.params.xormId;
//   var collaborator = req.body;

//   // collaborator.password = this.hashPassword(collaborator.password);
//   // if (collaborator.salt && collaborator.password) {
//     //   collaborator.password = crypto.pbkdf2Sync(collaborator.password, new Buffer(collaborator.salt, 'base64'), 10000, 64, 'sha1').toString('base64');
//     // } else {
//       //   collaborator.password = collaborator.password;
//       // }

//   Xorm.findById(xormId).then(xorm => {
//     collaborator.salt = crypto.randomBytes(16).toString('base64');
//     collaborator.password = hashPassword(collaborator.salt, collaborator.password);
//     xorm.collaborators.push(collaborator);

//     return xorm.save()
//   }).then(xorm => {

//     return res.json({
//       success: true,
//       data: xorm.collaborators[xorm.collaborators.length - 1]
//     });
//   }).catch(err => {
//     debug(err);

//     return res.json({
//       success: false,
//       err: err
//     });
//   });
// }

// exports.removeCollaborator = async (req, res) => {
//   debug("addCollaborator");
//   var xormId = req.params.xormId;
//   var collaboratorId = req.params.collaboratorId;

//   Xorm.findById(xormId).then(xorm => {
//     xorm.collaborators.id(collaboratorId).remove(); // push(collaborator);

//     return xorm.save();
//   }).then(xorm => {

//     return res.json({
//       success: true,
//       // data: xorm.collaborators[xorm.collaborators.length - 1]
//     });
//   }).catch(err => {
//     debug(err);

//     return res.json({
//       success: false,
//       err: err
//     });
//   });
// }

// exports.collaboratorAuth = async (req, res) => {
//   debug("collaboratorAuth");
//   var xormId = req.params.xormId;
//   var credentials = req.body;
//   var collaborator;

//   debug(credentials);
//   // if (credentials.p)
//   Xorm.findById(xormId).then(xorm => {
//     collaborator = xorm.collaborators.find(collaborator => collaborator.email == credentials.username || collaborator.username == credentials.username); // push(collaborator);

//     if (!collaborator) {
//       return res.status(423).json({
//         success: false,
//         err: "No collaborator"
//       });
//     }

//     if (collaborator.password == hashPassword(collaborator.salt, credentials.password)) {
//       collaborator["password"] = undefined;
//       collaborator["salt"] = undefined;
//       var data = collaborator.toObject();
//       data.xorm = xormId;

//       token.createToken(data, function(err, token) {
//         if (err) {
//           return res.status(400).json({
//             success: false,
//             err:err
//           });
//         }

//         res.status(201).json({
//           success: true,
//           data: data,
//           access_token: token
//         });
//       });
//     } else {
//       return res.status(403).json({
//         success: false,
//         err: "username or password is not good"
//       });
//     }
//   })
// }

