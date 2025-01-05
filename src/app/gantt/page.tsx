'use client';

import { useState, useEffect } from 'react';
import Gantt from '../components/Gantt/Gantt';
async function getLocalData() {
  const response = await fetch('/api/gantt/issue/getAll');
  return response.json();
}
// import { getLocalData, writeLocalData } from '../lib/localdata';

// export async function getStaticProps() {
//   const localData = await getLocalData();

//   return {
//     props: { localData },
//   };
// }
function Page_Gantt({ Component, pageProps }) {
  const [issues, setIssues] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const localData = await getLocalData();
      setIssues(localData);
    };
    fetchData();
  }, []);
  return (
    <Gantt
      localData={issues}
      // writeLocalData={writeLocalData}
    />
  );
}

export default Page_Gantt;
