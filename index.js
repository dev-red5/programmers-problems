import fetch from 'node-fetch';
import { writeFile } from 'fs/promises';

const url = 'https://school.programmers.co.kr/api/v1/school/challenges/?page=';
writeProblemFile();

async function writeProblemFile() {
  try {
    const problemList = await getSuccessProblemList();

    await writeFile('problems.json', JSON.stringify(problemList));
  } catch (error) {
    console.log(error);
  }
}

async function getSuccessProblemList() {
  const { totalPages } = await fetchRequest({ url: url + 1 });

  const promisedFetchedDataList = [...new Array(totalPages)].map((_, idx) =>
    fetchProblemPageList(idx + 1)
  );

  const fetchedDataList = await Promise.all(promisedFetchedDataList);
  return fetchedDataList.reduce((prev, curr) => [...prev, ...curr], []);
}

async function fetchProblemPageList(pageNum) {
  return (await fetchRequest({ url: url + pageNum })).result;
}

async function fetchRequest(reqConfig) {
  const { url, method, headers, body } = reqConfig;

  try {
    const res = await fetch(url, {
      method: method || 'GET',
      headers: headers || {},
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      throw new Error('[Pro-Solve] 데이터 fetch하는데 실패했습니다.');
    }

    const payload = await res.json();
    return payload;
  } catch (error) {
    throw new Error(`${error}`);
  }
}
