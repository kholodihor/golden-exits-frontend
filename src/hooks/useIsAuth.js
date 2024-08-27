export const useIsAuth = () => {
  const token = window.localStorage.getItem("token");
  const isAuth = !!token;
  return isAuth;
};
