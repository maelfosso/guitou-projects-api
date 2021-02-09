import { Request, Response } from 'express';
import { Form, FormDocument } from '../models/form.model';

const save = async (req: Request, res: Response) => {
  let body = req.body;
  const { xormId } = req.params;

  let xorm = new Form(body);
  xorm.xorm = xormId;
  
  try {
    xorm.save();
  } catch (e) {
    throw new Error("Error when saving XORM");
  }

  return res.status(201).json({
    xorm:  xorm
  })
}

const getAll = async (req: Request, res: Response) => {
  let allForms = [];
  const { xormId } = req.params;

  try {
    // allForms = await Form.find({ author: req.user._id, xorm: req.params.xormId });
    allForms = await Form.find({ xorm: xormId });
  } catch(e) {
    throw new Error("Error when fetching forms....");
  }

  return res.status(201).json({
    data: allForms
  });
}

const getOne = async function(req: Request, res: Response) {
  const { formId } = req.params;
  let formOne: FormDocument | null;

  try {
    formOne = await Form.findById(formId);
  } catch (e) {
    throw new Error("Error when fetch one form - " + formId);
  }

  return res.status(201).json({
    data: formOne
  });
}

const update = function(req: Request, res: Response) {
  const { formId } = req.params;
  const { body } = req; // JSON.parse(JSON.stringify(req.body));
  
  const set = {
    [req.body.toUpdate]: req.body.values
  }
  
  try {
    Form.findOneAndUpdate({ _id: formId }, { "$set": set });
  } catch (e) {
    throw new Error(`Error when update form: ${formId}`);
  }

  return res.status(201).json({
    success: true
  });

}

// const fetchAllCollaborators = async (req: Request, res: Response) => {
//   const { formId }= req.params;

//   var formOne = {};
//   var success = true;
//   var collaborators = undefined;

//   try {
//     formOne = await Form.findById(formId);
//     collaborators = formOne.collaborators;
//   } catch (e) {
//     debug("Error when fetch one form - " + formId);
//     debug(e);

//     formOne = {}
//     success = false;
//   }

//   return res.json({
//     success: success,
//     data: collaborators
//   });
// }

// exports.addCollaborator = async (req, res) => {
//   debug("addCollaborator");
//   var formId = req.params.formId;
//   var collaborator = req.body;

//   // collaborator.password = this.hashPassword(collaborator.password);
//   // if (collaborator.salt && collaborator.password) {
//     //   collaborator.password = crypto.pbkdf2Sync(collaborator.password, new Buffer(collaborator.salt, 'base64'), 10000, 64, 'sha1').toString('base64');
//     // } else {
//       //   collaborator.password = collaborator.password;
//       // }

//   Form.findById(formId).then(form => {
//     collaborator.salt = crypto.randomBytes(16).toString('base64');
//     collaborator.password = hashPassword(collaborator.salt, collaborator.password);
//     form.collaborators.push(collaborator);

//     return form.save()
//   }).then(form => {

//     return res.json({
//       success: true,
//       data: form.collaborators[form.collaborators.length - 1]
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
//   var formId = req.params.formId;
//   var collaboratorId = req.params.collaboratorId;

//   Form.findById(formId).then(form => {
//     form.collaborators.id(collaboratorId).remove(); // push(collaborator);

//     return form.save();
//   }).then(form => {

//     return res.json({
//       success: true,
//       // data: form.collaborators[form.collaborators.length - 1]
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
//   var formId = req.params.formId;
//   var credentials = req.body;
//   var collaborator;

//   debug(credentials);
//   // if (credentials.p)
//   Form.findById(formId).then(form => {
//     collaborator = form.collaborators.find(collaborator => collaborator.email == credentials.username || collaborator.username == credentials.username); // push(collaborator);

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
//       data.form = formId;

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

exports.download = async (req, res) => {
  var formId = req.params.formId;
  var formOne = {};
  var success = true;

  debug("\nDownload XORMS");

  try {
    formOne = await Form.findById(formId);
    console.log(formOne);
  } catch (e) {
    debug("Error when fetch one form - " + formId);
    debug(e);

    formOne = {}
    success = false;
  }

  return res.json({
    success: success,
    data: formOne
  });
}
