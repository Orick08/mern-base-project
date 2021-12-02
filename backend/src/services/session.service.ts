import { FilterQuery, UpdateQuery } from "mongoose";
import SessionModel, { SessionDocument } from "../models/session.model";
import { verifyJWT, signJWT } from "../utils/jws";
import { get } from "lodash";
import { findUser } from "../services/user.service";
import config from "config";

export async function createSession(userId: any, userAgent: string) {
  const session = await SessionModel.create({ user: userId, userAgent });

  return session.toJSON();
}

export async function findSessions(query: FilterQuery<SessionDocument>) {
  return SessionModel.find(query).lean();
}

export async function updateSession(
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>
) {
  return SessionModel.updateOne(query, update);
}

export async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  const { decoded } = verifyJWT(refreshToken);
  if (!decoded || !get(decoded, "session")) {
    return "";
  }

  const session = await SessionModel.findById(get(decoded, "session"));

  if (!session || !session.valid) {
    return "";
  }

  const user = await findUser({ _id: session.user });

  if (!user) {
    return "";
  }

  const accessToken = signJWT(
    { ...user, session: session._id },
    {
      expiresIn: config.get<string>("accessTokenTtl"), // 15 minutes token
    }
  );

  return accessToken;
}
