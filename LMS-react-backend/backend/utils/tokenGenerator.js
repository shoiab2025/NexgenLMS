
import jwt from 'jsonwebtoken'

const generatedTokenAndCookie = (user, res) => {
    // Generate JWT token
    const payload = { id: user._id }
    const token = jwt.sign(payload, '3988862d48ed98eed748f2487ae4bdd6ea61b9f5cd46a4cd0220db760cf2d82a', { expiresIn: '15d' })

    // Set JWT as a cookie in the response
    res.cookie('jwt', token, { maxAge: 15 * 24 * 60 * 60 * 1000, expiresIn: '15d', httpOnly: true })
}

export default generatedTokenAndCookie