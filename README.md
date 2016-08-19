[![Build Status](https://travis-ci.org/gemini-testing/gemini-imageoptim.svg?branch=master)](https://travis-ci.org/gemini-testing/gemini-imageoptim)

# gemini-imageoptim

Plugin optimize reference images at the time of their updates via `gemini update`.
It uses optipg and optimize only those images that have changed.

## Installation

`npm i gemini-imageoptim`

## Configuration

Set the configuration to your `.gemini.yml`

```yml
system:
  plugins:
    gemini-imageoptim:
      level: 2
```

## Options

- `level` - optimization level from 0 to 7
  2 - default speed
  5 - slow
  7 - very slow
