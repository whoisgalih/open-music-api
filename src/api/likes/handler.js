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

  async getLikesHandler(request, h) {
    const { id: albumId } = request.params;

    const { likes, isFromCache } = await this._likesService.getLikes(albumId);

    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });

    if (isFromCache) {
      response.header('X-Data-Source', 'cache');
    } else {
      response.header('X-Data-Source', null);
    }

    return response;
  }
}

module.exports = LikesHandler;
