import passport from 'passport';
import IUser from './authDtos/userForAuthDto.dto';
import HttpStatus from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import { IUserCredential } from './authDtos/userCredential.dto';
import * as service from './auth.service';

function login(req: Request, res: Response) {
  passport.authenticate(
    'local',
    { session: false },
    async (err, user: IUser, info) => {
      if (err || !user) {
        return res.status(HttpStatus.BAD_REQUEST).send({ info });
      }

      req.login(user, { session: false }, error => {
        if (error) {
          return res
            .status(HttpStatus.BAD_REQUEST)
            .send({ message: 'failed to login' });
        }
      });
      const token = user.generateJWT();
      const creds: IUserCredential = {
        id: user._id,
        username: user.username,
        token
      };
      return res.status(HttpStatus.OK).send({ creds });
    }
  )(req, res);
}

async function register(req: Request, res: Response, next: NextFunction) {
  const { username, password, email, image } = req.body;

  const userByEmail = await service.findUserByEmail(email);

  if (userByEmail) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send({ message: 'email already exist ' });
  }

  const userByUsrname = await service.findUserByUsername(username);
  if (userByUsrname) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send({ message: 'username already exist ' });
  }

  const user = await service.createUser(username, email, password, image);

  return res.status(HttpStatus.OK).send({ user });
}

const AuthController = {
  login,
  register
};

export default AuthController;
