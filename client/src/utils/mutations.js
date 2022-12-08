import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      user {
        _id
        username
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation createUser($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      user {
        _id
        username
        email
      }
    }
  }
`;

export const ADD_CARD_LIST = gql`
  mutation addCardToWishList($cardId: ID!, $name: String!, $type: String!, $text: String!, $color: [String]!, $image: String!) {
    addCardToWishList(cardId: $ID, name: $String, $type: String, text: $String, color: $[String], image: $String!) {
      wishList {
        cardId
        name
        type
        text
        color
        image
      }
    }
  }
`;

