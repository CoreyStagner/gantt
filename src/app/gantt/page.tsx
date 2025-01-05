import Gantt from '../components/Gantt/Gantt';

// import { getLocalData, writeLocalData } from '../lib/localdata';

// export async function getStaticProps() {
//   const localData = await getLocalData();

//   return {
//     props: { localData },
//   };
// }
function Page_Gantt({
  Component,
  pageProps,
  // localData, writeLocalData
}) {
  return (
    <Gantt
    // localData={localData} writeLocalData={writeLocalData}
    />
  );
}

export default Page_Gantt;
