export default class GithubAPI {
  constructor({ userToken }) {
    this.userToken = userToken;
    this.defaultHeaders = {
      Authorization: `token ${this.userToken}`
    };
  }

  currentUser = () => {
    return fetch("https://api.github.com/user", {
      headers: {
        ...this.defaultHeaders
      }
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject();
      }
    });
  };

  fetchStars = ({ login }) => {
    return fetch(`https://api.github.com/users/${login}/starred`, {
      headers: {
        ...this.defaultHeaders
      }
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject();
      }
    });
  }

  userRepositories = ({ login }) => {
    return fetch(`https://api.github.com/users/${login}/repos`, {
      headers: {
        ...this.defaultHeaders
      }
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject();
      }
    });
  };

  postIssue = ({ login, repo, title, text }) => {
    return fetch(`https://api.github.com/repos/${login}/${repo}/issues`, {
      method: "POST",
      headers: {
        ...this.defaultHeaders,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: title,
        body: text
      })
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject();
      }
    });
  };

  updateIssue = ({ login, repo, number, title, text }) => {
    return fetch(`https://api.github.com/repos/${login}/${repo}/issues/${number}`, {
      method: "PATCH",
      headers: {
        ...this.defaultHeaders,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: title,
        body: text
      })
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject();
      }
    });
  };

  fetchIssues = ({login}, repo) => {
    return fetch(`https://api.github.com/repos/${login}/${repo}/issues`, {
      headers: {
        ...this.defaultHeaders
      }
  }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject();
      }
    });
  };
}