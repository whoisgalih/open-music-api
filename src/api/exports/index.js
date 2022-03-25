const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, { producerService, playlistsVerifyService, validator }) => {
    const exportsHandler = new ExportsHandler(producerService, playlistsVerifyService, validator);
    server.route(routes(exportsHandler));
  },
};
