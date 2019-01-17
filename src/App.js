import React, { Component } from 'react';
import { ApolloProvider } from 'react-apollo';
import { Query } from 'react-apollo';

import './App.css';
import client from './client';
import { SEARCH_REPOSITORIES } from './graphql';

const VARIABLES = {
  first: 5,
  after: null,
  last: null,
  before: null,
  query: 'フロントエンドエンジニア'
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = VARIABLES;
  }
  render() {
    const { query, first, before, last, after } = this.state;
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <Query query={SEARCH_REPOSITORIES} variables={{ query, first, before, last, after }}>
            {
              ({ loading, error, data }) => {
                if (loading) { return 'loading...' }
                if (error) { return `Error: ${error.message}` }
                console.log(data);
                return <div>aaa</div>
              }
            }
          </Query>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
