import React, { Component } from 'react';
import { ApolloProvider } from 'react-apollo';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import './App.css';
import client from './client'

const ME = gql`
  query me {
    user(login: "saiidalhalawi") {
      name
      avatarUrl
    }
  }
`;

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <span>Hello GraphQL</span>
          <Query query={ME}>
            {
              ({ loading, error, data }) => {
                if (loading) { return 'loading...' }
                if (error) { return `Error: ${error.message}` }

                return <div>{data.user.name}</div>
              }
            }
          </Query>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
