// Import required modules.
const express = require('express');
const { Octokit } = require('@octokit/rest');
const { throttling } = require("@octokit/plugin-throttling");
const MyOcktokit = Octokit.plugin(throttling);

// Initialize octokit.
const octokit = new MyOcktokit({
    auth: '{token}',
    throttle: {
      onRateLimit: (retryAfter, options) => {
        octokit.log.warn(
          `Request quota exhausted for request ${options.method} ${options.url}`,
        );
  
        // Retry twice after hitting a rate limit error, then give up
        if (options.request.retryCount <= 2) {
          console.log(`Retrying after ${retryAfter} seconds!`);
          return true;
        }
      },
      onSecondaryRateLimit: (retryAfter, options, octokit) => {
        // does not retry, only logs a warning
        octokit.log.warn(
          `Secondary quota detected for request ${options.method} ${options.url}`,
        );
      },
    }
  });

// Start express.
const app = express();

/**
 * Gets advisories.
 * 
 * Takes the following query parameters:
 * @param {string} cve The CVE number to search for.
 * @param {string} repo The repo to search for in conjunction of the given CVE.
 */
app.get('/advisories', (req, res) => {
    let query = '/advisories';
    let hasCveParam = false;
    if (req.query.cve !== undefined) {
        query += `?cve_id=${req.query.cve}`;
        hasCveParam = true;
    }
    else if (req.query.repo !== undefined) {
        if (hasCveParam) {
            query += `&affects=${req.query.repo}`;
        }
        else {
            query += `?affects=${req.query.repo}`;
        }
    }

    octokit.request(`GET ${query}`, {
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
      })
      .then(response => {
        const advisories = response.data;
      
        res.json({ message: advisories });
      })
      .catch(error => {
        console.error('Error:', error);
        res.json({ message: error });
      });
});

/**
 * Gets advisory details.
 * 
 * Takes the following query parameters:
 * @param {string} ghsa_id The GitHub Security Advisory ID associated with a specific repo and CVE.
 */
app.get('/advisory_details', (req, res) => {
    octokit.request(`GET /advisories/${req.query.ghsa_id}`, {
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
      })
      .then(response => {
        const details = response.data;
      
        res.json({ message: details });
      })
      .catch(error => {
        console.error('Error:', error);
        res.json({ message: error });
      });
});

/**
 * Gets commit details for a repo.
 * 
 * Takes the following query parameters:
 * @param {string} owner The owner of the repo.
 * @param {string} repo The name of the repo.
 * @param {string} ref The reference hash associated with the commit.
 */
app.get('/commit', (req, res) => {
  octokit.request(`GET /repos/${req.query.owner}/${req.query.repo}/commits/${req.query.ref}`, {
    owner: req.query.owner,
    repo: req.query.repo,
    ref: req.query.ref,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  }).then(response => {
    const details = response.data;
  
    res.json({ message: details });
  })
  .catch(error => {
    console.error('Error:', error);
    res.json({ message: error });
  });
});

/**
 * Gets a release for a repo by tag.
 * 
 * Takes the following query parameters:
 * @param {string} owner The owner of the repo.
 * @param {string} repo The name of the repo.
 * @param {string} tag The tag of the release.
 */
app.get('/release', (req, res) => {
  octokit.request(`GET /repos/${req.query.owner}/${req.query.repo}/releases/tags/${req.query.tag}`, {
    owner: req.query.owner,
    repo: req.query.repo,
    tag: req.query.tag,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  }).then(response => {
    const details = response.data;
  
    res.json({ message: details });
  })
  .catch(error => {
    console.error('Error:', error);
    res.json({ message: error });
  });
});

/**
 * Gets a pull request for a repo.
 * 
 * Takes the following query parameters:
 * @param {string} owner The owner of the repo.
 * @param {string} repo The name of the repo.
 * @param {number} pullNumber The id of the pull request.
 */
app.get('/pull', (req, res) => {
  octokit.request(`GET /repos/${req.query.owner}/${req.query.repo}/pulls/${req.query.pullNumber}`, {
    owner: req.query.owner,
    repo: req.query.repo,
    pull_number: req.query.pullNumber,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  }).then(response => {
    const details = response.data;
  
    res.json({ message: details });
  })
  .catch(error => {
    console.error('Error:', error);
    res.json({ message: error });
  });
});

// Start the server.
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
