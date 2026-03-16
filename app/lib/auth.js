import jwt from "jsonwebtoken"

export function verifyAccessToken(token) {
    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        )


        if (decoded.type !== "access") {
            throw new Error("Invalid token type")
        }

        return decoded
    } catch (err) {
        throw new Error("Invalid or expired access token")
    }
}

export function verifyRefreshToken(token) {
    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        )

        if (decoded.type !== "refresh") {
            throw new Error("Invalid token type")
        }

        return decoded
    } catch (err) {
        throw new Error("Invalid or expired refresh token")
    }
}