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
import React from 'react';
import { PublicClientApplication } from '@azure/msal-browser';

import config from './Config';
import { getUserDetails } from './GraphService';
import retrieveUserDetails from './api/backend-api';

export interface AuthComponentProps {
  error: any;
  isAuthenticated: boolean;
  user: any;
  login: Function;
  logout: Function;
  appLogin: Function;
  getAccessToken: Function;
  setError: Function;
}

interface AuthProviderState {
  error: any;
  isAuthenticated: boolean;
  user: any;
}

export default function withAuthProvider<
  T extends React.Component<AuthComponentProps>
>(
  WrappedComponent: new (props: AuthComponentProps, context?: any) => T,
): React.ComponentClass {
  return class extends React.Component<any, AuthProviderState> {
    private publicClientApplication: PublicClientApplication;

    constructor(props: any) {
      super(props);
      this.state = {
        error: null,
        isAuthenticated: false,
        user: {},
      };

      this.publicClientApplication = new PublicClientApplication({
        auth: {
          clientId: config.appId,
          redirectUri: config.redirectUri,
        },
        cache: {
          cacheLocation: 'sessionStorage',
          storeAuthStateInCookie: true,
        },
      });
    }

    componentDidMount() {
      const accounts = this.publicClientApplication.getAllAccounts();

      if (accounts && accounts.length > 0) {
        this.getUserProfile();
      }
    }

    async getAccessToken(scopes: string[]): Promise<string> {
      try {
        const accounts = this.publicClientApplication.getAllAccounts();
        if (accounts.length <= 0) {
          throw new Error('login_required');
        }
        const silentResult = await this.publicClientApplication.acquireTokenSilent(
          {
            scopes,
            account: accounts[0],
          },
        );
        return silentResult.accessToken;
      } catch (err) {
        if (this.isInteractionRequired(err)) {
          const interactiveResult = await this.publicClientApplication.acquireTokenPopup(
            {
              scopes,
            },
          );
          return interactiveResult.accessToken;
        }
        throw err;
      }
    }

    async getUserProfile() {
      try {
        const accessToken = await this.getAccessToken(config.scopes);
        if (accessToken) {
          const user = await getUserDetails(accessToken);
          this.setState({
            isAuthenticated: true,
            user: {
              displayName: user.displayName,
              email: user.mail || user.userPrincipalName,
              timeZone: user.mailboxSettings.timeZone,
              timeFormat: user.mailboxSettings.timeFormat,
            },
            error: null,
          });
        }
      } catch (err) {
        this.setState({
          isAuthenticated: false,
          user: {},
          error: this.normalizeError(err),
        });
      }
    }

    setErrorMessage(message: string, debug: string) {
      this.setState({
        error: { message, debug },
      });
    }

    async appLogin() {
      const accessToken = await this.getAccessToken(config.scopes);
      const appUserDetails = await retrieveUserDetails(accessToken);
      this.setState((prevState) => ({
        user: {
          ...prevState.user,
          appRole: appUserDetails.userRole,
        },
        error: null,
      }));
    }

    async login() {
      try {
        await this.publicClientApplication.loginPopup({
          scopes: config.scopes,
          prompt: 'select_account',
        });
        await this.getUserProfile();
      } catch (err) {
        this.setState({
          isAuthenticated: false,
          user: {},
          error: this.normalizeError(err),
        });
      }
    }

    logout() {
      this.publicClientApplication.logout();
    }

    normalizeError(error: string | Error): any {
      let normalizedError;
      if (typeof error === 'string') {
        const errParts = error.split('|');
        normalizedError = errParts.length > 1
          ? { message: errParts[1], debug: errParts[0] }
          : { message: error };
      } else {
        normalizedError = {
          message: error.message,
          debug: JSON.stringify(error),
        };
      }
      return normalizedError;
    }

    isInteractionRequired(error: Error): boolean {
      if (!error.message || error.message.length <= 0) {
        return false;
      }

      return (
        error.message.indexOf('consent_required') > -1
        || error.message.indexOf('interaction_required') > -1
        || error.message.indexOf('login_required') > -1
        || error.message.indexOf('no_account_in_silent_request') > -1
      );
    }

    render() {
      const { error, isAuthenticated, user } = this.state;
      return (
        <WrappedComponent
          error={error}
          isAuthenticated={isAuthenticated}
          user={user}
          login={() => this.login()}
          logout={() => this.logout()}
          appLogin={() => this.appLogin()}
          getAccessToken={(scopes: string[]) => this.getAccessToken(scopes)}
          setError={(message: string, debug: string) => this.setErrorMessage(message, debug)}
          {...this.props}
        />
      );
    }
  };
}
