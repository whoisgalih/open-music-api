const ClientError = require('../../exceptions/ClientError');

class PlaylistsSongsHandler {
  constructor(playlistsSongsService, playlistsActivitiesService, songsService, validator) {
    this._playlistsSongsService = playlistsSongsService;
    this._playlistsActivitiesService = playlistsActivitiesService;
    this._songsService = songsService;
    this._validator = validator;

    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
    this.getSongsInPlaylistHandler = this.getSongsInPlaylistHandler.bind(this);
    this.deleteSongInPlaylistByIdHandler = this.deleteSongInPlaylistByIdHandler.bind(this);
  }

  async postSongToPlaylistHandler(request, h) {
    try {
      this._validator.validateSongInPlaylistPayload(request.payload);
      const { id: playlistId } = request.params;
      const { songId } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      await this._playlistsSongsService.verifyPlaylistAccess(playlistId, credentialId);
      await this._songsService.getSongById(songId);
      await this._playlistsSongsService.addSongToPlaylist({ songId, playlistId });
      await this._playlistsActivitiesService.addActivities(playlistId, songId, credentialId, 'add');

      const response = h.response({
        status: 'success',
        message: 'Song berhasil ditambahkan',
      });
      response.code(201);
      return response;
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

  async getSongsInPlaylistHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const { id: playlistId } = request.params;

      await this._playlistsSongsService.verifyPlaylistAccess(playlistId, credentialId);
      const playlist = await this._playlistsSongsService.getSongsInPlaylists(playlistId);

      return {
        status: 'success',
        data: {
          playlist,
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

  async deleteSongInPlaylistByIdHandler(request, h) {
    try {
      this._validator.validateSongInPlaylistPayload(request.payload);
      const { id: playlistId } = request.params;
      const { songId } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      await this._playlistsSongsService.verifyPlaylistAccess(playlistId, credentialId);
      await this._playlistsSongsService.deleteSongInPlaylistById(songId, playlistId);
      await this._playlistsActivitiesService.addActivities(playlistId, songId, credentialId, 'delete');

      return {
        status: 'success',
        message: 'Playlist berhasil dihapus',
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

module.exports = PlaylistsSongsHandler;
