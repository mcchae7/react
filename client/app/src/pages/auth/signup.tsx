import { ReactElement, useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { UserContext } from '../../app.context';
import {
  Api,
  Button,
  ButtonType,
  Field,
  FieldAction,
  FieldActionEvent,
  FieldType,
  FieldValidatorType,
  Form,
  FormAction,
  FormActionEvent,
  RegExpEmail,
  User,
  UserAction,
} from '../../shared';
import { api } from '../../shared/utils/http-util';

interface SignUpState {
  values: any;
  redirectTo: string;
}

export const Signup = (): ReactElement => {
  const themes: string[] = ['signup'];
  const { setUser } = useContext(UserContext);
  const [state, setState] = useState<SignUpState>({
    values: {},
    redirectTo: '',
  });

  const onFormAction = async (e: FormActionEvent) => {
    const { action, values } = e;
    switch (action) {
      case FormAction.submit:
        const res = await api({
          api: Api.User,
          action: UserAction.create,
          data: values,
        });
        const users = res.data.data as Array<User>;
        setUser(users[0]);
        setState({ ...state, redirectTo: '/' });
        break;
    }
  };

  const onFieldAction = (e: FieldActionEvent) => {
    const { action, name, value } = e;
    switch (action) {
      case FieldAction.change:
        const { values } = state;
        values[name] = value;
        setState({
          ...state,
          values,
        });
        break;
    }
  };

  return state.redirectTo ? (
    <Redirect to={state.redirectTo} />
  ) : (
    <div className="signup">
      <header>Sign Up</header>
      <main>
        <Form values={state.values} onAction={(e) => onFormAction(e)}>
          <Field
            themes={[...themes, 'name']}
            name="name"
            label="Name: "
            type={FieldType.text}
            validators={[{ type: FieldValidatorType.required }]}
            onAction={(e: FieldActionEvent) => onFieldAction(e)}
          ></Field>
          <Field
            themes={[...themes, 'email']}
            name="email"
            label="Email: "
            type={FieldType.email}
            validators={[
              { type: FieldValidatorType.required },
              {
                type: FieldValidatorType.pattern,
                targetValue: RegExpEmail,
                errorMessage: 'Please input the correct email',
              },
            ]}
            onAction={(e: FieldActionEvent) => onFieldAction(e)}
          ></Field>
          <Field
            themes={[...themes, 'password']}
            label="Password: "
            name="password"
            type={FieldType.password}
            validators={[{ type: FieldValidatorType.required }]}
            onAction={(e: FieldActionEvent) => onFieldAction(e)}
          ></Field>
          <Button themes={themes} type={ButtonType.submit}>
            Sign Up
          </Button>
        </Form>
      </main>
    </div>
  );
};
