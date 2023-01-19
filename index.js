import { writeFile } from 'fs/promises';
import { fetchUtils } from './fetchUtils.js';

const url = 'https://school.programmers.co.kr/api/v1/school/challenges/?page=';
writeProblemFile();

async function writeProblemFile() {
  const problemList = await getSuccessProblemList();
  await writeFile('problems.json', JSON.stringify(problemList));
}

async function getSuccessProblemList() {
  const { totalPages } = await fetchUtils().getJSON({ url: url + 1 });

  const promisedFetchedDataList = [...new Array(totalPages)].map((_, idx) =>
    fetchProblemPageList(idx + 1)
  );

  const fetchedDataList = await Promise.all(promisedFetchedDataList);
  return fetchedDataList.reduce((prev, curr) => [...prev, ...curr], []);
}

async function fetchProblemPageList(pageNum) {
  return (await fetchUtils().getJSON({ url: url + pageNum })).result;
}
