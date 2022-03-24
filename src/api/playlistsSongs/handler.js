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
  }

  async getSongsInPlaylistHandler(request) {
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
  }

  async deleteSongInPlaylistByIdHandler(request) {
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
  }
}

module.exports = PlaylistsSongsHandler;
