/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addColumn('albums', {
    cover_image: {
      type: 'TEXT',
      notNull: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('albums', 'cover_image');
};
