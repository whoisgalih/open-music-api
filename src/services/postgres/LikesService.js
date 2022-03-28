/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');

const InvariantError = require('../../exceptions/InvariantError');

class LikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  // eslint-disable-next-line class-methods-use-this
  async addLike(albumId, userId) {
    const id = `like-${nanoid(16)}`;

    const query = {
      text: 'SELECT id FROM user_album_likes WHERE album_id = $1 AND user_id = $2',
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      const insertQuery = {
        text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
        values: [id, albumId, userId],
      };
      const insertResult = await this._pool.query(insertQuery);

      if (!insertResult.rows.length) {
        throw new InvariantError('Like gagal ditambahkan');
      }

      await this._cacheService.delete('albums:likes');

      return 'Like berhasil ditambahkan';
    }

    const deleteQuery = {
      text: 'DELETE FROM user_album_likes WHERE album_id = $1 AND user_id = $2 RETURNING id',
      values: [albumId, userId],
    };

    const deleteResult = await this._pool.query(deleteQuery);

    if (!deleteResult.rows.length) {
      throw new InvariantError('Like gagal dihapus');
    }

    await this._cacheService.delete('albums:likes');

    return 'Like berhasil dihapus';
  }

  async getLikes(albumId) {
    try {
      const likes = await this._cacheService.get('albums:likes');
      return { likes: parseInt(likes, 10), isFromCache: true };
    } catch (error) {
      const query = {
        text: 'SELECT COUNT(*) FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };

      const result = await this._pool.query(query);
      const likes = result.rows[0].count;

      await this._cacheService.set('albums:likes', likes);

      return { likes: parseInt(likes, 10), isFromCache: false };
    }
  }
}

module.exports = LikesService;
