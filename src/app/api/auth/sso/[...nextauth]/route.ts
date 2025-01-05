import { auth, handlers } from '@/src/lib/auth/authConfig';
import { NextApiRequest, NextApiResponse } from 'next';

// import { cookies } from 'next/headers';

export const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  // const cookieStore = await cookies();
  // console.log('cookieStore', cookieStore, cookieStore.getAll());
  // const authToken = cookieStore.get('__Secure-authjs.session-token');
  // console.log(authToken);
  // if (!authToken) {
  //   return new Response('unauthorized');
  // }
  // return new Response(authToken);
  // TODO: Get token from cookie, and user needs to pass in their cookie.
  // We will compare the two cookies to make sure it is the same user with the same credentials.
  // If the cookies are the same, we will return the token.
  // If not, we will set the cookie from sentinel for the SSO scenario
  // If not present on either then return "UNAUTHORIZED"
  const authToken =
    'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoidmV1cWR2S01mZTBhVVc5YWJQM01renhQZmpVUHpSVG1Ka3dRSmFKWDcxMUVHN3lMNFJyRkJxQmFMeFY1VTdHOXVqa0JESEdIazRSN3R4RVY0Q25OOVEifQ..ZLEzz9RDebolx9LnzfshmA.iOyGOwe9WNKtp01NDXR2yZX9IBfxqcaKzXqEC4pFzGEmp3-opsArVyi5G3TXRiM42wR0LNw1I1W8jLeOYdPl-pppdZ2PQUgKvx_ZQiwONFZARZiaqlgkr_r0Zi3SFNYyxKlRoq8X6sn0c847yRlhAjbYOXnL_p4OxUUapTjXXBaUXUaI0smZzigkCCL1iqHO_8tpjXGcBz9_kfs9rGM68WjDVrozT0O5FKNiBN0WwfqEaTgdLNTVhqcBfHDpKzKECHFdJPohhkiK9UreK4zF__lqPCipZX-L3k6AJtyWnWcYaLwh6QJfk2Lvu0EFOz8Z0KMfmLJNHz3GtouOTpysRq1KkdQ8ffy1GqhdNfbzViWY8zHDNmQNgUcDmEx8N4ScPGsovK1LLAMmF7ezOUtMyez-MYZ3aOlKia6CfvzBpTInnzP4-c8aRIyAiRrPkaf0FlTI6T1F1HP46aDGvL1RlA.SZfWgqwCDhKo4LB8smCMJXByhG1G0nohN5ZHIdIadpg';
  return new Response(JSON.stringify(authToken), { status: 200 });
};
export const { GET } = handlers;
