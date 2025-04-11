#!/bin/bash

# Auto push script for CineSuggest project

echo "🚀 Pushing changes to GitHub..."

# Add all changes
git add .

# Get current date time for commit message
DATETIME=$(date +"%Y-%m-%d %H:%M:%S")

# Commit with timestamp
git commit -m "Update CineSuggest - $DATETIME"

# Push to GitHub
git push -u origin main

echo "✅ Changes pushed to GitHub successfully!"
echo "🌐 Check your repository at: https://github.com/yashwanthk8/CineSuggest" 