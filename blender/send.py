import json, socket, sys
code = open(sys.argv[1], encoding="utf-8").read()
s = socket.create_connection(("127.0.0.1", 9876), timeout=120)
s.sendall(json.dumps({"type": "execute_code", "params": {"code": code}}).encode())
buf = b""
while True:
    chunk = s.recv(65536)
    if not chunk:
        break
    buf += chunk
    try:
        json.loads(buf); break
    except ValueError:
        continue
print(buf.decode()[:2000])
