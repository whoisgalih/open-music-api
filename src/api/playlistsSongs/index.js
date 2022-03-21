const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistsSongs',
  version: '1.0.0',
  register: async (
    server,
    {
      playlistsSongsService,
      playlistsActivitiesService,
      songsService,
      validator,
    },
  ) => {
    const playlistsHandler = new PlaylistsHandler(
      playlistsSongsService,
      playlistsActivitiesService,
      songsService,
      validator,
    );

    server.route(routes(playlistsHandler));
  },
};
