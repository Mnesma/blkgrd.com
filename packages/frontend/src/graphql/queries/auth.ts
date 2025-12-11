import { gql } from "@apollo/client";

export const AUTH_STATUS_QUERY = gql`
  query AuthStatus {
    authStatus {
      isAuthenticated
      user {
        id
        discordId
        username
        displayName
        avatar
        avatarUrl
        roles
      }
    }
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      id
      discordId
      username
      displayName
      avatar
      avatarUrl
      roles
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;
