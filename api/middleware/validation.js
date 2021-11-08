const Users = require("../users-model.js")
const bcrypt = require("bcryptjs")

const checkDuplicates = async (req,res,next) => {
    
    try {      
        const username = req.body.username;
        const user = await Users.findByUserName(username)
        if (user) {
            return res.status(400).json({
                message: "username taken",
            })
        } else {
            next()
        }

    } catch (err) {
        next(err)
    }
}

const checkPayload = (req,res,next) => {  
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(400).json(
            "username and password required"
        )
    } else {
        next()
    }
}

const checkIfUsernameExists = async (req,res,next) => {
    try {
        const username = req.body.username;
        const user = await Users.findByUserName(username)

        if (!user) {
            return res.status(401).send({
              message: "invalid credentials",
          })
        }

        const passwordValid = await bcrypt.compare(req.body.password, user.password)

        if (!passwordValid) {
            return res.status(401).json({
                message: "invalid credentials",
            })
        }
        req.user = user
        next()

    } catch (err) {
        next(err)
    }
}

module.exports = {
    checkDuplicates,
    checkPayload,
    checkIfUsernameExists,
}

