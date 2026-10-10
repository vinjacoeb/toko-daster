import sqlite3, os
db_path = os.path.expanduser('~/.hermes/kanban.db')
conn = sqlite3.connect(db_path)
conn.row_factory = sqlite3.Row
print("Assignees:", [r["assignee"] for r in conn.execute("SELECT DISTINCT assignee FROM tasks").fetchall()])
print("Recent tasks:")
for r in conn.execute("SELECT id, title, assignee, status FROM tasks ORDER BY created_at DESC LIMIT 5").fetchall():
    print(dict(r))
conn.close()
