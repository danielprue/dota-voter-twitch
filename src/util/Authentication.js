const jwt = require('jsonwebtoken');
const { useState } = require('react');

const useAuthentication = () => {
  const [userInfo, setUserInfo] = useState({
    token,
    opaque_id,
    user_id: false,
    isMod: false,
    role: '',
  });

  const isLoggedIn = () => userInfo.opaque_id[0] === 'U';

  const isModerator = () => userInfo.isMod;

  const hasSharedId = () => !!userInfo.user_id;

  const getUserId = () => userInfo.user_id;

  const getOpaqueId = () => userInfo.opaque_id;

  const setToken = (token, opaque_id) => {
    let isMod = false;
    let role = '';
    let user_id = '';

    try {
      let decoded = jwt.decode(token);

      if (decoded.role === 'broadcaster' || decoded.role === 'moderator') {
        isMod = true;
      }

      user_id = decoded.user_id;
      role = decoded.role;
    } catch (e) {
      token = '';
      opaque_id = '';
    }

    setUserInfo({ token, opaque_id, user_id, isMod, role });
  };

  const isAuthenticated = () => userInfo.token && userInfo.opaque_id;

  const makeCall = (url, method = 'GET') =>
    new Promise((resolve, reject) => {
      if (isAuthenticated()) {
        let headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        };

        fetch(url, { method, headers })
          .then((response) => resolve(response))
          .catch((e) => reject(e));
      } else {
        reject('Unauthorized');
      }
    });

  return {
    isLoggedIn,
    isModerator,
    hasSharedId,
    getUserId,
    getOpaqueId,
    setToken,
    isAuthenticated,
    makeCall,
  };
};

export default useAuthentication;
