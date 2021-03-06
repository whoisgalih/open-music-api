const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const PlaylistsVerifyService = require('./PlaylistsVerifyService');

class PlaylistsSongsService extends PlaylistsVerifyService {
  constructor(collaborationService) {
    super();
    this._collaborationService = collaborationService;
  }

  async addSongToPlaylist({ songId, playlistId }) {
    const id = `playlist-song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongsInPlaylists(playlistId) {
    const playlistQuery = {
      text: `SELECT playlists.id, playlists.name, users.username 
      FROM playlists 
      LEFT JOIN users ON users.id = playlists.owner
      WHERE playlists.id = $1`,
      values: [playlistId],
    };
    const playlistResult = await this._pool.query(playlistQuery);
    const playlist = playlistResult.rows[0];

    const songQuery = {
      text: `SELECT songs.id, songs.title, songs.performer
      FROM songs
      LEFT JOIN playlists_songs ON songs.id = playlists_songs.song_id
      WHERE playlists_songs.playlist_id = $1`,
      values: [playlistId],
    };
    const songsResult = await this._pool.query(songQuery);

    playlist.songs = songsResult.rows;
    return playlist;
  }

  async deleteSongInPlaylistById(songId, playlistId) {
    const query = {
      text: 'DELETE FROM playlists_songs WHERE song_id = $1 AND playlist_id = $2 RETURNING id',
      values: [songId, playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = PlaylistsSongsService;
