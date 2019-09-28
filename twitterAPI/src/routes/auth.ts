import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import HttpStatus from 'http-status-codes';
import User, { IUser } from '../models/User.model';
import { IUserCredential } from '../dtos';

const router = express.Router();

router.post('/login', (req: Request, res: Response) => {
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
});

router.post(
  '/register',
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, password, email } = req.body;

    const userByEmail = await User.findOne({ email });

    if (userByEmail) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: 'email already exist ' });
    }

    const userByUsrname = await User.findOne({ username });
    if (userByUsrname) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: 'username already exist ' });
    }

    let user = new User({
      username,
      email,
      image: ''
    });

    user.setPassword(password);
    const token = user.generateJWT();
    user = await user.save();
    res.status(HttpStatus.OK).send({ user, token });
  }
);

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.status(HttpStatus.OK).send('oiuytre');
  }
);
export default router;
