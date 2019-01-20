import React, { Component } from 'react';
import { ApolloProvider, Mutation, Query } from 'react-apollo';

import client from './client';
import { SEARCH_REPOSITORIES, ADD_STAR } from './graphql';

const StarButton = props => {
  const node = props.node;
  const totalCount = node.stargazers.totalCount;
  const viewerHasStarred = node.viewerHasStarred;
  const starCount = totalCount === 1 ? '1 star' : `${totalCount} stars`
  const StarStatus = ({addStar}) => {
    return (
      <
        button
        onClick={
          () => {
            addStar({
              variables: { input: { starrableId: node.id } }
            });
          }
        }
      >
        {starCount} | {viewerHasStarred ? 'starred' : '-'}
      </button>
    )
  }
  return (
    <Mutation mutation={ADD_STAR}>
      {
        addStar => <StarStatus addStar={addStar}/>
      }
    </Mutation>
  );
}


const PER_PAGE = 5;

const DEFAULT_STATE = {
  first: PER_PAGE,
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
  },
  resultsList: {
    width: '60%',
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'left'
  }
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = DEFAULT_STATE;
    this.handleChange = this.handleChange.bind(this);
    this.goNext = this.goNext.bind(this);
  }
  handleChange(event) {
    this.setState({
      ...DEFAULT_STATE,
      query: event.target.value
    });
  }
  goPrevious(search) {
    this.setState({
      first: PER_PAGE,
      after: null,
      last: null,
      before: search.pageInfo.sartCursor
    });
  }
  goNext(search) {
    this.setState({
      first: PER_PAGE,
      after: search.pageInfo.endCursor,
      last: null,
      before: null
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
                      <ul style={styles.resultsList}>
                        {
                          search.edges.map(edge => {
                            const node = edge.node;
                            return (
                              <li key={node.id}>
                                <a href={node.url} target="repo">
                                  {node.name}
                                </a>
                                &nbsp;
                                <StarButton node={node}/>
                              </li>
                            )
                          })
                        }
                      </ul>

                      {
                        search.pageInfo.hasPreviousPage === true ?
                          <button onClick={this.goPrevious.bind(this, search)}>
                            previous
                          </button>
                          :
                          null
                      }

                      {
                        search.pageInfo.hasNextPage === true ?
                          <button onClick={this.goNext.bind(this, search)}>
                            next
                          </button>
                          :
                          null
                      }
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
