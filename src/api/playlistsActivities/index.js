/* eslint-disable max-len */
const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistsActivities',
  version: '1.0.0',
  register: async (server, { playlistsActivitiesService, playlistsVerifyService }) => {
    const playlistsHandler = new PlaylistsHandler(playlistsActivitiesService, playlistsVerifyService);
    server.route(routes(playlistsHandler));
  },
};
