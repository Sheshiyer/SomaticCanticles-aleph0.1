# Biorhythm API Documentation

## Base URL
```
/biorhythm
```

## Endpoints

### POST /biorhythm/calculate

Calculate biorhythm cycles for a specific date.

#### Authentication
- Optional (JWT token in Authorization header)
- If authenticated and user has birthdate in profile, birthdate parameter is optional

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| birthdate | string | Conditional | Birth date in YYYY-MM-DD format (required if not authenticated or no profile birthdate) |
| targetDate | string | No | Target date in YYYY-MM-DD format (defaults to today) |
| timezone | string | No | IANA timezone identifier (defaults to "UTC") |

#### Request Example
```json
{
  "birthdate": "1990-06-15",
  "targetDate": "2024-03-20",
  "timezone": "America/New_York"
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "date": "2024-03-20",
    "physical": 0.891,
    "emotional": -0.104,
    "intellectual": 0.707,
    "spiritual": -0.623,
    "peaks": ["physical"],
    "criticalDays": ["emotional"],
    "birthdate": "1990-06-15",
    "timezone": "America/New_York"
  }
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| date | string | The calculated date (YYYY-MM-DD) |
| physical | number | Physical cycle value (-1 to 1), 23-day period |
| emotional | number | Emotional cycle value (-1 to 1), 28-day period |
| intellectual | number | Intellectual cycle value (-1 to 1), 33-day period |
| spiritual | number | Spiritual cycle value (-1 to 1), 21-day period |
| peaks | string[] | Array of cycle names with value > 0.8 |
| criticalDays | string[] | Array of cycle names with value near 0 (\|value\| < 0.1) |

#### Error Responses

**400 Bad Request - Missing Birthdate**
```json
{
  "success": false,
  "error": {
    "code": "BIRTHDATE_REQUIRED",
    "message": "Birthdate is required. Either authenticate with a profile containing birthdate or provide birthdate in request body."
  }
}
```

**400 Bad Request - Invalid Birthdate**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_BIRTHDATE",
    "message": "Invalid birthdate provided"
  }
}
```

**400 Bad Request - Invalid Timezone**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_TIMEZONE",
    "message": "Invalid timezone provided"
  }
}
```

**400 Bad Request - Date Before Birthdate**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_DATE_RANGE",
    "message": "Target date cannot be before birthdate"
  }
}
```

---

### GET /biorhythm/predict

Get biorhythm predictions for multiple days (default 30 days).

#### Authentication
- Optional (JWT token in Authorization header)
- If authenticated, stores results in biorhythm_snapshots table

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| birthdate | string | Conditional | Birth date in YYYY-MM-DD format (required if not authenticated) |
| startDate | string | No | Start date in YYYY-MM-DD format (defaults to today) |
| days | number | No | Number of days to predict (1-90, defaults to 30) |
| timezone | string | No | IANA timezone identifier (defaults to "UTC") |
| latitude | number | No | Latitude for sunrise/sunset data (-90 to 90) |
| longitude | number | No | Longitude for sunrise/sunset data (-180 to 180) |

#### Request Example
```
GET /biorhythm/predict?birthdate=1990-06-15&days=30&timezone=America/New_York&latitude=40.7128&longitude=-74.0060
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "birthdate": "1990-06-15",
    "timezone": "America/New_York",
    "startDate": "2024-03-20",
    "days": 30,
    "predictions": [
      {
        "date": "2024-03-20",
        "daysSinceBirth": 12315,
        "physical": 0.891,
        "emotional": -0.104,
        "intellectual": 0.707,
        "spiritual": -0.623,
        "peaks": ["physical"],
        "criticalDays": ["emotional"],
        "sunrise": "2024-03-20T11:06:00+00:00",
        "sunset": "2024-03-20T23:16:00+00:00"
      },
      {
        "date": "2024-03-21",
        "daysSinceBirth": 12316,
        "physical": 0.813,
        "emotional": -0.029,
        "intellectual": 0.661,
        "spiritual": -0.535,
        "peaks": ["physical"],
        "criticalDays": ["emotional"],
        "sunrise": "2024-03-21T11:04:00+00:00",
        "sunset": "2024-03-21T23:17:00+00:00"
      }
      // ... more days
    ],
    "summary": {
      "totalDays": 30,
      "peaks": {
        "physical": 2,
        "emotional": 0,
        "intellectual": 0,
        "spiritual": 0
      },
      "criticalDays": {
        "physical": 0,
        "emotional": 2,
        "intellectual": 0,
        "spiritual": 0
      }
    }
  }
}
```

#### Prediction Object Fields

| Field | Type | Description |
|-------|------|-------------|
| date | string | The date (YYYY-MM-DD) |
| daysSinceBirth | number | Days elapsed since birth |
| physical | number | Physical cycle value (-1 to 1) |
| emotional | number | Emotional cycle value (-1 to 1) |
| intellectual | number | Intellectual cycle value (-1 to 1) |
| spiritual | number | Spiritual cycle value (-1 to 1) |
| peaks | string[] | Cycles in peak state (> 0.8) |
| criticalDays | string[] | Cycles in critical state (near 0) |
| sunrise | string | ISO timestamp of sunrise (if lat/lng provided) |
| sunset | string | ISO timestamp of sunset (if lat/lng provided) |

#### Summary Object Fields

| Field | Type | Description |
|-------|------|-------------|
| totalDays | number | Total number of days in prediction |
| peaks | object | Count of peak days per cycle |
| criticalDays | object | Count of critical days per cycle |

---

### GET /biorhythm/today

Quick endpoint to get today's biorhythm for authenticated user.

#### Authentication
- Required (JWT token in Authorization header)

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| timezone | string | No | IANA timezone identifier (defaults to "UTC") |

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "date": "2024-03-20",
    "physical": 0.891,
    "emotional": -0.104,
    "intellectual": 0.707,
    "spiritual": -0.623,
    "peaks": ["physical"],
    "criticalDays": ["emotional"],
    "birthdate": "1990-06-15",
    "timezone": "UTC"
  }
}
```

#### Error Responses

**400 Bad Request - Birthdate Not Set**
```json
{
  "success": false,
  "error": {
    "code": "BIRTHDATE_NOT_SET",
    "message": "Please set your birthdate in your profile to use this feature"
  }
}
```

**401 Unauthorized**
```json
{
  "success": false,
  "error": {
    "code": "AUTH_MISSING_TOKEN",
    "message": "Authorization header is required"
  }
}
```

---

### GET /biorhythm/cycles/info

Get information about biorhythm cycles.

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "cycles": {
      "physical": {
        "name": "Physical",
        "length": 23,
        "description": "Represents physical strength, endurance, coordination, and overall vitality"
      },
      "emotional": {
        "name": "Emotional",
        "length": 28,
        "description": "Represents emotional stability, sensitivity, creativity, and mood"
      },
      "intellectual": {
        "name": "Intellectual",
        "length": 33,
        "description": "Represents mental alertness, analytical ability, logic, and memory"
      },
      "spiritual": {
        "name": "Spiritual",
        "length": 21,
        "description": "Represents intuition, spiritual awareness, and connection to higher consciousness"
      }
    },
    "thresholds": {
      "peak": 0.8,
      "critical": 0.1
    },
    "formula": "sin(2π × days_since_birth / cycle_length)"
  }
}
```

---

## Location API

### GET /location/sunrise

Get sunrise and sunset times for a location.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| lat | number | Yes | Latitude (-90 to 90) |
| lng | number | Yes | Longitude (-180 to 180) |
| date | string | No | Date in YYYY-MM-DD format (defaults to today) |
| days | number | No | Number of days to fetch (1-30, defaults to 1) |

#### Request Example
```
GET /location/sunrise?lat=40.7128&lng=-74.0060&date=2024-03-20
```

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "latitude": 40.7128,
    "longitude": -74.006,
    "date": "2024-03-20",
    "sunrise": "2024-03-20T11:06:00+00:00",
    "sunset": "2024-03-20T23:16:00+00:00",
    "solarNoon": "2024-03-20T17:11:00+00:00",
    "dayLength": "12:10:00",
    "cached": false
  }
}
```

#### Multi-day Response

When `days` parameter is provided:

```json
{
  "success": true,
  "data": {
    "latitude": 40.7128,
    "longitude": -74.006,
    "startDate": "2024-03-20",
    "days": 7,
    "results": [
      {
        "date": "2024-03-20",
        "sunrise": "2024-03-20T11:06:00+00:00",
        "sunset": "2024-03-20T23:16:00+00:00",
        "solarNoon": "2024-03-20T17:11:00+00:00",
        "dayLength": "12:10:00",
        "cached": false
      }
      // ... more days
    ]
  }
}
```

#### Error Responses

**400 Bad Request - Invalid Latitude**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_LATITUDE",
    "message": "Latitude must be between -90 and 90"
  }
}
```

**400 Bad Request - Invalid Longitude**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_LONGITUDE",
    "message": "Longitude must be between -180 and 180"
  }
}
```

**503 Service Unavailable**
```json
{
  "success": false,
  "error": {
    "code": "SUN_DATA_UNAVAILABLE",
    "message": "Unable to retrieve sunrise/sunset data for the specified location and date"
  }
}
```

---

### GET /location/timezones

Get a list of supported timezone examples.

#### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "timezones": [
      { "id": "UTC", "name": "Coordinated Universal Time", "region": "Global" },
      { "id": "America/New_York", "name": "Eastern Time", "region": "North America" },
      { "id": "Europe/London", "name": "Greenwich Mean Time", "region": "Europe" },
      { "id": "Asia/Tokyo", "name": "Japan Standard Time", "region": "Asia" }
    ],
    "note": "This is a sample of supported timezones. The API accepts any valid IANA timezone identifier."
  }
}
```

---

## Error Codes Reference

| Code | HTTP Status | Description |
|------|-------------|-------------|
| AUTH_MISSING_TOKEN | 401 | Authorization header is required |
| AUTH_INVALID_TOKEN | 401 | Invalid or malformed token |
| AUTH_TOKEN_EXPIRED | 401 | Token has expired |
| BIRTHDATE_REQUIRED | 400 | Birthdate must be provided or stored in profile |
| BIRTHDATE_NOT_SET | 400 | User profile does not have birthdate set |
| INVALID_BIRTHDATE | 400 | Birthdate format is invalid or in the future |
| INVALID_DATE_RANGE | 400 | Target date is before birthdate |
| INVALID_TIMEZONE | 400 | Invalid IANA timezone identifier |
| INVALID_DAYS_RANGE | 400 | Days parameter out of range (1-365 or 1-90) |
| INVALID_LATITUDE | 400 | Latitude out of range (-90 to 90) |
| INVALID_LONGITUDE | 400 | Longitude out of range (-180 to 180) |
| INVALID_DATE_FORMAT | 400 | Date not in YYYY-MM-DD format |
| CALCULATION_ERROR | 500 | Failed to calculate biorhythm |
| PREDICTION_ERROR | 500 | Failed to generate prediction |
| SUN_DATA_ERROR | 500 | Failed to retrieve sunrise/sunset data |
| SUN_DATA_UNAVAILABLE | 503 | External sun API unavailable |

---

## Cycle Information

### Physical Cycle
- **Length**: 23 days
- **Description**: Physical strength, endurance, coordination, vitality
- **Peak Activities**: Exercise, physical challenges, sports
- **Low Activities**: Rest, recovery, light movement

### Emotional Cycle
- **Length**: 28 days
- **Description**: Emotional stability, sensitivity, creativity, mood
- **Peak Activities**: Social interactions, creative work, relationship building
- **Low Activities**: Self-reflection, emotional processing

### Intellectual Cycle
- **Length**: 33 days
- **Description**: Mental alertness, analytical ability, logic, memory
- **Peak Activities**: Problem-solving, learning, complex decisions
- **Low Activities**: Routine tasks, review, rest

### Spiritual Cycle
- **Length**: 21 days
- **Description**: Intuition, spiritual awareness, higher consciousness
- **Peak Activities**: Meditation, spiritual practice, intuitive work
- **Low Activities**: Grounding practices, physical connection

---

## Formula

All cycles use the same mathematical formula:

```
cycle_value = sin(2π × days_since_birth / cycle_length)
```

Where:
- `days_since_birth`: Number of days between birthdate and target date
- `cycle_length`: Period of the cycle (23, 28, 33, or 21 days)
- Result is always in range [-1, 1]

---

## Thresholds

| Threshold | Value | Meaning |
|-----------|-------|---------|
| Peak | > 0.8 | Cycle is near maximum, optimal performance |
| Positive | > 0 | Cycle is in high phase |
| Critical | \|value\| < 0.1 | Cycle crossing zero, transition period |
| Negative | < 0 | Cycle is in low phase |

---

## Timezone Handling

The API accepts any valid IANA timezone identifier (e.g., "America/New_York", "Europe/Paris", "Asia/Tokyo"). Dates are normalized to midnight in the specified timezone before calculation.

### Common Timezones

| Region | Timezone ID |
|--------|-------------|
| UTC | `UTC` |
| Eastern (US) | `America/New_York` |
| Central (US) | `America/Chicago` |
| Mountain (US) | `America/Denver` |
| Pacific (US) | `America/Los_Angeles` |
| London | `Europe/London` |
| Paris | `Europe/Paris` |
| Tokyo | `Asia/Tokyo` |
| Sydney | `Australia/Sydney` |

---

## Rate Limiting

The API implements rate limiting. See the main API documentation for details.

---

## Caching

Sunrise/sunset data is cached in D1 for 30 days per location+date combination to reduce external API calls.
