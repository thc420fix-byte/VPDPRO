#!/usr/bin/env python3
"""Tiny CORS proxy for LM Studio → VPD PRO"""
import json, sys
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.request import urlopen, Request as UReq
from urllib.error import URLError

LM_URL = "http://localhost:1234"
PROXY_PORT = 11234

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

class Proxy(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        pass  # silent

    def send_cors(self, code=200, content_type="application/json"):
        self.send_response(code)
        for k, v in CORS.items():
            self.send_header(k, v)
        self.send_header("Content-Type", content_type)
        self.end_headers()

    def do_OPTIONS(self):
        self.send_cors(204)

    def do_GET(self):
        try:
            req = UReq(LM_URL + self.path)
            with urlopen(req, timeout=10) as r:
                data = r.read()
            self.send_cors()
            self.wfile.write(data)
        except URLError as e:
            self.send_cors(502)
            self.wfile.write(json.dumps({"error": str(e)}).encode())

    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length)
        try:
            req = UReq(LM_URL + self.path, data=body,
                       headers={"Content-Type": "application/json"})
            with urlopen(req, timeout=120) as r:
                data = r.read()
            self.send_cors()
            self.wfile.write(data)
        except URLError as e:
            self.send_cors(502)
            self.wfile.write(json.dumps({"error": str(e)}).encode())

if __name__ == "__main__":
    server = HTTPServer(("localhost", PROXY_PORT), Proxy)
    print(f"✦ VPD PRO CORS proxy → http://localhost:{PROXY_PORT}")
    print(f"  forwarding to LM Studio at {LM_URL}")
    print(f"  Set VPD PRO AI URL to: http://localhost:{PROXY_PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nProxy stopped.")
