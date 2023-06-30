// // return the user data from the session storage
// export const getUser = () => {
//     const userStr = localStorage.getItem('user');
//     if (userStr) return JSON.parse(userStr);
//     else return null;
//   }
  
//   // return the token from the session storage
//   export const getToken = () => {
//     return localStorage.getItem('access_token') || null;
//   }
  
//   // remove the token and user from the session storage
//   export const removeUserSession = () => {
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('user');
//   }
  
//   // set the token and user from the session storage
//   export const setUserSession = (access_token, user) => {
//     localStorage.setItem('access_token', access_token);
//     localStorage.setItem('user', JSON.stringify(user));
//   }
//   // set the token and user from the session storage
//   export const setVms = (name, user_id) => {
//     localStorage.setItem('name', name);
//     localStorage.setItem('user_id', JSON.stringify(user_id));
//   }
  

  
