/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');

const InvariantError = require('../../exceptions/InvariantError');

class LikesService {
  constructor() {
    this._pool = new Pool();
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

    return 'Like berhasil dihapus';
  }

  async getLikes(albumId) {
    const query = {
      text: 'SELECT COUNT(*) FROM user_album_likes WHERE album_id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);

    return parseInt(result.rows[0].count, 10);
  }
}

module.exports = LikesService;
