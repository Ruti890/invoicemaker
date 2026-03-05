import { DataTypes } from 'sequelize';
import sequelize from '@/lib/db.js';

const Client = sequelize.define('Client', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
    },
    address: {
        type: DataTypes.STRING,
    },
    nit: {
        type: DataTypes.STRING, // Tax ID
    },
});

export default Client;
