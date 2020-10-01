
export function mergeObject<T>(o1:any, o2:any): T {
    return {...o1, ...o2};
}

/*
export const verifyToken = (token: string | undefined): any => {
    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY);
        return decoded.data;
    } catch (err) {
        return {};
    }
};

export const createToken = (data: any, type: TokenType) => {
    if (type === "ACCESS_TOKEN") {
        return jwt.sign({data}, process.env.JWT_SECRET_KEY, {expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE});
    }
    if (type === "REFRESH_TOKEN") {
        return jwt.sign({data}, process.env.JWT_SECRET_KEY, {expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE});
    }
};
*/
