-- ============================================
-- FORUM DATABASE SCHEMA
-- PostgreSQL syntax (adjust types for MySQL/SQLite if needed)
-- ============================================

-- Enable UUID generation (PostgreSQL)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. USERS
-- ============================================
CREATE TABLE users (
    id              int8 PRIMARY KEY DEFAULT gen_random_uuid(),
    username        VARCHAR(50)  NOT NULL UNIQUE,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NULL, -- nullable: user may sign up via OAuth only
    avatar_url      VARCHAR(255) NULL,
    bio             TEXT NULL,
    role            VARCHAR(20)  NOT NULL DEFAULT 'user',
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_role CHECK (role IN ('user', 'moderator', 'admin'))
);

-- ============================================
-- 2. OAUTH_ACCOUNTS
-- ============================================
CREATE TABLE oauth_accounts (
    id                  int8 PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             int8 NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider            VARCHAR(20)  NOT NULL,
    provider_user_id    VARCHAR(255) NOT NULL,
    access_token        VARCHAR(500) NULL,
    refresh_token       VARCHAR(500) NULL,
    token_expires_at    TIMESTAMP    NULL,
    created_at          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_provider_account UNIQUE (provider, provider_user_id),
    CONSTRAINT uq_user_provider UNIQUE (user_id, provider)
);

-- ============================================
-- 3. CATEGORIES
-- ============================================
CREATE TABLE categories (
    id              int8 PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    slug            VARCHAR(100) NOT NULL UNIQUE,
    description     TEXT NULL,
    parent_id       int8 NULL REFERENCES categories(id) ON DELETE SET NULL
);

-- ============================================
-- 4. TAGS
-- ============================================
CREATE TABLE tags (
    id      int8 PRIMARY KEY DEFAULT gen_random_uuid(),
    name    VARCHAR(50) NOT NULL UNIQUE,
    slug    VARCHAR(50) NOT NULL UNIQUE
);

-- ============================================
-- 5. POSTS
-- ============================================
CREATE TABLE posts (
    id              int8 PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         int8 NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id     int8 NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    title           VARCHAR(255) NOT NULL,
    body            TEXT NOT NULL,
    view_count      INT NOT NULL DEFAULT 0,
    is_pinned       BOOLEAN NOT NULL DEFAULT false,
    is_locked       BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NULL
);

-- ============================================
-- 6. POST_TAGS (junction table)
-- ============================================
CREATE TABLE post_tags (
    post_id     int8 NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    tag_id      int8 NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- ============================================
-- 7. COMMENTS
-- ============================================
CREATE TABLE comments (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id             UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_comment_id   UUID NULL REFERENCES comments(id) ON DELETE CASCADE,
    body                TEXT NOT NULL,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NULL
);

-- ============================================
-- 8. VOTES
-- ============================================
CREATE TABLE votes (
    id              int8 PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         int8 NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    votable_type    VARCHAR(10) NOT NULL,
    votable_id      UUID NOT NULL,
    value           SMALLINT NOT NULL,
    CONSTRAINT chk_votable_type CHECK (votable_type IN ('post', 'comment')),
    CONSTRAINT chk_value CHECK (value IN (1, -1)),
    CONSTRAINT uq_vote UNIQUE (user_id, votable_type, votable_id)
);

-- ============================================
-- USEFUL INDEXES
-- ============================================
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_category_id ON posts(category_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_parent_comment_id ON comments(parent_comment_id);
CREATE INDEX idx_votes_votable ON votes(votable_type, votable_id);
CREATE INDEX idx_oauth_user_id ON oauth_accounts(user_id);
