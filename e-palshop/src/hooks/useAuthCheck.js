import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProfileQuery } from '../store/api/apiSlice';
import { loginSuccess, loginFailure } from '../store/slices/authSlice';

export const useAuthCheck = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const {
    data: profile,
    error,
    isSuccess,
    isError,
  } = useGetProfileQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (token && isSuccess && profile) {
      dispatch(loginSuccess({
        user: profile.data,
        token,
      }));
    } else if (token && isError) {
      dispatch(loginFailure('Session expired'));
    }
  }, [dispatch, token, isSuccess, isError, profile]);
};