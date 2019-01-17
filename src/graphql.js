import gql from 'graphql-tag';

export const SEARCH_REPOSITORIES = gql`
  query searchRepositories($first: Int, $after: String, $last: Int, $before: String, $query: String!) {
  search(query: $query, type: REPOSITORY, first: $first, after: $after, last: $last, before: $before) {
    repositoryCount
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
    edges {
      cursor
      node {
      __typename
      ... on Repository {
        id
        name
        url
        stargazers {
          totalCount
        }
        viewerHasStarred
      }
    }
    }
  }
  }
`;


export const ME = gql`
  query me {
    user(login: "saiidalhalawi") {
      name
      avatarUrl
    }
  }
`;
