[![Build Status](https://travis-ci.org/gemini-testing/gemini-optipng.svg?branch=master)](https://travis-ci.org/gemini-testing/gemini-optipng)

# gemini-optipng

Plugin optimizes reference images at the time of their update via `gemini update` command.
It uses [optipng](https://github.com/imagemin/optipng-bin) and optimizes the image only if it has been changed.

## Installation

```
$ npm install gemini-optipng
```

## Configuration

* __level__ (optional) Optimization level from 0 to 7. Defaults to 2. Description of optimization levels in the [manual](http://optipng.sourceforge.net/optipng-0.7.6.man.pdf).

Set the configuration to your `.gemini.yml`:

```yml
system:
  plugins:
    gemini-optipng:
      level: 7
```

If you want set default level optimization use this config:

```yml
system:
  plugins:
    gemini-optipng: true
```

## Debug mode

To turn on debug mode set `DEBUG=gemini:optipng` enviroment variable:

```bash
$ DEBUG=gemini:optipng ./node_modules/.bin/gemini update
```

Console output:

```bash
✓ path/to/suite stateName [browserId]
gemini:optipng path/to/reference/image.png compressed by 30%
```
