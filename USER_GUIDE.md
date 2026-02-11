# Somatic Canticles - Local Development User Guide

## Admin Credentials
These credentials provide full access to the admin dashboard and all user management features.

- **Email**: `admin@somatic-canticles.local`
- **Password**: `SomaticDev44!`
- **Role**: `admin`
- **Birthdate**: `1991-08-13T13:31:00`

---

## Test User Accounts (15 Profiles)
These accounts have `user` role access. They are pre-seeded with variety of birthdates to test different biorhythm calculations.

| User ID | Email | Password | Birthdate | Timezone | Notes |
|---|---|---|---|---|---|
| 01 | `user01@example.com` | `Pass01!` | 1991-02-15 | America/New_York | Has initial progress |
| 02 | `user02@example.com` | `Pass02!` | 1992-03-15 | Europe/London | Has initial progress |
| 03 | `user03@example.com` | `Pass03!` | 1993-04-15 | America/New_York | |
| 04 | `user04@example.com` | `Pass04!` | 1994-05-15 | Europe/London | |
| 05 | `user05@example.com` | `Pass05!` | 1995-06-15 | America/New_York | |
| 06 | `user06@example.com` | `Pass06!` | 1996-07-15 | Europe/London | |
| 07 | `user07@example.com` | `Pass07!` | 1997-08-15 | America/New_York | |
| 08 | `user08@example.com` | `Pass08!` | 1998-09-15 | Europe/London | |
| 09 | `user09@example.com` | `Pass09!` | 1999-10-15 | America/New_York | |
| 10 | `user10@example.com` | `Pass10!` | 1990-01-15 | Europe/London | |
| 11 | `user11@example.com` | `Pass11!` | 1991-02-15 | America/New_York | Duplicate birthdate testing |
| 12 | `user12@example.com` | `Pass12!` | 1992-03-15 | Europe/London | |
| 13 | `user13@example.com` | `Pass13!` | 1993-04-15 | America/New_York | |
| 14 | `user14@example.com` | `Pass14!` | 1994-05-15 | Europe/London | |
| 15 | `user15@example.com` | `Pass15!` | 1995-06-15 | America/New_York | |

## How to Reset Database
To wipe the database and re-seed these users, run:

```bash
./setup-local.sh
```

## Running the API
The API must be running for login to work:

```bash
cd workers
bun run dev
```

(The API runs on `http://localhost:8787`)
