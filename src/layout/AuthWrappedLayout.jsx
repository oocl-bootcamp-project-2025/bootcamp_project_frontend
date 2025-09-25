import { AuthWrapper } from '../contexts/AuthWrapper';
import DefaultLayOut from "../layout/DefaultLayOut";

const AuthWrappedLayout = () => {
  return (
    <AuthWrapper>
      <DefaultLayOut />
    </AuthWrapper>
  );
};

export default AuthWrappedLayout;
