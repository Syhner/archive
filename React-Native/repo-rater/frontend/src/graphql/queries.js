import { gql } from '@apollo/client';

import { REPO_DETAILS, REVIEW_DETAILS } from './fragments';

export const GET_REPOSITORIES = gql`
  query Repositories(
    $after: String
    $first: Int
    $orderBy: AllRepositoriesOrderBy
    $orderDirection: OrderDirection
    $searchKeyword: String
  ) {
    repositories(
      after: $after
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
      searchKeyword: $searchKeyword
    ) {
      edges {
        node {
          ...RepoDetails
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ${REPO_DETAILS}
`;

export const LOGGED_USER = gql`
  query Me($after: String, $first: Int, $fetchReviews: Boolean = false) {
    me {
      id
      username
      reviews(after: $after, first: $first) @include(if: $fetchReviews) {
        edges {
          node {
            ...ReviewDetails
            repository {
              id
              fullName
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
  ${REVIEW_DETAILS}
`;

export const GET_REPO = gql`
  query Repository($id: ID!) {
    repository(id: $id) {
      ...RepoDetails
      url
    }
  }
  ${REPO_DETAILS}
`;

export const GET_REVIEWS = gql`
  query Reviews($id: ID!, $after: String, $first: Int) {
    repository(id: $id) {
      id
      fullName
      reviews(after: $after, first: $first) {
        edges {
          node {
            ...ReviewDetails
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
  ${REVIEW_DETAILS}
`;
