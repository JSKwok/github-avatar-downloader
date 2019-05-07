var request = require('request');
var fs = require('fs');
var secrets = require('./secrets.js');

console.log('Welcome to the GitHub Avatar Downloader!');

// Declare the function.
function getRepoContributors (repoOwner, repoName, callback) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      Authorization : 'token ' + secrets.GITHUB_TOKEN
    }
  }
  request(options, function (err, res, body) {
    callback(err, JSON.parse(body));
  });
}
// Call the function, using a callback as an argument.
// The callback tells us what the program will do with the body
getRepoContributors("jquery", "jquery", function (err, result) {
  console.log("Errors:", err);
  for (let i = 0; i < result.length; i++) {
    console.log(result[i].avatar_url)
    if (!fs.existsSync('./avatars/')) {
      fs.mkdirSync('./avatars/');
    }
    downloadImageByURL(result[i].avatar_url, './avatars/' + `${result[i].login}` + '.jpg');
  }
});

function downloadImageByURL(url, filePath) {
  request.get(url)
    .pipe(fs.createWriteStream(filePath));
}


