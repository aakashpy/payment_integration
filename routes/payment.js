require("dotenv").config();
const express = require("express");
const Razorpay = require("razorpay");

const router = express.Router();

router.post("/", async (req, res) => {
    const instance = new Razorpay({
        key_id: process.env.REACT_APP_KEYID,
        key_secret: process.env.REACT_APP_KEYSECRET,
    });

    const options = req.body;
    instance.orders.create(options, function (err, order) {
        return res.json(order);
    });
});

module.exports = router;
