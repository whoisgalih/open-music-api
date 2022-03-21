const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistsActivities',
  version: '1.0.0',
  register: async (server, { playlistsActivitiesService }) => {
    const playlistsHandler = new PlaylistsHandler(playlistsActivitiesService);
    server.route(routes(playlistsHandler));
  },
};
