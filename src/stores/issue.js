import { extendObservable, action, when } from "mobx";
import { fromPromise, REJECTED } from "mobx-utils";

export default class IssueStore {
  constructor({ githubAPI, sessionStore }) {
    extendObservable(this, {
      postIssue: action("postIssue", (repo, title, text) => {
        return githubAPI.postIssue({
          login: sessionStore.userDeferred.value.login,
          repo,
          title,
          text
        });
      }),
      updateIssue: action("updateIssue", (repo, title, text, number) => {
        return githubAPI.updateIssue({
          login: sessionStore.userDeferred.value.login,
          repo,
          title,
          text,
          number
        })
      }),
      issueDeferred: new Map(),
      fetchIssues: action("fetchIssues", (repo) => {
        when(
          //condition
          () => {
              return sessionStore.authenticated &&
            (!this.issueDeferred.has(repo) ||
             this.issueDeferred.has(repo) &&
             this.issueDeferred.get(repo).state === REJECTED)
          },
          // ... then
          () => {
            const userDeferred = sessionStore.userDeferred;
            this.issueDeferred.set(repo, fromPromise(
              githubAPI.fetchIssues(userDeferred.value, repo)
            ));
          }
        );
      })
    });
  }
}
