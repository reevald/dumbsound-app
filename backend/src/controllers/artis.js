const { artis } = require("../../models");
const Joi = require("joi");

exports.getAllArtisName = async (req, res) => {
  try {
    const dataAllArtis = await artis.findAll({
      attributes: ["id", "name"]
    });

    res.status(200).send({
      status: "success",
      data: dataAllArtis
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error"
    });
  }
}

exports.addArtis = async (req, res) => {
  // Our validation
  const schema = Joi.object({
    name: Joi.string().trim().min(2).required(),
    old: Joi.number().min(1).required(),
    type: Joi.string().required(),
    startCareer: Joi.string().trim().min(3).required()
  });

  // Do validation
  const { error } = schema.validate(req.body);

  // If error send validation error message
  if (error) return res.status(400).send({
    status: "failed",
    message: error.details[0].message
  });

  try {
    const newArtis = await artis.create({
      name: req.body.name.trim(),
      old: req.body.old,
      type: req.body.type,
      startCareer: req.body.startCareer
    });

    if (newArtis) {
      // Get data artis added
      let dataArtis = await artis.findOne({
        where: {id: newArtis.id},
        attributes: ["id", "name", "old", "type", "startCareer"]
      });

      dataArtis = JSON.parse(JSON.stringify(dataArtis));

      res.status(200).send({
        status: "success",
        data: dataArtis
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
}