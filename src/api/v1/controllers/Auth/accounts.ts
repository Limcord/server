import { Request, Response } from "express";
import { Check, Filter, Limit } from "../../decorators";
import { User, UserOptions } from "../../entities";
import { Controller } from "../../structures/Controller";

export class AccountsController extends Controller("/auth/accounts") {
  @Check(
    {
      water: "string|max:10|min:5",
    },
    "body"
  )
  @Limit("5/10s")
  async "POST /login"(req: Request, res: Response) {
    const data = await User.findOne({ username: "first" });
    res.send(data);
  }

  @Check(
    {
      email: "string|min:6|max:320",
      password: "string|min:8|max:256",
      username: "string|min:1|max:30",
    },
    "body"
  )
  @Limit("100/1m")
  @Filter(
    {
      username: (username) => username.trim(),
      email: (email) => email.trim(),
      password: (password) => password.trim(),
    },
    "body"
  )
  async "POST /register"(req: Request, res: Response) {
    const { email, password, username } = req.body as UserOptions;

    const isUsername = await User.findOne({ username });
    const isEmail = await User.findOne({ email });

    if (isEmail) {
      return res.send({
        message: "this email is allready used, please try another email.",
      });
    }
    if (isUsername) {
      return res.send({
        message: "this username is allready used, please try another username.",
      });
    }
    const user = User.from({
      email: email,
      password: password,
      username: username,
      verified: true,
    });
    user.save();
    res.send(user);
  }
}
