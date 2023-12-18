import AuthForm from '../components/auth/AuthForm';

function Login(): JSX.Element {
  return (
    <>
      <AuthForm isLogin={true} />
    </>
  );
}

export default Login;
