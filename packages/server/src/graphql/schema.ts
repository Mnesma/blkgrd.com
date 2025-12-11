export const typeDefs = `#graphql
  type User {
    id: ID!
    discordId: String!
    username: String!
    displayName: String!
    avatar: String
    avatarUrl: String!
    roles: [String!]!
    createdAt: String!
    updatedAt: String!
  }

  type AuthStatus {
    isAuthenticated: Boolean!
    user: User
  }

  type Query {
    me: User
    authStatus: AuthStatus!
  }

  type Mutation {
    logout: Boolean!
  }
`;
