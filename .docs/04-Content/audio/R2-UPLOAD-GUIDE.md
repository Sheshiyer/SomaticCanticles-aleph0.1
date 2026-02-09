# R2 Audio Upload Guide

## Overview

This guide documents how to upload and manage audio files for the Somatic Canticles chapter system using Cloudflare R2 storage.

## Prerequisites

- Cloudflare account with R2 enabled
- Wrangler CLI installed and authenticated
- Access to R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY

## R2 Configuration

### Buckets

Two R2 buckets are configured:

1. **`canticle-audio`** (production) / **`canticle-audio-dev`** (development)
   - Stores chapter audio files
   - Public read access via signed URLs
   - CORS enabled for cross-origin requests

2. **`canticle-images`** (production) / **`canticle-images-dev`** (development)
   - Stores chapter cover images
   - Static asset delivery

### CORS Configuration

CORS is configured to allow:
- Origins: All (`*`)
- Methods: `GET`, `HEAD`
- Headers: All (`*`)
- Max Age: 3600 seconds

Apply CORS configuration:
```bash
# Using AWS CLI with R2 endpoint
aws s3api put-bucket-cors \
  --bucket canticle-audio \
  --cors-configuration file://workers/r2-cors.json \
  --endpoint-url https://<account-id>.r2.cloudflarestorage.com
```

## Upload Process

### Method 1: Using Wrangler R2 Commands

```bash
# Upload a single file
wrangler r2 object put canticle-audio/chapter-01-awakening.mp3 --file=./audio/chapter-01.mp3

# Upload with custom metadata
wrangler r2 object put canticle-audio/chapter-02-breath.mp3 \
  --file=./audio/chapter-02.mp3 \
  --content-type="audio/mpeg" \
  --custom-metadata="chapter=2,title=The Breath of Life"

# Upload entire directory
for file in ./audio/*.mp3; do
  filename=$(basename "$file")
  wrangler r2 object put "canticle-audio/$filename" --file="$file"
done
```

### Method 2: Using AWS CLI

```bash
# Configure AWS CLI for R2
aws configure set aws_access_key_id $R2_ACCESS_KEY_ID
aws configure set aws_secret_access_key $R2_SECRET_ACCESS_KEY

# Upload file
aws s3 cp ./audio/chapter-01.mp3 \
  s3://canticle-audio/chapter-01-awakening.mp3 \
  --endpoint-url https://<account-id>.r2.cloudflarestorage.com

# Sync entire directory
aws s3 sync ./audio/ s3://canticle-audio/ \
  --endpoint-url https://<account-id>.r2.cloudflarestorage.com
```

### Method 3: Using the Web Dashboard

1. Log in to Cloudflare Dashboard
2. Navigate to R2 > canticle-audio bucket
3. Click "Upload" button
4. Drag and drop files or select from file picker
5. Files are automatically assigned public URLs

## Audio File Naming Convention

```
chapter-{order}-{slug}.{format}

Examples:
- chapter-01-awakening.mp3
- chapter-02-breath-of-life.mp3
- chapter-03-waves-of-feeling.mp3
```

## Audio File Specifications

### Format Requirements
- **Codec**: MP3 (preferred) or AAC
- **Bitrate**: 192-320 kbps
- **Sample Rate**: 44.1 kHz
- **Channels**: Stereo (2.0) or Mono
- **Duration**: Match chapter duration in database

### File Size Guidelines
- Maximum: 50MB per file
- Typical: 10-30MB per chapter

## Database Integration

After uploading, update the chapter record:

```sql
UPDATE chapters 
SET audio_url = 'https://<account-id>.r2.cloudflarestorage.com/canticle-audio/chapter-01-awakening.mp3'
WHERE id = 1;
```

## Public URL Format

R2 public URLs follow this pattern:

```
https://<account-id>.r2.cloudflarestorage.com/<bucket>/<object-key>

Example:
https://abc123.r2.cloudflarestorage.com/canticle-audio/chapter-01-awakening.mp3
```

## Signed URLs (Optional)

For private audio with temporary access:

```typescript
// Generate signed URL valid for 1 hour
const signedUrl = await env.R2_AUDIO.get(objectKey).signedUrl({
  expiration: new Date(Date.now() + 3600000),
});
```

## CDN Integration

For optimal delivery, configure a Custom Domain:

1. In Cloudflare Dashboard: R2 > canticle-audio
2. Click "Connect Domain"
3. Enter: `audio.somaticcanticles.app`
4. Enable Cloudflare proxy (orange cloud)

Audio URLs then become:
```
https://audio.somaticcanticles.app/chapter-01-awakening.mp3
```

## Maintenance

### List all audio files
```bash
wrangler r2 object list canticle-audio
```

### Delete an audio file
```bash
wrangler r2 object delete canticle-audio/chapter-01-awakening.mp3
```

### Get file info
```bash
wrangler r2 object get canticle-audio/chapter-01-awakening.mp3 --pipe > /dev/null
```

## Troubleshooting

### CORS Errors
- Verify CORS configuration is applied
- Check request headers include `Origin`
- Ensure bucket is publicly readable

### Upload Failures
- Check file size (max 5GB for single upload)
- Verify R2 permissions
- Check content-type header

### Playback Issues
- Verify audio encoding (MP3/AAC)
- Check CORS headers in browser DevTools
- Test direct URL access

## Security Considerations

1. **Public Read**: Audio files are publicly readable
2. **Signed URLs**: Use for premium/temporary content
3. **Hotlink Protection**: Configure via Cloudflare Rules
4. **Rate Limiting**: Implement on API endpoints that generate URLs
