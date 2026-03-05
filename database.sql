-- Script to create the database
-- Run this in your PostgreSQL query tool (pgAdmin, DBeaver, or psql)

-- 1. Create the database
-- CREATE DATABASE invoicemaker;

-- 2. (Optional) Create a specific user if you don't want to use 'postgres'
-- CREATE USER invoice_user WITH PASSWORD 'secure_password';
-- GRANT ALL PRIVILEGES ON DATABASE invoicemaker TO invoice_user;

-- 3. Create Tables (If you want to create them manually instead of using Sequelize)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE "Users" (
    "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password" VARCHAR(255) NOT NULL,
    "role" VARCHAR(255) DEFAULT 'admin',
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Clients Table
CREATE TABLE "Clients" (
    "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(255),
    "address" VARCHAR(255),
    "nit" VARCHAR(255),
    "UserId" UUID REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Products Table
CREATE TABLE "Products" (
    "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10, 2) NOT NULL,
    "stock" INTEGER DEFAULT 0,
    "UserId" UUID REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Invoices Table
CREATE TABLE "Invoices" (
    "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    "number" SERIAL UNIQUE,
    "date" DATE DEFAULT CURRENT_DATE,
    "dueDate" DATE,
    "status" VARCHAR(255) DEFAULT 'draft', -- ENUM('draft', 'sent', 'paid', 'overdue')
    "subtotal" DECIMAL(10, 2) DEFAULT 0,
    "tax" DECIMAL(10, 2) DEFAULT 0,
    "total" DECIMAL(10, 2) DEFAULT 0,
    "notes" TEXT,
    "ClientId" UUID REFERENCES "Clients"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "UserId" UUID REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);

-- InvoiceItems Table
CREATE TABLE "InvoiceItems" (
    "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    "description" VARCHAR(255) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DECIMAL(10, 2) NOT NULL,
    "total" DECIMAL(10, 2) NOT NULL,
    "InvoiceId" UUID REFERENCES "Invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);
