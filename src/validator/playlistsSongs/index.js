const InvariantError = require('../../exceptions/InvariantError');
const { SongInPlaylistPayloadSchema } = require('./schema');

const PlaylistsSongsValidator = {
  validateSongInPlaylistPayload: (payload) => {
    const validationResult = SongInPlaylistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistsSongsValidator;
