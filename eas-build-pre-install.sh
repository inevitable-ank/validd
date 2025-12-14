#!/usr/bin/env bash
# Don't exit on error - we want to see all debug output
set +e

echo "🔍 Starting google-services.json setup..."
echo "Current directory: $(pwd)"

# EAS file environment variables are available as file paths
# The variable name matches what you set (GOOGLE_SERVICES_JSON)
GOOGLE_SERVICES_FILE=""

# Debug: Print all environment variables
echo "📋 All environment variables:"
env | sort

# Debug: Print all environment variables containing GOOGLE
echo ""
echo "📋 Environment variables containing 'GOOGLE':"
env | grep -i "GOOGLE" || echo "  (none found)"

# Check multiple possible variable names
for VAR_NAME in "GOOGLE_SERVICES_JSON" "EAS_SECRET_GOOGLE_SERVICES_JSON" "GOOGLE_SERVICES_FILE"; do
  if [ -n "${!VAR_NAME:-}" ]; then
    echo "✓ Found $VAR_NAME: ${!VAR_NAME}"
    if [ -f "${!VAR_NAME}" ]; then
      GOOGLE_SERVICES_FILE="${!VAR_NAME}"
      echo "✓ File exists at: $GOOGLE_SERVICES_FILE"
      break
    else
      echo "⚠ File does not exist at: ${!VAR_NAME}"
    fi
  fi
done

# Check if it's set as an environment variable pointing to a file
if [ -z "$GOOGLE_SERVICES_FILE" ] && [ -n "${GOOGLE_SERVICES_JSON:-}" ]; then
  echo "✓ Found GOOGLE_SERVICES_JSON environment variable: $GOOGLE_SERVICES_JSON"
  if [ -f "$GOOGLE_SERVICES_JSON" ]; then
    GOOGLE_SERVICES_FILE="$GOOGLE_SERVICES_JSON"
    echo "✓ File exists at: $GOOGLE_SERVICES_FILE"
  else
    echo "⚠ File does not exist at: $GOOGLE_SERVICES_JSON"
  fi
fi

# If we found the file, copy it
if [ -n "$GOOGLE_SERVICES_FILE" ] && [ -f "$GOOGLE_SERVICES_FILE" ]; then
  # Create android/app directory if it doesn't exist
  mkdir -p ./android/app
  echo "📁 Created/verified android/app directory"
  
  # Copy the file to the location expected by app.json
  cp "$GOOGLE_SERVICES_FILE" ./android/app/google-services.json
  echo "✓ Successfully copied google-services.json to ./android/app/google-services.json"
  ls -la ./android/app/google-services.json
  
  # Verify the file was copied correctly
  if [ -f "./android/app/google-services.json" ]; then
    echo "✅ Verification: google-services.json is in the correct location"
    exit 0
  else
    echo "❌ Error: File copy failed"
    exit 1
  fi
else
  echo "❌ Error: Could not find google-services.json in EAS environment variables"
  echo ""
  echo "Debug info:"
  echo "  GOOGLE_SERVICES_JSON=${GOOGLE_SERVICES_JSON:-not set}"
  echo "  EAS_BUILD_PLATFORM=${EAS_BUILD_PLATFORM:-not set}"
  echo "  EAS_BUILD_PROFILE=${EAS_BUILD_PROFILE:-not set}"
  echo "  Current working directory: $(pwd)"
  echo "  Files in current directory:"
  ls -la | head -20 || true
  echo ""
  echo "All environment variables (first 100):"
  env | sort | head -100
  echo ""
  echo "⚠️  WARNING: Script will continue but file may be missing"
  # Don't exit with error - let the build continue to see what happens
  # The Firebase plugin will give a clearer error if the file is truly missing
fi


