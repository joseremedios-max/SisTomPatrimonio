import http.server
import socketserver
import webbrowser
import threading
import os
import sys
from urllib.parse import quote

PORT = 8080
# Passe --no-open para iniciar o servidor sem abrir o navegador
# automaticamente (útil em ambientes que já controlam a aba).
OPEN_BROWSER = "--no-open" not in sys.argv

# FROZEN: rodando como SIP-MA.exe (PyInstaller). Nesse caso os arquivos do
# protótipo ficam ao lado do .exe, e não dentro do bundle temporário.
FROZEN = getattr(sys, "frozen", False)
base_dir = os.path.dirname(os.path.abspath(sys.executable if FROZEN else __file__))
os.chdir(base_dir)


def pause_se_exe():
    """No .exe (duplo-clique) a janela fecharia antes de dar tempo de ler o erro."""
    if FROZEN:
        try:
            input("\nPressione Enter para fechar...")
        except EOFError:
            pass


def avisar_se_sem_internet():
    """O protótipo carrega React, Babel, Leaflet e as fontes via CDN."""
    import urllib.request

    try:
        urllib.request.urlopen(
            "https://unpkg.com/react@18.3.1/umd/react.development.js", timeout=6
        ).close()
    except Exception:
        print()
        print("[AVISO] Nao foi possivel acessar a CDN (unpkg.com).")
        print("        O protótipo carrega React, Babel, Leaflet e as fontes pela")
        print("        internet, portanto as telas podem nao abrir sem conexao.")
        print("        Conecte este computador a internet antes da apresentacao.")
        print()

# Abre o index.html (ou o primeiro HTML disponível, caso seja renomeado).
html_file = "index.html" if os.path.exists("index.html") else next(
    (f for f in os.listdir(base_dir) if f.endswith(".html")),
    None
)

if not html_file:
    print(f"Nenhum arquivo HTML encontrado em:\n  {base_dir}")
    print("Mantenha este arquivo na mesma pasta do index.html e dos demais arquivos.")
    pause_se_exe()
    sys.exit(1)

url = f"http://localhost:{PORT}/{quote(html_file)}"

def open_browser():
    webbrowser.open(url)

# Como os arquivos .jsx são transpilados no navegador (sem etapa de build),
# desativamos o cache para que qualquer edição apareça ao recarregar a página.
class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def send_head(self):
        # Remove validadores condicionais para nunca responder "304 Not
        # Modified" — assim toda edição em .jsx aparece ao recarregar.
        del self.headers["If-Modified-Since"]
        del self.headers["If-None-Match"]
        return super().send_head()

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

handler = NoCacheHandler

# Servidor multi-thread: atende vários arquivos .jsx em paralelo (como o
# `python -m http.server`). Um servidor single-thread serializaria as
# conexões e poderia travar o carregamento da página.
class ThreadingHTTPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True

avisar_se_sem_internet()

try:
    with ThreadingHTTPServer(("", PORT), handler) as httpd:
        print(f"Servidor em http://localhost:{PORT}")
        print(f"Abrindo: {url}")
        print("Feche esta janela (ou Ctrl+C) para parar o servidor.")
        if OPEN_BROWSER:
            threading.Timer(1.0, open_browser).start()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor encerrado.")
except OSError as erro:
    # Erro tipico: porta 8080 ja ocupada por outra instancia do servidor.
    print(f"\nNao foi possivel iniciar o servidor na porta {PORT}: {erro}")
    print("Verifique se o servidor ja nao esta rodando em outra janela.")
    pause_se_exe()
    sys.exit(1)
