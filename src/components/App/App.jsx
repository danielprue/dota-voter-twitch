import React, { useEffect, useState } from 'react';
import useAuthentication from '../../util/Authentication';

const App = () => {
  const twitch = window.Twitch ? window.Twitch.ext : null;
  const { getUserId, setToken } = useAuthentication();

  const [finishedLoading, setFinishedLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (twitch) {
      twitch.onAuthorized((auth) => {
        setToken(auth.token, auth.userId);
        if (!finishedLoading) {
          setFinishedLoading(true);
        }
      });

      twitch.listen('broadcast', (target, contentType, body) => {
        // Do something
      });

      twitch.onVisibilityChanged((isVisible, _c) => {
        setIsVisible(isVisible);
      });

      return twitch.unlisten('broadcast', () =>
        console.log('successfully unlistened')
      );
    }
  }, []);

  console.log(isVisible);

  return finishedLoading && isVisible ? (
    <div className='App'>
      <p>User Id: {getUserId()}</p>
    </div>
  ) : (
    <div className='App'>My Test stuff</div>
  );
};

export default App;
