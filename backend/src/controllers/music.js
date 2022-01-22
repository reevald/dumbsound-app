const { music, artis } =  require("../../models");
const Joi = require("joi");

exports.addMusic = async (req, res) => {
  // Our validation
  const schema = Joi.object({
    title: Joi.string().trim().min(2).required(),
    year: Joi.string().trim().min(3).required(),
    artisId: Joi.number().required()
  });

  // Do validation
  const { error } = schema.validate(req.body);

  // If error send validation error message
  if (error) return res.status(400).send({
    status: "failed",
    message: error.details[0].message
  });

  try {
    const newMusic = await music.create({
      title: req.body.title.trim(),
      year: req.body.year,
      thumbnail: req.files.thumbnail[0].filename,
      attache: req.files.attache[0].filename,
      artisId: req.body.artisId
    });

    if (newMusic) {
      let dataMusic = await music.findOne({
        where: {id: newMusic.id},
        attributes: ["id", "title", "year", "thumbnail", "attache"],
        include: [{
          model: artis,
          as: "artis",
          attributes: ["id", "name", "old", "type", "startCareer"]
        }]
      });

      dataMusic = JSON.parse(JSON.stringify(dataMusic));

      res.status(200).send({
        status: "success",
        data: dataMusic
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error"
    });
  }
}

exports.getAllMusics = async (req, res) => {
  try {
    const dataAllMusic = await music.findAll({
      attributes: ["id", "title", "year", "thumbnail", "attache"],
      include: [{
        model: artis,
        as: "artis",
        attributes: ["id", "name", "old", "type", "startCareer"]
      }]
    });

    res.status(200).send({
      status: "success",
      data: dataAllMusic
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
}