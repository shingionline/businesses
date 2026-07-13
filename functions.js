function wait(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
  }

function formatKeyword(keyword) {
  keyword = keyword.replace(/ /g, '+'); // remove space
  keyword = keyword.replace(/,/g, ''); // remove comma
  keyword = keyword.replace(/&/g, 'and'); // replace all occurrences of '&' with 'and'
  keyword = keyword.replace(/\(/g, ''); // remove opening brackets
  keyword = keyword.replace(/\)/g, ''); // remove closing brackets
  keyword = keyword.toLowerCase(); // convert to lowercase
  return keyword;
}

module.exports = { wait, formatKeyword };