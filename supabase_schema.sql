-- ============================================
-- Supabase (PostgreSQL) Schema for CCP-GENv2
-- Migrasi dari MySQL → PostgreSQL
-- ============================================

-- Traffic Type ENUM
CREATE TYPE traffic_type_enum AS ENUM ('WAP', 'WEB', 'APP', 'BOT');

-- ============================================
-- Tabel: admin
-- ============================================
CREATE TABLE IF NOT EXISTS admin (
    id SERIAL PRIMARY KEY,
    username VARCHAR(191) NOT NULL UNIQUE,
    password VARCHAR(191) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW()
);

-- ============================================
-- Tabel: campaign
-- ============================================
CREATE TABLE IF NOT EXISTS campaign (
    id SERIAL PRIMARY KEY,
    network VARCHAR(191) NOT NULL,
    "urlTemplate" TEXT NOT NULL,
    "postbackEndpoint" TEXT NOT NULL,
    "offerName" VARCHAR(191) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW()
);

-- ============================================
-- Tabel: domain
-- ============================================
CREATE TABLE IF NOT EXISTS domain (
    id SERIAL PRIMARY KEY,
    name VARCHAR(191) NOT NULL,
    subdomain VARCHAR(191),
    status VARCHAR(191) NOT NULL DEFAULT 'Pending',
    ssl VARCHAR(191) NOT NULL DEFAULT 'Pending',
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW()
);

-- ============================================
-- Tabel: tracker
-- ============================================
CREATE TABLE IF NOT EXISTS tracker (
    id SERIAL PRIMARY KEY,
    name VARCHAR(191) NOT NULL,
    slug VARCHAR(191) NOT NULL UNIQUE,
    team VARCHAR(191) NOT NULL,
    password VARCHAR(191),
    "targetUrl" VARCHAR(191) NOT NULL DEFAULT '',
    "domainId" INT REFERENCES domain(id) ON DELETE SET NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tracker_domainId ON tracker("domainId");

-- ============================================
-- Tabel: link
-- ============================================
CREATE TABLE IF NOT EXISTS link (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(191) NOT NULL UNIQUE,
    "targetUrl" TEXT NOT NULL,
    domain VARCHAR(191) NOT NULL,
    "trackerId" VARCHAR(191) NOT NULL,
    network VARCHAR(191),
    "useLandingPage" BOOLEAN NOT NULL DEFAULT FALSE,
    "ogImage" TEXT,
    "ogTitle" VARCHAR(191),
    "ogDescription" TEXT,
    "clickCount" INT NOT NULL DEFAULT 0,
    "leadCount" INT DEFAULT 0,
    "totalPayout" DECIMAL(10,2) DEFAULT 0.00,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT NOW()
);

-- ============================================
-- Tabel: click
-- ============================================
CREATE TABLE IF NOT EXISTS click (
    id SERIAL PRIMARY KEY,
    "linkId" INT NOT NULL REFERENCES link(id) ON DELETE CASCADE,
    ip VARCHAR(191) NOT NULL,
    country VARCHAR(191) NOT NULL,
    "userAgent" TEXT NOT NULL,
    external_id VARCHAR(255),
    referrer TEXT,
    os VARCHAR(50),
    browser VARCHAR(50),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_click_linkId ON click("linkId");
CREATE INDEX IF NOT EXISTS idx_click_createdAt ON click("createdAt");

-- ============================================
-- Tabel: conversions
-- ============================================
CREATE TABLE IF NOT EXISTS conversions (
    id SERIAL PRIMARY KEY,
    click_id VARCHAR(100) NOT NULL,
    sub_id VARCHAR(100) DEFAULT 'Unknown',
    network VARCHAR(50) DEFAULT 'IMONETIZEIT',
    country CHAR(2) DEFAULT 'US',
    country_name VARCHAR(100) DEFAULT 'United States',
    traffic_type traffic_type_enum DEFAULT 'WAP',
    earning DECIMAL(10,4) DEFAULT 0.0000,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_conversions_created_at ON conversions(created_at);
CREATE INDEX IF NOT EXISTS idx_conversions_sub_id ON conversions(sub_id);

-- ============================================
-- Tabel: daily_reports
-- ============================================
CREATE TABLE IF NOT EXISTS daily_reports (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    smartlink VARCHAR(100) NOT NULL,
    network VARCHAR(50) NOT NULL,
    leads INT DEFAULT 0,
    payout DECIMAL(10,4) DEFAULT 0.0000,
    UNIQUE(date, smartlink, network)
);
