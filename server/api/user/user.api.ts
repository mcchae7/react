import { Response } from 'express';
import { hash } from 'bcrypt';
import { selectUser, insertUser, selectUserByEmailPassword } from './user.service';
import { UserAction, FieldValidatorConfig, User } from '../../shared-cs/model';

export const apiUser = (res: Response, action: UserAction, data: User): void => {
  switch (action) {
    case UserAction.auth:
      authUser(res, data);
      break;
    case UserAction.read:
      getUser(res, data);
      break;
    case UserAction.create:
      createUser(res, data);
      break;
    case UserAction.update:
      updateUser(res, data);
      break;
    case UserAction.delete:
      deleteUser(res, data);
      break;
  }
};

export const getUser = (res: Response, user: User): void => {
  selectUser(res, user.id);
};

export const authUser = (res: Response, user: User): void => {
  const { email, password = '' } = user;
  selectUserByEmailPassword(res, email, password);
};

export const createUser = (res: Response, user: User): void => {
  // TODO: Add validators
  const validatorsMap = new Map<string, FieldValidatorConfig[]>();
  // if (!errors.isEmpty()) {
  //   res.status(400).json(getValidationError(errors.array()));
  // }
  const { password } = user;
  hash(password, 12).then((hashedPassword) => {
    user.password = hashedPassword;
    insertUser(res, user);
  });
};

export const updateUser = (res: Response, user: User): void => {
  const { id, password, name } = user;
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }

  // try {
  //   hash(user.password, 12).then((hashedPassword) => {
  //     db.query(
  //       'update users set user_name=$1, password=$2 where id=$3',
  //       [user_name, hashedPassword, id],
  //       (error, data) => {
  //         if (error) {
  //           res.status(500).send('DB Error');
  //         } else {
  //           res.status(200).json({ message: 'Updated' });
  //         }
  //       },
  //     );
  //   });
  //   // See if user exists
  //   // Get users gravatar
  //   // Encrypt password
  //   // Return JWT
  // } catch (error) {
  //   console.error(error.message);
  //   res.status(500).send('Server Error');
  // }
};

export const deleteUser = (res: Response, user: User): void => {
  // const id = parseInt(req.params.id);
  // db.query('delete from users where id = $1', [id], (error, data) => {
  //   if (error) {
  //     res.status(500).send('DB Error');
  //   } else {
  //     res.json({ message: 'The user is deleted with ID: ' + id });
  //   }
  // });
};
