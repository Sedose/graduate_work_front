import { constants } from "../constants";
import { extractData } from "./util";

export const retrieveUserDetails = (accessToken: string): Promise<UserDetailsResponse> => extractData(fetch(
    `${constants.DEFAULT_BACKEND_CONTEXT_PATH}/api/user-details`, {
        headers: {
            Authentication: accessToken
        }
    }
))
