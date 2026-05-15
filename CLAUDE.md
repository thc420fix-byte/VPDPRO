# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

VPDPRO is a smartphone-compatible web app for calculating VPD (Vapor Pressure Deficit) from temperature, humidity, and CO2 inputs. See `README.md` (in Japanese) for the one-line product description.

## Current State

The repository is in its initial state — only `README.md` is committed. No source code, build configuration, package manifests, tests, or tooling exist yet. When implementing features, you (or a future Claude session) will be choosing the stack and project layout from scratch; record those decisions here once they are made so subsequent sessions have a reference.

Until a stack is chosen, there are no build, lint, or test commands to document.

## Domain Notes

VPD (Vapor Pressure Deficit) is typically computed from saturation vapor pressure and actual vapor pressure derived from temperature and relative humidity. CO2 is not part of the standard VPD formula, so confirm with the user how CO2 should factor into the UI/output (e.g., displayed alongside VPD, used for an enriched index, etc.) before designing the calculation layer.

The UI is intended to be mobile-first ("スマホ対応" = smartphone-compatible).
