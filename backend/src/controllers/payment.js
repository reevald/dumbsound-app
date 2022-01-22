const { user, payment } =  require("../../models");
const Joi = require("joi");

exports.addPayment = async (req, res) => {
  // Our validation
  const schema = Joi.object({
    startDate: Joi.string().required(),
    dueDate: Joi.string().required(),
    userId: Joi.number().required(),
    status: Joi.string().required(),
    accountNumber: Joi.string().required()
  });

  // Do validation
  const { error } = schema.validate(req.body);

  // If error send validation error message
  if (error) return res.status(400).send({
    status: "failed",
    message: error.details[0].message
  });

  try {
    const newPayment = await payment.create({
      startDate: req.body.startDate,
      dueDate: req.body.dueDate,
      userId: req.body.userId,
      attache: req.files.attache[0].filename,
      status: req.body.status,
      accountNumber: req.body.accountNumber
    });

    if (newPayment) {
      let dataPayment = await payment.findOne({
        where: {id: newPayment.id},
        attributes: ["id", "startDate", "dueDate", "attache", "status"],
        include: [{
          model: user,
          attributes: ["id", "fullName", "email", "gender", "phone", "address"]
        }]
      });

      dataPayment = JSON.parse(JSON.stringify(dataPayment));

      res.status(200).send({
        status: "success",
        data: dataPayment
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

exports.getAllPayments = async (req, res) => {
  try {
    let dataAllPayments = await payment.findAll({
      attributes: ["id", "startDate", "dueDate", "attache", "status"],
      include: [{
        model: user,
        attributes: ["id", "fullName", "email", "gender", "phone", "address"]
      }]
    });

    res.status(200).send({
      status: "success",
      data: dataAllPayments
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
}

exports.updateStatusPaymentById = async (req, res) => {
  const { paymentId } = req.params;
  const { status } = req.body;

  if (!status || (status !== "Pending" && status !== "Approve" && status !== "Cancel")) {
    return res.status(400).send({
      status: "failed",
      message: "credential is invalid"
    });
  }

  // Check id payment if exist
  const checkPayment = await payment.findOne({
    where: {
      id: paymentId
    }
  });
  
  if (!checkPayment) return res.status(400).send({
    status: "failed",
    message: "credential is invalid"
  });

  try {
    await payment.update(
      { status },
      {
        where: {
          id: paymentId
        }
      }
    );

    // Check update data with get data
    const dataPayment = await payment.findOne({
      where: {
        id: paymentId
      }
    });

    if (!dataPayment) return res.status(400).send({
      status: "failed",
      message: "credential is invalid"
    });

    res.status(200).send({
      status: "success",
      data: {
        id: dataPayment.id,
        status: dataPayment.status
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
}