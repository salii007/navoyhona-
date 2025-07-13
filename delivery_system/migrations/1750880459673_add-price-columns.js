exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('scheduled_orders', {
    zalog_amount: { type: 'integer' },
    zalog_type: { type: 'text' },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('scheduled_orders', ['zalog_amount', 'zalog_type']);
};
