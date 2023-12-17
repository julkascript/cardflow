import AuthForm from '../components/auth/AuthForm';

function Register(): JSX.Element {
  return (
    <>
      <AuthForm isLogin={false} />
    </>
  );
}

export default Register;
