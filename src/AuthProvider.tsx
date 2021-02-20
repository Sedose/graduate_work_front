// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import React from 'react';
import { PublicClientApplication } from '@azure/msal-browser';

import { config } from './Config';
import { getUserDetails } from './GraphService';
import { retrieveUserDetails } from './api/backend-api';

export interface AuthComponentProps {
    error: any;
    isAuthenticated: boolean;
    user: any;

    login: Function;
    logout: Function;
    getAccessToken: Function;
    setError: Function;
}

interface AuthProviderState {
    error: any;
    isAuthenticated: boolean;
    user: any;
}

export default function withAuthProvider<T extends React.Component<AuthComponentProps>>(WrappedComponent: new (props: AuthComponentProps, context?: any) => T): React.ComponentClass {
    return class extends React.Component<any, AuthProviderState> {
        private publicClientApplication: PublicClientApplication;

        constructor(props: any) {
            super(props);
            this.state = {
                error: null,
                isAuthenticated: false,
                user: {}
            };

            this.publicClientApplication = new PublicClientApplication({
                auth: {
                    clientId: config.appId,
                    redirectUri: config.redirectUri
                },
                cache: {
                    cacheLocation: "sessionStorage",
                    storeAuthStateInCookie: true
                }
            });
        }

        componentDidMount() {
            const accounts = this.publicClientApplication.getAllAccounts();

            if (accounts && accounts.length > 0) {
                this.getUserProfile();
            }
        }

        render() {
            return <WrappedComponent
                error={this.state.error}
                isAuthenticated={this.state.isAuthenticated}
                user={this.state.user}
                login={() => this.login()}
                logout={() => this.logout()}
                getAccessToken={(scopes: string[]) => this.getAccessToken(scopes)}
                setError={(message: string, debug: string) => this.setErrorMessage(message, debug)}
                {...this.props}
            />;
        }

        async login() {
            try {
                await this.publicClientApplication.loginPopup({
                    scopes: config.scopes,
                    prompt: "select_account"
                });
                await this.getUserProfile();
            } catch (err) {
                this.setState({
                    isAuthenticated: false,
                    user: {},
                    error: this.normalizeError(err)
                });
            }
        }

        logout() {
            this.publicClientApplication.logout();
        }

        async getAccessToken(scopes: string[]): Promise<string> {
            try {
                const accounts = this.publicClientApplication.getAllAccounts();
                if (accounts.length <= 0) {
                    throw new Error('login_required');
                }
                const silentResult = await this.publicClientApplication.acquireTokenSilent({
                    scopes: scopes,
                    account: accounts[0]
                });
                console.log(silentResult.accessToken)
                return silentResult.accessToken;
            } catch (err) {
                if (this.isInteractionRequired(err)) {
                    const interactiveResult = await this.publicClientApplication.acquireTokenPopup({
                        scopes: scopes
                    });
                    return interactiveResult.accessToken;
                } else {
                    throw err;
                }
            }
        }

        async getUserProfile() {
            try {
                const accessToken = await this.getAccessToken(config.scopes);
                if (accessToken) {
                    const user = await getUserDetails(accessToken);
                    const appUserDetails = await retrieveUserDetails(accessToken);
                    console.log(appUserDetails)
                    this.setState({
                        isAuthenticated: true,
                        user: {
                            displayName: user.displayName,
                            email: user.mail || user.userPrincipalName,
                            timeZone: user.mailboxSettings.timeZone,
                            timeFormat: user.mailboxSettings.timeFormat,
                            appRole: appUserDetails.userRole
                        },
                        error: null
                    });
                }
            } catch (err) {
                this.setState({
                    isAuthenticated: false,
                    user: {},
                    error: this.normalizeError(err)
                });
            }
        }

        setErrorMessage(message: string, debug: string) {
            this.setState({
                error: { message: message, debug: debug }
            });
        }

        normalizeError(error: string | Error): any {
            let normalizedError;
            if (typeof (error) === 'string') {
                const errParts = error.split('|');
                normalizedError = errParts.length > 1 ?
                    { message: errParts[1], debug: errParts[0] } :
                    { message: error };
            } else {
                normalizedError = {
                    message: error.message,
                    debug: JSON.stringify(error)
                };
            }
            return normalizedError;
        }

        isInteractionRequired(error: Error): boolean {
            if (!error.message || error.message.length <= 0) {
                return false;
            }

            return (
                error.message.indexOf('consent_required') > -1 ||
                error.message.indexOf('interaction_required') > -1 ||
                error.message.indexOf('login_required') > -1 ||
                error.message.indexOf('no_account_in_silent_request') > -1
            );
        }
    }
}
