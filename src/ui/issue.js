import React from "react";
import IssueList from "../ui/issueList";
import IssueForm from "../ui/issueForm";
import { observer, Provider, inject } from "mobx-react";
import { PENDING, REJECTED, FULFILLED } from "mobx-utils";


export default inject("issueStore")(
  observer(
    class IssueFormComponent extends React.Component {
      constructor({ issueStore, route }) {
        super();
        const repo = route.params.repo;
        issueStore.fetchIssues(repo);
      }
      getValues() {
        const {route, issueStore} = this.props;
        const repo = route.params.repo;
        const number = route.params.id;

        if(route.params.id && issueStore.issueDeferred.has(repo)) {
          const issueDeferred = issueStore.issueDeferred.get(repo);
          const state = issueDeferred.state;
          switch(state) {
            case FULFILLED: {
              const issue = issueDeferred.value.find((is) => {
                  return is.number == number;
              })
              console.log("i got the values", issue, {
                "title": issue.title,
                "text": issue.body
              }  )
              return {
                "title": issue.title,
                "text": issue.body
              }  
            }
          }
        }
        return {
          title: "titel",
          text: "text"
        }
      }
      render() {
        const {route} = this.props;
        return (
          <Provider>
            <div>
                <IssueList repo={route.params.repo} />
                <IssueForm route={route} values={this.getValues()} />
            </div>
          </Provider>
          );
      }
  }));
