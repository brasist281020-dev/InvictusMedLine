import http.server
import os
import sys

class CleanURLHandler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        p = super().translate_path(path)
        # If the resolved file doesn't exist and has no extension, try .html
        if not os.path.exists(p):
            if not os.path.splitext(p)[1]:
                html_candidate = p + '.html'
                if os.path.exists(html_candidate):
                    return html_candidate
        return p

    def log_message(self, fmt, *args):
        # Simple clean log
        sys.stdout.write(f"  [{self.address_string()}] {args[0]}\n")
        sys.stdout.flush()

os.chdir(r'd:\Desktop\AGInvictus')
PORT = 5500

print("")
print("  ====================================================")
print("  InvictusMedLine — Local Dev Server")
print(f"  URL: http://localhost:{PORT}")
print("  Clean URLs: ON  (home -> home.html)")
print("  Зупинити: Ctrl+C")
print("  ====================================================")
print("")

with http.server.HTTPServer(('', PORT), CleanURLHandler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n  Server stopped.")
