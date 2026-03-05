import { DataTypes } from 'sequelize';
import sequelize from '@/lib/db.js';
import Client from '@/models/Client.js';

const Invoice = sequelize.define('Invoice', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    number: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
    },
    date: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
    },
    dueDate: {
        type: DataTypes.DATEONLY,
    },
    status: {
        type: DataTypes.ENUM('draft', 'sent', 'paid', 'overdue'),
        defaultValue: 'draft',
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    tax: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    notes: {
        type: DataTypes.TEXT,
    },
});

const InvoiceItem = sequelize.define('InvoiceItem', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    productId: {
        type: DataTypes.UUID,
        allowNull: true,
    },
});

// Relationships
Invoice.belongsTo(Client);
Client.hasMany(Invoice);

Invoice.hasMany(InvoiceItem);
InvoiceItem.belongsTo(Invoice);

export { Invoice, InvoiceItem };
