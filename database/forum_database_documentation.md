# Forum Database Documentation

## Overview

This document describes the database schema for the forum application. The schema consists of 7 tables: `users`, `categories`, `tags`, `posts`, `post_tags`, `comments`, and `votes`.

---

## 1. users

Stores every registered account on the forum. This is the root table — almost every other table links back to it to record who did what.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID / INT | PK | Unique identifier for the user |
| `username` | VARCHAR(50) | NOT NULL, UNIQUE | Public display name |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | Login email address |
| `password_hash` | VARCHAR(255) | NOT NULL | Encrypted password (never store plain text) |
| `avatar_url` | VARCHAR(255) | NULL | Link to profile picture |
| `bio` | TEXT | NULL | Short "about me" text |
| `role` | VARCHAR(20) | NOT NULL, DEFAULT `'user'` | Permission level: `user`, `moderator`, or `admin` |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT `CURRENT_TIMESTAMP` | Account creation date |

**Relationships:** Referenced by `posts.user_id`, `comments.user_id`, `votes.user_id`.

---

## 2. categories

Organizes posts into sections (e.g. "Gaming", "Tech Help"). Supports optional sub-categories through a self-reference.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID / INT | PK | Unique identifier for the category |
| `name` | VARCHAR(100) | NOT NULL | Display name of the category |
| `slug` | VARCHAR(100) | NOT NULL, UNIQUE | URL-friendly version of the name (e.g. `tech-help`) |
| `description` | TEXT | NULL | What the category covers |
| `parent_id` | UUID / INT | FK → `categories.id`, NULL | Parent category, if this is a sub-category. Null means top-level. |

**Relationships:** Referenced by `posts.category_id`. Self-referenced by `parent_id` for nesting.

---

## 3. tags

Stores keywords that can be attached to posts for filtering/search (e.g. "javascript", "help-needed"). Connected to posts through the `post_tags` junction table since the relationship is many-to-many.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID / INT | PK | Unique identifier for the tag |
| `name` | VARCHAR(50) | NOT NULL, UNIQUE | Tag name |
| `slug` | VARCHAR(50) | NOT NULL, UNIQUE | URL-friendly version of the name |

**Relationships:** Referenced by `post_tags.tag_id`.

---

## 4. posts

The core content table. Every discussion thread on the forum is a row here.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID / INT | PK | Unique identifier for the post |
| `user_id` | UUID / INT | FK → `users.id`, NOT NULL | Author of the post |
| `category_id` | UUID / INT | FK → `categories.id`, NOT NULL | Category the post belongs to |
| `title` | VARCHAR(255) | NOT NULL | Post headline |
| `body` | TEXT | NOT NULL | Main content of the post |
| `view_count` | INT | NOT NULL, DEFAULT `0` | Number of times the post has been viewed |
| `is_pinned` | BOOLEAN | NOT NULL, DEFAULT `false` | Whether a moderator has pinned it to the top |
| `is_locked` | BOOLEAN | NOT NULL, DEFAULT `false` | Whether new replies are disabled |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT `CURRENT_TIMESTAMP` | When the post was created |
| `updated_at` | TIMESTAMP | NULL | When the post was last edited |

**Relationships:** Links to `users` and `categories`. Referenced by `comments.post_id`, `post_tags.post_id`, and `votes` (via `votable_id`).

**Delete behavior:** If a user is deleted, either cascade-delete their posts or reassign them to a placeholder "deleted user" — the latter is more common on forums so discussion threads aren't lost.

---

## 5. post_tags (junction table)

Connects `posts` and `tags` in a many-to-many relationship — one post can have many tags, and one tag can apply to many posts. This table exists solely to link the two.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `post_id` | UUID / INT | FK → `posts.id`, NOT NULL | Part of composite PK |
| `tag_id` | UUID / INT | FK → `tags.id`, NOT NULL | Part of composite PK |

**Primary key:** Composite of (`post_id`, `tag_id`) — prevents the same tag being added twice to the same post.

**Delete behavior:** Both foreign keys should cascade — if a post or tag is deleted, the link row is removed automatically.

---

## 6. comments

Stores replies to posts (the "Post Discussion" section). Supports threaded/nested replies through a self-reference.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID / INT | PK | Unique identifier for the comment |
| `post_id` | UUID / INT | FK → `posts.id`, NOT NULL | The post this comment belongs to |
| `user_id` | UUID / INT | FK → `users.id`, NOT NULL | Author of the comment |
| `parent_comment_id` | UUID / INT | FK → `comments.id`, NULL | If this is a reply to another comment. Null means it's a top-level comment on the post. |
| `body` | TEXT | NOT NULL | Comment content |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT `CURRENT_TIMESTAMP` | When the comment was posted |
| `updated_at` | TIMESTAMP | NULL | When the comment was last edited |

**Relationships:** Links to `posts` and `users`. Self-referenced by `parent_comment_id` for threading. Referenced by `votes` (via `votable_id`).

**Delete behavior:** `post_id` should cascade — deleting a post removes its comments.

---

## 7. votes

Records upvotes/downvotes on either posts or comments. Powers "most discussed" and "top" sorting on the home page.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID / INT | PK | Unique identifier for the vote |
| `user_id` | UUID / INT | FK → `users.id`, NOT NULL | Who cast the vote |
| `votable_type` | VARCHAR(10) | NOT NULL | Type of content being voted on: `'post'` or `'comment'` |
| `votable_id` | UUID / INT | NOT NULL | ID of the post or comment (no true FK since it points to two different tables — this is a polymorphic reference) |
| `value` | SMALLINT | NOT NULL | `1` for upvote, `-1` for downvote (enforce with a CHECK constraint) |

**Unique constraint:** (`user_id`, `votable_type`, `votable_id`) — ensures a user can only vote once per post or comment.

---

## 8. oauth_accounts

Stores linked third-party login providers (Google, GitHub, Discord, etc.) so users can sign in without a separate password. One user can link multiple providers — that's why this is a separate table instead of columns on `users`.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID / INT | PK | Unique identifier for the linked account |
| `user_id` | UUID / INT | FK → `users.id`, NOT NULL | Which forum user this login belongs to |
| `provider` | VARCHAR(20) | NOT NULL | Provider name: `'google'`, `'github'`, `'discord'`, etc. |
| `provider_user_id` | VARCHAR(255) | NOT NULL | The unique ID given by the provider (e.g. Google's `sub` claim) |
| `access_token` | VARCHAR(500) | NULL | Token for making API calls to the provider, if needed |
| `refresh_token` | VARCHAR(500) | NULL | Used to get a new access token once it expires |
| `token_expires_at` | TIMESTAMP | NULL | When the access token expires |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT `CURRENT_TIMESTAMP` | When this login method was linked |

**Unique constraint:** (`provider`, `provider_user_id`) — the same provider account can't be linked to two different forum users.
**Unique constraint (optional):** (`user_id`, `provider`) — if you want to limit a user to one linked account per provider.

**Relationships:** Links to `users`. `user_id` should use `ON DELETE CASCADE` — deleting a user removes their linked logins too.

**Design note:** `password_hash` in `users` should become NULLABLE once this table exists, since a user who signs up purely via Google/GitHub won't have a forum password.

---

## Relationship Summary

| Table | Points to (via FK) | Referenced by |
|---|---|---|
| `users` | — | `posts`, `comments`, `votes`, `oauth_accounts` |
| `categories` | `categories` (self, `parent_id`) | `posts` |
| `tags` | — | `post_tags` |
| `posts` | `users`, `categories` | `comments`, `post_tags`, `votes` |
| `post_tags` | `posts`, `tags` | — |
| `comments` | `posts`, `users`, `comments` (self) | `votes` |
| `votes` | `users` | — |
| `oauth_accounts` | `users` | — |

---

## Design Notes

- **Polymorphic votes**: `votable_type` + `votable_id` lets one table handle votes on both posts and comments without duplicating logic. If this pattern feels error-prone, an alternative is splitting into separate `post_votes` and `comment_votes` tables.
- **Self-referencing FKs**: Used in `categories` (nested categories) and `comments` (threaded replies) — both are optional patterns; a flat structure works fine too if nesting isn't needed.
- **Sorting logic**: "New" vs "Top" on the home page doesn't need separate tables — just change the `ORDER BY` clause (`created_at DESC` for new, aggregated vote score for top).
