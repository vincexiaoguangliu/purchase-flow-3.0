import http from './http';

export default {
  // get dealStepData
  getDealStepInfo: (urlPar, dealID) => http('GET', `/v2/deals/${dealID}/dealstep`, { urlParams: urlPar }),

  // check deal step info
  confirmDealInfo: bodyPar => http('POST', '/v2/dealpurchases/confirm', { bodyParams: bodyPar }),
};
