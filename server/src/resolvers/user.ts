import {
  Arg,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Field,
  Ctx,
  Int
} from "type-graphql";
import { compare, hash } from "bcryptjs";

import { User } from "../entity/User";

import { MyContext } from "../types";
import { createAccessToken, createRefreshToken } from "../utils/auth";

import { sendRefreshToken } from "../utils/sendRefreshToken";
import { getConnection } from "typeorm";
import { verify } from "jsonwebtoken";
import { validateRegister } from "../utils/validateRegister";

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
class LoginResponse extends UserResponse {
  @Field(() => String, { nullable: true })
  accessToken?: string;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext): Promise<User | null> {
    const authorization = req.headers["authorization"];

    if (!authorization) {
      return null;
    }
    try {
      const token = authorization.split(" ")[1];
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      const user = await User.findOne(payload.userId);
      return user;
    } catch (err) {
      return null;
    }
  }

  @Query(() => [User])
  async users() {
    try {
      return await User.find();
    } catch (error) {
      console.log(error);
      return await User.find();
    }
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<UserResponse> {
    const errors = validateRegister(email, password);
    if (errors) {
      return { errors };
    }
    const hashedPassword = await hash(password, 12);
    let user;
    if (password.length <= 3) {
      return { errors: [{ field: "password", message: "password " }] };
    }
    try {
      user = await User.create({ email, password: hashedPassword }).save();
    } catch (error) {
      console.log("error creating user: ", error);
      // duplicate
      if (error.code === "23505") {
        return {
          errors: [{ field: "email", message: "email already taken" }]
        };
      }
    }
    return {
      user
    };
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return {
        errors: [{ field: "email", message: "count not find user" }]
      };
    }
    const valid = await compare(password, user.password);

    if (!valid) {
      return {
        errors: [{ field: "password", message: "incorrect password" }]
      };
    }

    //login successful

    sendRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
      user
    };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: MyContext) {
    sendRefreshToken(res, "");
    return true;
  }

  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(@Arg("userId", () => Int) userId: number) {
    // await User.findOne({where: {id: userId}})
    try {
      await getConnection()
        .getRepository(User)
        .increment({ id: userId }, "tokenVersion", 1);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
    return true;
  }
}
