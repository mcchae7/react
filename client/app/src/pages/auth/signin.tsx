import { ReactElement, useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { UserContext } from '../../app.context';
import {
  Field,
  FieldType,
  FieldActionEvent,
  Button,
  ButtonType,
  Form,
  FormActionEvent,
  FormAction,
  Api,
  UserAction,
  User,
  FieldAction,
  FieldValidatorType,
  RegExpEmail,
} from '../../shared';
import { api } from '../../shared/utils/http-util';

interface SignInState {
  values: any;
  redirectTo: string;
}

export const Signin = (): ReactElement => {
  const themes: string[] = ['signin'];
  const { setUser } = useContext(UserContext);
  const [state, setState] = useState<SignInState>({
    values: {},
    redirectTo: '',
  });
  const onFormAction = async (e: FormActionEvent) => {
    const { action, values } = e;
    switch (action) {
      case FormAction.submit:
        const res = await api({
          api: Api.User,
          action: UserAction.auth,
          data: values,
        });
        const user = res.data.data as User;
        setUser(user);
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
    <div className="signin">
      <header>Sign In</header>
      <main>
        <Form values={state.values} onAction={(e) => onFormAction(e)}>
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
            Sign In
          </Button>
        </Form>
      </main>
    </div>
  );
};
