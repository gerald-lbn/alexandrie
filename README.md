# Adonisjs-auth

A playground to experiment with [AdonisJS] framework, authentication and [dependency injection](https://docs.adonisjs.com/guides/concepts/dependency-injection). This is not meant to be use in production.

## What's included

- Registration
- Login
- Account verification

## Left to be done

- [ ] Send the OTP code via email
- [ ] Mark the user as verified
- [ ] Use the `valudUntil` when verify the OTP
- [ ] Test repositories
- [ ] Add 2FA with QRCode

## Usage

- Clone the repo
- Install dependencies with `npm install`
- Copy `.env.example` in `.env`
- Run the development server with `npm run dev`

Routes:
- /
- /login
- /register
- /verify-account

## Tests

Before running any test, make sure you have container with a database up and running.
You can use docker with the following command: `docker compose up`.

To run both unit and functional test use the following command: `node ace test`.

### Unit tests

These tests are stores in [tests/unit](./tests/unit)

### Functional tests

These tests are stores in [tests/functional](./tests/functional)


## Deployment

The application can be containerized in a docker container using [Dockerfile](./Dockerfile)
