const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = require("../models/user.model");
const Cart = require("../models/cart.model");

const { generateToken } = require("../helpers/generateString");

// [POST] /auth/register
module.exports.register = async (req, res) => {
    try {
        const { email, password, confirmPassword, user_name, phone, address } =
            req.body;

        // kiểm tra email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(422).json({
                code: 422,
                message: "Email không hợp lệ",
            });
            return;
        }

        const mailExist = await User.findOne({
            where: {
                email: email,
            },
        });
        if (mailExist) {
            res.status(422).json({
                code: 422,
                message: "Email đã tồn tại",
            });
            return;
        }
        // Hết kiểm tra email

        // kiểm tra password
        if (password.length < 6) {
            res.status(422).json({
                code: 422,
                message: "Mật khẩu phải có ít nhất 6 ký tự",
            });
            return;
        }

        if (password !== confirmPassword) {
            res.status(422).json({
                code: 422,
                message: "Mật khẩu không trùng khớp",
            });
            return;
        }
        // Hết kiểm tra password

        // kiểm tra user_name
        if (!user_name) {
            res.status(422).json({
                code: 422,
                message: "Tên người dùng không được để trống",
            });
            return;
        }
        // Hết kiểm tra user_name

        // kiểm tra phone
        const phoneRegex = /^0\d{9}$/;
        if (!phoneRegex.test(phone)) {
            res.status(422).json({
                code: 422,
                message: "Số điện thoại không hợp lệ",
            });
            return;
        }

        const phoneExist = await User.findOne({
            where: {
                phone: phone,
            },
        });
        if (phoneExist) {
            res.status(422).json({
                code: 422,
                message: "Số điện thoại đã tồn tại",
            });
            return;
        }

        // Hết kiểm tra phone

        // kiểm tra address
        if (!address) {
            res.status(422).json({
                code: 422,
                message: "Địa chỉ không được để trống",
            });
            return;
        }
        // Hết kiểm tra address

        const passHash = await bcrypt.hash(password, saltRounds);
        const token = generateToken(32);

        const userNew = await User.create({
            user_name: user_name,
            email: email,
            password: passHash,
            phone: phone,
            address: address,
            token: token,
        });

        delete userNew.dataValues.password;

        const cartNew = await Cart.create({
            user_id: userNew.id,
        });

        res.status(201).json({
            code: 201,
            message: "Register Success",
            user: userNew.dataValues,
            cart: cartNew.dataValues,
        });
    } catch (error) {
        console.log("Error controller register: ", error);
        res.status(500).json({
            code: 500,
            message: "Error internal server: " + error.message,
        });
    }
};

// [POST] /auth/login
module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userLogin = await User.findOne({
            where: {
                email: email,
            },
        });

        if (!userLogin) {
            res.status(422).json({
                code: 422,
                message: "Email không tồn tại",
            });
            return;
        }

        const checkPass = await bcrypt.compare(password, userLogin.password);

        if (!checkPass) {
            res.status(422).json({
                code: 422,
                message: "Mật khẩu không chính xác",
            });
            return;
        }

        delete userLogin.dataValues.password;

        const cart = await Cart.findOne({
            where: {
                user_id: userLogin.id,
            },
        });

        res.status(200).json({
            code: 200,
            message: "Login Success",
            user: userLogin.dataValues,
            cart: cart.dataValues,
        });
    } catch (error) {
        console.log("Error controller login: ", error);
        res.status(500).json({
            code: 500,
            message: "Error internal server: " + error.message,
        });
    }
};
