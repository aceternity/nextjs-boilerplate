import { Session } from 'next-auth'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { NextHandler } from 'next-connect'

export type NextApiRequestWithSession = NextApiRequest & {
  session: Session | null;
};

const AuthMiddleWare = (roles: string[]) => {
    return async (req: NextApiRequestWithSession, res: NextApiResponse, next: NextHandler) => {

    if (roles.length === 0) {
      next();
      return;
    }

    const session: Session | null = await getSession({ req });

    if (!session) {
      res.statusCode = 400
      return res.json({
        message: 'Unauthorized access',
      })
    }

    req.session = session
    const { role } = session.user
    if (roles.findIndex((_r) => _r === role) > -1) {
      next()
    } else {
      res.statusCode = 405
      return res.json({
        message: 'Bad request',
      })
    }
  }
}

export { AuthMiddleWare }
