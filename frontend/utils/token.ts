import * as jwt_decode from "jwt-decode";

interface DecodedToken {
  exp: number; 
  iat: number;
  id: string;
  role: string;
}

export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;

  try {
    const decoded: DecodedToken = jwt_decode(token);
    const now = Date.now() / 1000; // in seconds
    return decoded.exp < now;
  } catch (err) {
    return true;
  }
};
