var request = require('request');
var fs = require('fs');
var secrets = require('./secrets.js');
var repoOwner = process.argv[2];
var repoName = process.argv[3];

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors (repoOwner, repoName, callback) {

  // Return an error message if either argument is empty.
  if (repoOwner == undefined || repoName == undefined) {
    console.log("Error: Please input both an owner and a name to download contributors for this repo.")
    return;
  };

  // Identify the endpoint where the data is located and authorize access
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      Authorization : 'token ' + secrets.GITHUB_TOKEN
    }
  }

  // Attempt to GET data. Throws an error if the path is invalid.
  request(options, function (err, res, body) {
    console.log('Status: ', res.statusMessage);
    res.on('error', function (err) {
      throw err;
    });
  // Calls the callback function if no error has occurred.
    callback(err, JSON.parse(body));
  });
}

// Calls the main function using arguments fropm command line.
getRepoContributors(repoOwner, repoName, function (err, result) {
  // Create target directory if it does not exist.
  if (!fs.existsSync('./avatars/')) {
    fs.mkdirSync('./avatars/');
  };
  // Loop through the resulting array.
  for (let i = 0; i < result.length; i++) {
    // Download specified image in loop to target directory.
    downloadImageByURL(result[i].avatar_url, './avatars/' + `${result[i].login}` + '.jpg');
  };
});

// Takes the URL from the scrape and writes to the specified file path.
function downloadImageByURL(url, filePath) {
  request.get(url)
    .pipe(fs.createWriteStream(filePath))
    .on('finish', function () {
      console.log("Image downloaded.")
    });
}



