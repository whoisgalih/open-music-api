const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums/{id}/likes',
    handler: handler.postLikesHandler,
    options: {
      auth: 'openmusicapi_jwt',
    },
  },
  {
    method: 'GET',
    path: '/albums/{id}/likes',
    handler: handler.getLikesHandler,
  },
];

module.exports = routes;
