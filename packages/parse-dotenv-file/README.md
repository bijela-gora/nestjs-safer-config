# Dumb simple function to parse .env file

Dumb simple function to parse .env file.

This package expose two functions:

- `tryParseDotenvFile` - throw an error if .env file missed
- `parseDotenvFile` - returns empty object if .env missed

Both functions have first optional parameter relative or absolute path to `.env` file. Read tests for more info.
