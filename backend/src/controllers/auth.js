const { user, payment } = require("../../models");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.checkAuth = async (req, res) => {
  try {
    const dataUser = await user.findOne({
      where: { id: req.user.id }, // get by data in jwt
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"]
      }
    });

    if (!dataUser) return res.status(400).send({
      status: "failed",
      message: "credential is invalid"
    });

    // Upadate jwt (maybe jwt will be expire)
    const token = jwt.sign({
      id: dataUser.id,
      fullName: dataUser.fullName,
      email: dataUser.email,
      listAs: dataUser.listAs
    }, process.env.TOKEN_KEY);

    // ====== Check Subscribe Status ======
    // FindOne = 1 month sub until end then can sub again
    const dataApprovePayment = await payment.findOne({
      where: {
        userId: dataUser.id,
        status: "Approve"
      },
      attributes: ["dueDate"],
      order: [['createdAt', 'DESC']] // latest approve
    });

    let statusSub = "Not Active";
    let remainDay = "";
    if (dataApprovePayment) {
      const dueDate = dataApprovePayment.dueDate.split("/");
      // Swap month and day
      const millisecondDueDate = Date.parse(`${dueDate[1]}/${dueDate[0]}/${dueDate[2]}`);
      const millisecondNowDate = Date.now();
      if (millisecondNowDate <= millisecondDueDate) {
        const millisecondPerDay = 86400 * 1000;
        const diffDays = Math.ceil(
          (millisecondDueDate - millisecondNowDate) / millisecondPerDay
        )
        remainDay = `${diffDays}`;
        statusSub = "Active";
      }
    } else { // If not active but has pending status
      const dataPendingPayment = await payment.findOne({
        where: {
          userId: dataUser.id,
          status: "Pending"
        }
      });
      if (dataPendingPayment) {
        statusSub = "Pending";
      }
    }

    res.status(200).send({
      status: "success",
      data: {
        user: {
          id: dataUser.id,
          fullName: dataUser.fullName,
          email: dataUser.email,
          listAs: dataUser.listAs,
          statusSub,
          remainDay,
          token
        }
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error"
    });
  }
}

exports.login = async (req, res) => {
  // Our validation schema here
  const schema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(5).required()
  });

  // Do validation and get error object from schema.validate
  const { error } = schema.validate(req.body);

  // If error send validation error massage
  if (error) return res.status(400).send({
    error: {
      message: error.details[0].message
    }
  });

  try {
    // Check email first
    const dataUser = await user.findOne({
      where: {
        email: req.body.email.trim()
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    });

    // If email is not exist
    if (!dataUser) return res.status(400).send({
      status: "failed",
      message: "credential is invalid"
    });

    // Compare password between entered from client and from database
    const isValid = await bcrypt.compare(
      req.body.password,
      dataUser.password
    );

    // Check if not valid then return response with status 400 (bad request)
    if (!isValid) return res.status(400).send({
      status: "failed",
      message: "credential is invalid"
    });

    // Generate token jwt
    const token = jwt.sign({
      id: dataUser.id,
      fullName: dataUser.fullName,
      email: dataUser.email,
      listAs: dataUser.listAs
    }, process.env.TOKEN_KEY);

    // ====== Check Subscribe Status ======
    // FindOne = 1 month sub until end then can sub again
    const dataApprovePayment = await payment.findOne({
      where: {
        userId: dataUser.id,
        status: "Approve"
      },
      attributes: ["dueDate"],
      order: [['createdAt', 'DESC']] // latest approve
    });

    let statusSub = "Not Active";
    let remainDay = "";
    if (dataApprovePayment) {
      const dueDate = dataApprovePayment.dueDate.split("/");
      // Swap month and day
      const millisecondDueDate = Date.parse(`${dueDate[1]}/${dueDate[0]}/${dueDate[2]}`);
      const millisecondNowDate = Date.now();
      if (millisecondNowDate <= millisecondDueDate) {
        const millisecondPerDay = 86400 * 1000;
        const diffDays = Math.ceil(
          (millisecondDueDate - millisecondNowDate) / millisecondPerDay
        )
        remainDay = `${diffDays}`;
        statusSub = "Active";
      }
    } else { // If not active but has pending status
      const dataPendingPayment = await payment.findOne({
        where: {
          userId: dataUser.id,
          status: "Pending"
        }
      });
      if (dataPendingPayment) {
        statusSub = "Pending";
      }
    }

    res.status(200).send({
      status: "success",
      data: {
        user: {
          id: dataUser.id,
          fullName: dataUser.fullName,
          email: dataUser.email,
          listAs: dataUser.listAs,
          statusSub,
          remainDay,
          token
        }
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error"
    });
  }
}

exports.register = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(5).required(),
    fullName: Joi.string().trim().min(4).required(),
    listAs: Joi.string().min(1).required(),
    gender: Joi.string().min(3).required(),
    phone: Joi.string().min(8).required(),
    address: Joi.string().min(4).required()
  });

  const { error } = schema.validate(req.body);

  if (error) return res.status(400).send({
    status: "failed",
    message: error.details[0].message
  });

  try {
    // Check if email already exist in database
    const isUserExist = await user.findOne({
      where: {
        email: req.body.email.trim()
      }
    });

    if (isUserExist) return res.status(400).send({
      status: "failed",
      message: "email already exist"
    });

    // encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = await user.create({
      email: req.body.email.trim(),
      password: hashPassword,
      fullName: req.body.fullName,
      listAs: req.body.listAs,
      gender: req.body.gender,
      phone: req.body.phone,
      address: req.body.address
    });

    // Sign JWT here
    const token = jwt.sign({
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      listAs: newUser.listAs
    }, process.env.TOKEN_KEY);

    // ====== Check Subscribe Status ======
    // FindOne = 1 month sub until end then can sub again
    const dataApprovePayment = await payment.findOne({
      where: {
        userId: newUser.id,
        status: "Approve"
      },
      attributes: ["dueDate"],
      order: [['createdAt', 'DESC']] // latest approve
    });

    let statusSub = "Not Active";
    let remainDay = "";
    if (dataApprovePayment) {
      const dueDate = dataApprovePayment.dueDate.split("/");
      // Swap month and day
      const millisecondDueDate = Date.parse(`${dueDate[1]}/${dueDate[0]}/${dueDate[2]}`);
      const millisecondNowDate = Date.now();
      if (millisecondNowDate <= millisecondDueDate) {
        const millisecondPerDay = 86400 * 1000;
        const diffDays = Math.ceil(
          (millisecondDueDate - millisecondNowDate) / millisecondPerDay
        )
        remainDay = `${diffDays}`;
        statusSub = "Active";
      }
    } else { // If not active but has pending status
      const dataPendingPayment = await payment.findOne({
        where: {
          userId: newUser.id,
          status: "Pending"
        }
      });
      if (dataPendingPayment) {
        statusSub = "Pending";
      }
    }

    res.status(200).send({
      status: "success",
      data: {
        user: {
          id: newUser.id,
          fullName: newUser.fullName,
          email: newUser.email,
          listAs: newUser.listAs,
          statusSub,
          remainDay,
          token
        }
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