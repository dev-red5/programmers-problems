import fetch from 'node-fetch';

const processStatus = (response) => {
  const successFlag = response.status === 200 || response.ok;

  if (successFlag) {
    return Promise.resolve(response);
  }

  return Promise.reject(response);
};

const defaultJSONHeaders = {
  Accept: 'application/json',
};

const defaultHTMLHeaders = {
  Accept: 'text/html',
};

const parseJson = (response) => response.json();
const parseHtml = (response) => response.text();

const getJSON = async ({ url, fetchParams = {}, handleError = {} }) => {
  const newFetchParams = {
    ...fetchParams,
    headers: Object.assign({}, defaultJSONHeaders, fetchParams.headers),
  };

  return getData(url, newFetchParams)
    .then((response) => processStatus(response))
    .then(parseJson)
    .catch((error) => handleError[error.status]());
};

const getHTML = async ({ url, fetchParams = {}, handleError = {} }) => {
  const newFetchParams = {
    ...fetchParams,
    headers: Object.assign({}, defaultHTMLHeaders, fetchParams.headers),
  };

  return getData(url, newFetchParams)
    .then((response) => processStatus(response))
    .then(parseHtml)
    .catch((error) => handleError[error.status]());
};

const getData = async (url, fetchParams) => {
  const newFetchParams = {
    ...fetchParams,
    method: fetchParams.method ?? 'get',
  };

  return fetch(url, newFetchParams);
};

export { getJSON, getHTML };
