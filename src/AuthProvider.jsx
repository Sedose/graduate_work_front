/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable max-len */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-use-before-define */
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import React, { useEffect, useState } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';

import config from './Config';
import { getUserDetails } from './GraphService';
import backendApi from './api/backend-api';

export default (WrappedComponent) => () => {
  const [error, setError] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState();
  const [user, setUser] = useState({});

  const publicClientApplication = new PublicClientApplication({
    auth: {
      clientId: config.appId,
      redirectUri: config.redirectUri,
    },
    cache: {
      cacheLocation: 'sessionStorage',
      storeAuthStateInCookie: true,
    },
  });

  useEffect(() => {
    const accounts = publicClientApplication.getAllAccounts();

    if (accounts?.length > 0) {
      getUserProfile();
    }
  });

  const getAccessToken = async (scopes) => {
    try {
      const accounts = publicClientApplication.getAllAccounts();
      if (accounts.length <= 0) {
        throw new Error('login_required');
      }
      const silentResult = await publicClientApplication.acquireTokenSilent(
        {
          scopes,
          account: accounts[0],
        },
      );
      return silentResult.accessToken;
    } catch (err) {
      if (isInteractionRequired(err)) {
        const interactiveResult = await publicClientApplication.acquireTokenPopup(
          {
            scopes,
          },
        );
        return interactiveResult.accessToken;
      }
      throw err;
    }
  };

  const getUserProfile = async () => {
    try {
      const accessToken = await getAccessToken(config.scopes);
      if (accessToken) {
        const appUser = await getUserDetails(accessToken);
        setIsAuthenticated(true);
        setUser({
          displayName: appUser.displayName,
          email: appUser.mail || appUser.userPrincipalName,
          timeZone: appUser.mailboxSettings.timeZone,
          timeFormat: appUser.mailboxSettings.timeFormat,
        });
        setError(null);
      }
    } catch (err) {
      setIsAuthenticated(false);
      setUser(null);
      setError(normalizeError(err));
    }
  };

  const setErrorMessage = (message, debug) => {
    setError({ message, debug });
  };

  const appLogin = async () => {
    const accessToken = await getAccessToken(config.scopes);
    const appUserDetails = await backendApi.retrieveUserDetails(accessToken);
    setUser((prevState) => ({ ...prevState, appRole: appUserDetails.userRole }));
    setError(null);
  };

  const login = async () => {
    try {
      await publicClientApplication.loginPopup({
        scopes: config.scopes,
        prompt: 'select_account',
      });
      await getUserProfile();
    } catch (err) {
      setIsAuthenticated(false);
      setUser({});
      setError(normalizeError(err));
    }
  };

  const logout = () => {
    publicClientApplication.logout();
  };

  const normalizeError = (err) => {
    let normalizedError;
    if (typeof err === 'string') {
      const errParts = err.split('|');
      normalizedError = errParts.length > 1
        ? { message: errParts[1], debug: errParts[0] }
        : { message: err };
    } else {
      normalizedError = {
        message: err.message,
        debug: JSON.stringify(err),
      };
    }
    return normalizedError;
  };

  const isInteractionRequired = (err) => {
    if (!err.message || err.message.length <= 0) {
      return false;
    }

    return (
      err.message.indexOf('consent_required') > -1
        || err.message.indexOf('interaction_required') > -1
        || err.message.indexOf('login_required') > -1
        || err.message.indexOf('no_account_in_silent_request') > -1
    );
  };

  return (
    <WrappedComponent
      error={error}
      isAuthenticated={isAuthenticated}
      user={user}
      login={() => login()}
      logout={() => logout()}
      appLogin={() => appLogin()}
      getAccessToken={(scopes) => getAccessToken(scopes)}
      setError={(message, debug) => setErrorMessage(message, debug)}
      {...WrappedComponent.props}
    />
  );
};
