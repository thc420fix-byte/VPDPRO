# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

VPDPRO is intended to be a smartphone-friendly web app that calculates VPD (Vapor Pressure Deficit) from temperature, humidity, and CO2 inputs. See `README.md` (Japanese).

## Current state

The repository currently contains only `README.md` and has a single `Initial commit`. There is no application code, build configuration, package manager manifest, test suite, or tooling in place yet.

Implications for future work:
- There are no build, lint, test, or run commands to document yet — establish them when the first tooling is added (e.g. `package.json`, `pyproject.toml`) and update this file at that time.
- There is no architecture to summarize. When introducing the first modules, prefer a small, mobile-first single-page layout that keeps the VPD calculation logic isolated from the UI so it can be unit-tested directly.
- The README is in Japanese; keep user-facing copy in Japanese unless the user requests otherwise.

## Conventions

- Development branch for documentation work: `claude/add-claude-documentation-XVDQl`. Other feature work should follow whatever branch the user specifies; do not push to `main` without explicit instruction.
