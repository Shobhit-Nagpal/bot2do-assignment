import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

export function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
}

export function generateToken(email: string) {
    return jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

export function verifyToken(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET);
}