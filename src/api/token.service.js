const getLocalRefreshToken = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.refreshToken;
  };
  
  const getLocalAccessToken = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.accessToken;
  };
  
  const updateLocalAccessToken = (token) => {
    let user = JSON.parse(localStorage.getItem("user"));
    user.accessToken = token;
    localStorage.setItem("user", JSON.stringify(user));
  };

  export const setUserSession = (access_token, user) => {
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('user', JSON.stringify(user));
  };
  
  
  const removeUser = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  };
  export const getToken = () => {
       return localStorage.getItem('access_token') || null;
     }
  
  const TokenService = {
    getLocalRefreshToken,
    getLocalAccessToken,
    updateLocalAccessToken,
    setUserSession,
    getToken,
    removeUser,
  };
  
  export default TokenService;


  

  