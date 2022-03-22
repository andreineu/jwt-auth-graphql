import { MyContext } from "src/types";
import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";

// authorization header -> 'bearer 148914fdsjqw...'

export const createAuthMiddleware = (
  /**callback to execute when not authorized, before throwing error */
  cb: Function
) => {
  const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
    const authorization = context.req.headers["authorization"];

    if (!authorization) {
      cb();
      throw new Error("not authenticated");
    }
    try {
      const token = authorization.split(" ")[1];
      const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      context.payload = payload as any;
    } catch (err) {
      cb();
      throw new Error("not authenticated");
    }

    return next();
  };
  return isAuth;
};

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  const authorization = context.req.headers["authorization"];

  if (!authorization) {
    throw new Error("not authenticated");
  }
  try {
    const token = authorization.split(" ")[1];
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    context.payload = payload as any;
  } catch (err) {
    // console.log(err);
    throw new Error("not authenticated");
  }

  return next();
};
