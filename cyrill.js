'use strict';

// are we browsing a preview of a scanned Cyrill page?
var onPagePreview = function () {
  return window.location.href.includes('/nahled.php?');
};

var findLinkByText = function (text) {
  return document
    .evaluate("//a[contains(., '" + text + "')]", document, null, XPathResult.ANY_TYPE, null )
    .iterateNext();
};

var extractPosition = function () {
  return document
    .querySelector('table tr:nth-child(2) td p')
    .innerHTML
    .match(/Ročník: (\d{4}); strana: (\d+)/);
};

// finds year the current page belongs to
var extractYear = function () {
  return extractPosition()[1];
};

var previous = function () {
  document.location.href =
    findLinkByText('PŘEDCHOZÍ').href;
};

var next = function () {
  document.location.href =
    findLinkByText('NÁSLEDUJÍCÍ').href;
};

var up = function () {
  document.location.href =
    "http://cyril.psalterium.cz/?a=3&ListRocnik=" + extractYear();
};

var createStatusBar = function () {
  document.body.insertAdjacentHTML(
    'beforeend',
    '<div style="position: fixed; left: 0; bottom: 0; color: white; margin: 5px;">' +
      extractPosition()[0] +
      '</div>'
  );
};

if (onPagePreview()) {
  // unrelated hack: center content in the window
  document.querySelector('table').style.margin = '0px auto 0px auto';

  document.addEventListener('keydown', (event) => {
    const keyName = event.key;

    if (keyName === 'ArrowLeft') {
      previous();
    } else if (keyName === 'ArrowRight') {
      next();
    } else if (keyName === 'ArrowUp' && event.ctrlKey) {
      up();
    }
  }, false);

  createStatusBar();
}
