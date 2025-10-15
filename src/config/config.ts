import "dotenv/config";

export const config = {
  pgHost: process.env.PGHOST,
  pgUser: process.env.PGUSER,
  pgPassword: process.env.PGPASSWORD,
  pgDatabase: process.env.PGDDATABASE,
};
