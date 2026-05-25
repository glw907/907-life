import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
  return {
    sent: url.searchParams.get('sent') === '1',
    error: url.searchParams.get('error'),
  };
};
