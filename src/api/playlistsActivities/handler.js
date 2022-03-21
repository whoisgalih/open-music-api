const ClientError = require('../../exceptions/ClientError');

class PlaylistsActivitiesHandler {
  constructor(playlistsActivitiesService) {
    this._playlistsActivitiesService = playlistsActivitiesService;

    this.getPlaylistActivitiesHandler = this.getPlaylistActivitiesHandler.bind(this);
  }

  async getPlaylistActivitiesHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const { id: playlistId } = request.params;

      await this._playlistsActivitiesService.verifyPlaylistAccess(playlistId, credentialId);
      // eslint-disable-next-line max-len
      const activities = await this._playlistsActivitiesService.getActivitiesInPlaylists(playlistId);

      return {
        status: 'success',
        data: {
          playlistId,
          activities,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = PlaylistsActivitiesHandler;
