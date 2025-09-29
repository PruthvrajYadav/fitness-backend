const User = require("../Model/user")
const jwt = require('jsonwebtoken')
const bcrypt = require("bcryptjs")

exports.getUser = async (req, res) => {
    try {
        const data = await User.find()
        return res.json({ errors: false, data: data })
    } catch (error) {
        return res.status(500).json({ errors: true, message: error.message })
    }
}

exports.postUser = async (req, res) => {
    try {
        const userExit = await User.findOne({ email: req.body.email })
        if (userExit) return res.status(500).json({ errors: true, message: "user already exit" })
        // const s= await bcrypt
        const salt = await bcrypt.genSalt(10) // ✅

        req.body.password = await bcrypt.hash(req.body.password, salt)

        const data = await User.create(req.body)
        return res.json({ errors: false, data: data })
    } catch (error) {
        return res.status(500).json({ errors: true, message: error.message })
    }
}

exports.putUser = async (req, res) => {
    try {
        const data = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
        return res.json({ errors: false, data: data })
    } catch (error) {
        return res.status(500).json({ errors: true, message: error.message })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const data = await User.findByIdAndDelete(req.params.id)
        return res.json({ errors: false, data: data })
    } catch (error) {
        return res.status(500).json({ errors: true, message: error.message })
    }
}

// exports.login = async (req, res) => {
//     try {
//         const userExit = await User.findOne({ email: req.body.email })
//         if (!userExit) return res.status(500).json({ errors: true, message: "email or password is invalid" })

//         const comparePassword = await bcrypt.compare(req.body.password, userExit.password)
//         if (!comparePassword) return res.status(500).json({ errors: true, message: "email or password is invalid" })

//         const token = await jwt.sign({ _id: userExit._id }, process.env.SEC)
//         return res.json({ errors: false, data: { user: userExit, token: token } })
//     } catch (error) {
//         return res.status(500).json({ errors: true, message: error.message })
//     }
// }

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ errors: true, message: "email or password is invalid" });
        }

        // Always check with bcrypt (bcrypt handles $2a$, $2b$, etc.)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ errors: true, message: "email or password is invalid" });
        }

        // Make sure secret key exists
        if (!process.env.SEC) {
            return res.status(500).json({ errors: true, message: "Server misconfiguration: missing JWT secret" });
        }

        const token = jwt.sign({ _id: user._id }, process.env.SEC, { expiresIn: "1d" });

        return res.json({ errors: false, data: { user, token } });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ errors: true, message: error.message });
    }
};

