<?php

/**
 * The current timezone passed by a browser cookie
 *
 * @param string $default The default timezone if not found
 *
 * @return string
 */
function browser_timezone($default = 'America/Chicago') {
  try {
    $timezone = new \DateTimeZone(@$_COOKIE['timezone']);

    return $timezone->getName();
  } catch (\Exception $e) {
    return $default;
  }
}

/**
 * Returns the name of the container the app is running in.
 * Read from the CONTAINER_NAME or DEIS_APP environment variables.
 *
 * @return string The name of the container. default: laravel
 */
function container_name() {
  if (!empty(getenv('CONTAINER_NAME'))) {
    return getenv('CONTAINER_NAME');
  }
  if (!empty(getenv('DEIS_APP'))) {
    return getenv('DEIS_APP');
  }

  return 'laravel';
}

/**
 * Returns the type of container the app is running in.
 * Read from the CONTAINER_TYPE or DEIS_RELEASE environment variables.
 *
 * @return string The type of container. default: unknown
 */
function container_type() {
  if (!empty(getenv('CONTAINER_TYPE'))) {
    return getenv('CONTAINER_TYPE');
  }
  if (!empty(getenv('DEIS_RELEASE'))) {
    return 'deis';
  }

  return 'unknown';
}

/**
 * Returns the version of the container.
 * Read from the CONTAINER_VERSION or DEIS_RELEASE environment variables.
 *
 * @return string The container version. default: unknown
 */
function container_version() {
  if (!empty(getenv('CONTAINER_VERSION'))) {
    return getenv('CONTAINER_VERSION');
  }
  if (!empty('DEIS_RELEASE')) {
    return getenv('DEIS_RELEASE');
  }

  return 'unknown';
}

/**
 * Returns the git sha of the code used to build the container.
 * Read from the GIT_SHA environment variable.
 *
 * @return string
 */
function git_sha() {
  if (!empty(getenv('GIT_SHA'))) {
    return getenv('GIT_SHA');
  }

  return 'unknown';
}