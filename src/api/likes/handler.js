/* eslint-disable no-underscore-dangle */

class LikesHandler {
  constructor(likesService, albumsService, usersService) {
    this._likesService = likesService;
    this._albumsService = albumsService;
    this._usersService = usersService;

    this.postLikesHandler = this.postLikesHandler.bind(this);
    this.getLikesHandler = this.getLikesHandler.bind(this);
  }

  async postLikesHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this._usersService.getUserById(credentialId);
    await this._albumsService.getAlbumById(albumId);
    const message = await this._likesService.addLike(albumId, credentialId);

    const response = h.response({
      status: 'success',
      message,
    });

    response.code(201);
    return response;
  }

  async getLikesHandler(request) {
    const { id: albumId } = request.params;

    const likes = await this._likesService.getLikes(albumId);

    return {
      status: 'success',
      data: {
        likes,
      },
    };
  }
}

module.exports = LikesHandler;
