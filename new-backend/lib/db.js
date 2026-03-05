import Sequelize from 'sequelize';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set.');
}

// Enable SSL only for Supabase or production hosted databases.
// Local PostgreSQL typically does NOT support SSL.
const useSSL =
    process.env.DATABASE_URL.includes('supabase') ||
    process.env.NODE_ENV === 'production';

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    ...(useSSL && {
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    }),
});

// Lazy init: tracks if sync has already been called to avoid repeating on every request
let initialized = false;

export async function initDB() {
    if (!initialized) {
        await sequelize.sync();
        initialized = true;
    }
}

export default sequelize;
