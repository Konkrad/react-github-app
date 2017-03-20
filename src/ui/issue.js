import React from "react";
import IssueList from "../ui/issueList";
import IssueForm from "../ui/issueForm";
import { whyRun , isObservable} from "mobx";
import { observer, Provider, inject } from "mobx-react";
import { PENDING, REJECTED, FULFILLED } from "mobx-utils";
import { Spinner, Button } from "@blueprintjs/core";

export default inject("issueStore")(
  observer(
    class IssueFormComponent extends React.Component {
      constructor({ issueStore, route }) {
        super();
        const repo = route.params.repo;
        issueStore.fetchIssues(repo);
      }
      getForm() {
        const {route, issueStore} = this.props;
        const repo = route.params.repo;
        const number = route.params.id;

        if(number && issueStore.issueDeferred.has(repo)) {
          const issueDeferred = issueStore.issueDeferred.get(repo);
          const state = issueDeferred.state;
          switch(state) {
            case FULFILLED: {
              const issue = issueDeferred.value.find((is) => {
                  return is.number == number;
              })
              return <IssueForm key={number} route={route} values={{
                "title": issue.title,
                "text": issue.body
              }} />
            }
          }
        } else {
          return <IssueForm route={route}/>
        }
      }
      render() {
        const {route} = this.props;
        return (
          <Provider>
            <div>
                <IssueList repo={route.params.repo} />
                {this.getForm()}
            </div>
          </Provider>
          );
      }
  }));
