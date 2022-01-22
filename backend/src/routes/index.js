const express = require("express");

const router = express.Router();

// Middleware
const { auth, adminOnly } = require("../middleware/auth");
const { uploadFile } = require("../middleware/uploadFlexFile");

// Controller
const {
  login,
  register,
  checkAuth
} = require("../controllers/auth");

const {
  addArtis,
  getAllArtisName
} = require("../controllers/artis");

const {
  addMusic,
  getAllMusics
} = require("../controllers/music");

const {
  addPayment,
  getAllPayments,
  updateStatusPaymentById
} = require("../controllers/payment");

// Route
// Register and Login
router.post("/register", register);
router.post("/login", login);
// Auto check valid jwt (Check auth, refresh page handler)
router.get("/check-auth", auth, checkAuth);
// Music
router.get("/musics", getAllMusics);
router.post("/music", auth, adminOnly, 
  uploadFile({
    imageFN:{"thumbnail": 1},
    musicFN:{"attache": 1}}
  ),
  addMusic
);
// Artis
router.get("/all-artis-name", auth, adminOnly, getAllArtisName); // ComboBox form music
router.post("/artis", auth, adminOnly, addArtis);
// // Payment
router.get("/transactions", auth, adminOnly, getAllPayments);
router.post("/transaction", auth, uploadFile({imageFN:{"attache": 1}}), addPayment);
router.patch("/transaction/:paymentId", auth, adminOnly, updateStatusPaymentById);
module.exports = router;