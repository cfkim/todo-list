import sqlite3

# --- SQL SETUP ---

# Connect to your SQLite database
conn = sqlite3.connect('todo.db')
cursor = conn.cursor()

# Define the user data you want to insert
new_user = (1, "me", "password")  # Replace with the actual username and password

# Execute an INSERT query to add the new user
insert_query = "INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)"
cursor.execute(insert_query, new_user)
conn.close()

# Connect to the SQLite database
conn = sqlite3.connect('todo.db')  # Replace with your actual database filename

# Create a cursor
cursor = conn.cursor()

# Execute a SELECT query to retrieve all records from the "users" table
select_query = "SELECT * FROM users"
cursor.execute(select_query)

# Fetch all the rows from the result set
rows = cursor.fetchall()
# Print the rows (or process them as needed)
for row in rows:
    print(row)

# Close the database connection
conn.close()