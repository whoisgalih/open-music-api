class PlaylistsActivitiesHandler {
  constructor(playlistsActivitiesService) {
    this._playlistsActivitiesService = playlistsActivitiesService;

    this.getPlaylistActivitiesHandler = this.getPlaylistActivitiesHandler.bind(this);
  }

  async getPlaylistActivitiesHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._playlistsActivitiesService.verifyPlaylistAccess(playlistId, credentialId);
    // prettier-ignore
    const activities = await this._playlistsActivitiesService.getActivitiesInPlaylists(
      playlistId,
    );

    return {
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    };
  }
}

module.exports = PlaylistsActivitiesHandler;
