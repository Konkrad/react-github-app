import createHistory from "history/createBrowserHistory";
import { extendObservable, computed } from "mobx";
import React from "react";
import Issue from "../ui/issue";
import RepositoryList from "../ui/repositoryList";
import StarList from "../ui/StarsList";
import RouteNotFound from "../ui/routeNotFound";
import myro from "myro";

const history = createHistory();

const routeDefinitions = {
  "/": "home",
  "/repos": "repos",
  "/about": "about",
  "/issue/:repo": {
    "name": "issue",
    "routes": {
      "/:id": "id"
    } 
  }
};

const routes = myro(routeDefinitions);

export default class ViewStore {
  constructor() {
    history.listen(location => {
      this.location = location.pathname;
    });

    this.routes = routes;

    extendObservable(this, {
      location: window.location.pathname,
      push: url => history.push(url),
      currentView: computed(() => {
        const route = routes(this.location) || {};
        switch ((route.name || "").split(".")[0]) {
          case "about": {
            return {
              ...route,
              component: StarList
            };
          }
          case "repos": {
            return {
              ...route,
              component: RepositoryList
            };
          }
          case "issue": {
            return {
              ...route,
              component: Issue
            };
          }
          default: {
            if (this.location === "/") {
              return {
                name: 'home',
                component: () => <div>HOME</div>
              };
            }

            return {
              name: "notfound",
              component: RouteNotFound
            };
          }
        }
      })
    });
  }
}
