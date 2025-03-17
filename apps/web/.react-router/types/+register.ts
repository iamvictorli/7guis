import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
  "/temperature-converter": {};
  "/circle-drawer": {};
  "/flight-booker": {};
  "/counter": {};
  "/cells": {};
  "/timer": {};
  "/crud": {};
};