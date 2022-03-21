const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const PlaylistsVerifyService = require('./PlaylistsVerifyService');

class PlaylistsActivitiesService extends PlaylistsVerifyService {
  async getActivitiesInPlaylists(playlistId) {
    const activityQuery = {
      text: `SELECT users.username, songs.title, playlist_song_activities.action, playlist_song_activities.time
      FROM playlist_song_activities
      LEFT JOIN songs ON songs.id = playlist_song_activities.song_id
      LEFT JOIN users ON users.id = playlist_song_activities.user_id
      WHERE playlist_song_activities.playlist_id = $1`,
      values: [playlistId],
    };
    const activitiesResult = await this._pool.query(activityQuery);

    return activitiesResult.rows;
  }

  async addActivities(playlistId, songId, userId, action) {
    const id = `activities-${nanoid(16)}`;
    const currentTime = new Date().toISOString();

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, currentTime],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Activities gagal ditambahkan');
    }

    return result.rows[0].id;
  }
}

module.exports = PlaylistsActivitiesService;
