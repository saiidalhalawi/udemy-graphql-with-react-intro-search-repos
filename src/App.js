import React, { Component } from 'react';
import { ApolloProvider } from 'react-apollo';
import { Query } from 'react-apollo';

import client from './client';
import { SEARCH_REPOSITORIES } from './graphql';

const DEFAULT_STATE = {
  first: 5,
  after: null,
  last: null,
  before: null,
  query: 'フロントエンドエンジニア'
};

const styles = {
  main: {
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 15
  },
  input: {
    padding: 20,
    fontSize: 16,
    width: '50%'
  }
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = DEFAULT_STATE;
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    this.setState({
      ...DEFAULT_STATE,
      query: event.target.value
    });
  }
  render() {
    const { query, first, before, last, after } = this.state;
    return (
      <ApolloProvider client={client}>
        <div style={styles.main}>
          <form>
            <input value={query} onChange={this.handleChange} style={styles.input} />
          </form>
          <div>
            <Query query={SEARCH_REPOSITORIES} variables={{ query, first, before, last, after }}>
              {
                ({ loading, error, data }) => {
                  if (loading) { return 'loading...' }
                  if (error) { return `Error: ${error.message}` }
                  const search = data.search;
                  const repositoryCount = search.repositoryCount;
                  const repositoryUnit = repositoryCount === 1 ? 'Repository' : 'Repositories';
                  const title = `Github Repositories Search Results - ${repositoryCount} ${repositoryUnit}`;
                  return (
                    <React.Fragment>
                      <h2>{title}</h2>
                      <ul>
                        {
                          search.edges.map(edge => {
                            const node = edge.node;
                            return (
                              <li key={node.id}>
                                <a href={node.url} target="repo">
                                  {node.name}
                                </a>
                              </li>
                            )
                          })
                        }
                      </ul>
                    </React.Fragment>
                  )
                }
              }
            </Query>
          </div>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
