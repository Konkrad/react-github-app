import React from "react";
import { observer, inject } from "mobx-react";
import { PENDING, REJECTED, FULFILLED } from "mobx-utils";
import { Spinner, Button } from "@blueprintjs/core";
export default inject("issueStore", "sessionStore", "viewStore")(
  observer(
    class IssueList extends React.Component {
      constructor({ issueStore, sessionStore, repo }) {
        super();
        issueStore.fetchIssues(repo);
      }
      renderIssueList() {
        const {sessionStore, issueStore, viewStore, repo} = this.props;

        if (sessionStore.authenticated) {
          const issueDeferred = issueStore.issueDeferred.get(repo);
          const state = issueDeferred.state;
          switch(state) {
            case PENDING: {
              return <Spinner />;
            }
            case REJECTED: {
              return(
                <div>Fail</div>
              )
            }
            case FULFILLED: {
              const issue = issueDeferred.value;
              if(issue.length === 0) {
                return <p>no issues found</p>
              }

              return(
                issue.map((issue) => {
                  return <div onClick={() => viewStore.push(viewStore.routes.issue.id({repo, id: issue.number}))} key={issue.id} >{issue.title}</div>
                })
              )
            }
          }
        }
      }
      render() {
        return (
          <div>
            {this.renderIssueList()}
          </div>
        );
      }
    }
  )
);
