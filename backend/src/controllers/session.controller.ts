import { Request, Response } from "express";
import { validatePassword } from "../services/user.service";
import {
  createSession,
  findSessions,
  updateSession,
} from "../services/session.service";
import { signJWT } from "../utils/jws";
import config from "config";

export async function createSenssionHandler(req: Request, res: Response) {
  //Validate user password
  const user = await validatePassword(req.body);
  if (!user) return res.status(401).send("Invalid email or password");
  //Create a session
  const session = await createSession(user._id, req.get("user-agent") || "");
  //Create an access token
  const accessToken = signJWT(
    { ...user, session: session._id },
    {
      expiresIn: config.get<string>("accessTokenTtl"), // 15 minutes token
    }
  );
  //Create a refresh token
  const refreshToken = signJWT(
    { ...user, session: session._id },
    {
      expiresIn: config.get<string>("refreshTokenTtl"), // 1 year token
    }
  );
  //Return access and tokens
  return res.send({ accessToken, refreshToken });
}

export async function getUserSessionsHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;

  const sessions = await findSessions({ user: userId, valid: true });

  return res.send(sessions);
}

export async function deleteSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.session;
  console.log(res.locals);

  await updateSession({ _id: sessionId }, { valid: false });

  return res.send({
    accessToken: null,
    refreshToke: null,
  });
}
