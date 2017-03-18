import { extendObservable, action, when } from "mobx";
import { fromPromise, REJECTED } from "mobx-utils";

export default class Repo {
  constructor({ githubAPI, sessionStore }) {
    extendObservable(this, {
      starDeferred: null,
      fetchStars: action("fetchStars", () => {
        when(
          // condition
          () =>
            sessionStore.authenticated &&
            (this.starDeferred === null ||
              this.starDeferred.state === REJECTED),
          // ... then
          () => {
            const userDeferred = sessionStore.userDeferred;
            this.starDeferred = fromPromise(
              githubAPI.fetchStars(userDeferred.value)
            );
          }
        );
      })
    });
  }
}
