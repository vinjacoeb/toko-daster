import sqlite3
conn = sqlite3.connect(r'C:\Users\LENOVO\AppData\Local\hermes\kanban\boards\toko-daster\kanban.db')
for row in conn.execute('SELECT id, title, assignee, status FROM tasks'):
    print(row)
