const Joi = require('joi');

const SongInPlaylistPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = { SongInPlaylistPayloadSchema };
