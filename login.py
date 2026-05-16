import tkinter as tk
from tkinter import messagebox, font
import psycopg2
from PIL import Image, ImageTk

# PostgreSQL connection setup
def connect_db():
    try:
        return psycopg2.connect(
            host="localhost",
            user="postgres",
            password="nandini",
            database="user_auth"
        )
    except Exception as e:
        messagebox.showerror("Database Connection Error", f"Error: {e}")
        return None

# Function to handle signup
def signup():
    name = signup_name_entry.get()
    email = signup_email_entry.get()
    password = signup_password_entry.get()

    if name == "Name" or email == "Email" or password == "Password" or not name or not email or not password:
        messagebox.showerror("Error", "Please fill in all fields.")
        return

    conn = connect_db()
    if not conn:
        return

    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    if cursor.fetchone():
        messagebox.showerror("Error", "Email already registered.")
        conn.close()
        return

    cursor.execute("INSERT INTO users (name, email, password) VALUES (%s, %s, %s)", (name, email, password))
    conn.commit()

    messagebox.showinfo("Success", "Account created successfully! Please sign in.")

    cursor.close()
    conn.close()

    # Switch to login screen automatically
    show_login()

# Function to check login credentials
def login():
    email = login_email_entry.get()
    password = login_password_entry.get()

    if email == "Email" or password == "Password" or not email or not password:
        messagebox.showerror("Error", "Please fill in all fields.")
        return

    conn = connect_db()
    if not conn:
        return
    
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM users WHERE email=%s AND password=%s", (email, password))
    result = cursor.fetchone()

    if result:
        messagebox.showinfo("Login Successful", f"Welcome {result[0]}!")
    else:
        messagebox.showerror("Error", "Invalid Email or Password")

    cursor.close()
    conn.close()

# Function to switch between login and signup
def show_login():
    signup_frame.pack_forget()
    login_frame.pack(fill="both", expand=True)
    clear_entries()
    root.title("User Authentication - Login")

def show_signup():
    login_frame.pack_forget()
    signup_frame.pack(fill="both", expand=True)
    clear_entries()
    root.title("User Authentication - Create Account")

# Clear fields when switching screens
def clear_entries():
    signup_name_entry.delete(0, tk.END)
    signup_name_entry.insert(0, "Name")
    signup_name_entry.config(fg='gray')
    
    signup_email_entry.delete(0, tk.END)
    signup_email_entry.insert(0, "Email")
    signup_email_entry.config(fg='gray')
    
    signup_password_entry.delete(0, tk.END)
    signup_password_entry.insert(0, "Password")
    signup_password_entry.config(fg='gray', show="")
    
    login_email_entry.delete(0, tk.END)
    login_email_entry.insert(0, "Email")
    login_email_entry.config(fg='gray')
    
    login_password_entry.delete(0, tk.END)
    login_password_entry.insert(0, "Password")
    login_password_entry.config(fg='gray', show="")

# Create entry with placeholder
def create_entry_with_placeholder(parent, placeholder, show=None):
    entry = tk.Entry(parent, width=30, font=("Helvetica", 11), bd=1, relief=tk.SOLID, bg="#f5f5f5")
    if show:
        entry.config(show="")
    
    entry.insert(0, placeholder)
    entry.config(fg='gray')
    
    def on_focus_in(event):
        if entry.get() == placeholder:
            entry.delete(0, tk.END)
            entry.config(fg='black')
            if show:
                entry.config(show=show)
    
    def on_focus_out(event):
        if entry.get() == "":
            entry.insert(0, placeholder)
            entry.config(fg='gray')
            if show:
                entry.config(show="")
    
    entry.bind("<FocusIn>", on_focus_in)
    entry.bind("<FocusOut>", on_focus_out)
    
    return entry

# Create rounded button
def create_rounded_button(parent, text, command, bg_color, fg_color, active_bg, width=None):
    button = tk.Button(
        parent, 
        text=text, 
        font=("Helvetica", 10, "bold"), 
        bg=bg_color, 
        fg=fg_color,
        activebackground=active_bg,
        activeforeground=fg_color,
        relief=tk.FLAT,
        borderwidth=0,
        padx=15,
        pady=8,
        cursor="hand2",
        command=command
    )
    if width:
        button.config(width=width)
    return button

# Main GUI setup
root = tk.Tk()
root.title("User Authentication")
root.geometry("850x550")
root.resizable(False, False)
root.configure(bg="white")

# --- Login Frame ---
login_frame = tk.Frame(root, bg="white")

# Left panel (purple)
login_left_panel = tk.Frame(login_frame, bg="#5D54A4", width=350)
login_left_panel.pack(side=tk.LEFT, fill="both")
login_left_panel.pack_propagate(False)

# Welcome text on left panel
tk.Label(
    login_left_panel, 
    text="Welcome Back!", 
    font=("Helvetica", 24, "bold"), 
    bg="#5D54A4", 
    fg="white"
).pack(pady=(180, 10))

tk.Label(
    login_left_panel, 
    text="Enter your personal details to use all site features", 
    font=("Helvetica", 10), 
    bg="#5D54A4", 
    fg="white",
    wraplength=250
).pack(pady=10)

# Sign In button on left panel
create_rounded_button(
    login_left_panel,
    "SIGN IN",
    show_login,
    "#FFFFFF",
    "#5D54A4",
    "#E6E6E6",
    width=15
).pack(pady=30)

# Right panel (white with form)
login_right_panel = tk.Frame(login_frame, bg="white", padx=50)
login_right_panel.pack(side=tk.RIGHT, fill="both", expand=True)

# Form title
tk.Label(
    login_right_panel, 
    text="Sign In", 
    font=("Helvetica", 24, "bold"), 
    bg="white", 
    fg="#333333"
).pack(anchor="w", pady=(100, 30))

# Google sign-in button
google_frame = tk.Frame(login_right_panel, bg="white")
google_frame.pack(anchor="w", pady=(0, 20))

tk.Label(
    google_frame,
    text="G+",
    font=("Helvetica", 12, "bold"),
    bg="white",
    fg="#5D54A4",
    padx=10,
    pady=5,
    relief=tk.SOLID,
    bd=1
).pack()

# Or use college email
tk.Label(
    login_right_panel, 
    text="or use your College email password", 
    font=("Helvetica", 10), 
    bg="white", 
    fg="#666666"
).pack(anchor="w", pady=(0, 20))

# Email field
login_email_entry = create_entry_with_placeholder(login_right_panel, "Email")
login_email_entry.pack(fill="x", ipady=8, pady=(0, 15))

# Password field
login_password_entry = create_entry_with_placeholder(login_right_panel, "Password", show="*")
login_password_entry.pack(fill="x", ipady=8, pady=(0, 10))

# Forgot password
tk.Button(
    login_right_panel, 
    text="Forget Your Password?", 
    fg="#5D54A4", 
    bg="white", 
    font=("Helvetica", 9), 
    bd=0, 
    cursor="hand2", 
    activebackground="white", 
    activeforeground="#4A4184"
).pack(anchor="w", pady=(0, 30))

# Sign in button
create_rounded_button(
    login_right_panel,
    "SIGN IN",
    login,
    "#5D54A4",
    "white",
    "#4A4184",
    width=20
).pack(pady=10)

# --- Signup Frame ---
signup_frame = tk.Frame(root, bg="white")

# Left panel (purple)
signup_left_panel = tk.Frame(signup_frame, bg="#5D54A4", width=350)
signup_left_panel.pack(side=tk.LEFT, fill="both")
signup_left_panel.pack_propagate(False)

# Welcome text on left panel
tk.Label(
    signup_left_panel, 
    text="Hello, Vitians!", 
    font=("Helvetica", 24, "bold"), 
    bg="#5D54A4", 
    fg="white"
).pack(pady=(180, 10))

tk.Label(
    signup_left_panel, 
    text="Register with your personal details to use all site features", 
    font=("Helvetica", 10), 
    bg="#5D54A4", 
    fg="white",
    wraplength=250
).pack(pady=10)

# Sign Up button on left panel
create_rounded_button(
    signup_left_panel,
    "SIGN UP",
    show_signup,
    "#FFFFFF",
    "#5D54A4",
    "#E6E6E6",
    width=15
).pack(pady=30)

# Right panel (white with form)
signup_right_panel = tk.Frame(signup_frame, bg="white", padx=50)
signup_right_panel.pack(side=tk.RIGHT, fill="both", expand=True)

# Form title
tk.Label(
    signup_right_panel, 
    text="Create Account", 
    font=("Helvetica", 24, "bold"), 
    bg="white", 
    fg="#333333"
).pack(anchor="w", pady=(100, 30))

# Google sign-up button
google_signup_frame = tk.Frame(signup_right_panel, bg="white")
google_signup_frame.pack(anchor="w", pady=(0, 20))

tk.Label(
    google_signup_frame,
    text="G+",
    font=("Helvetica", 12, "bold"),
    bg="white",
    fg="#5D54A4",
    padx=10,
    pady=5,
    relief=tk.SOLID,
    bd=1
).pack()

# Or use college email
tk.Label(
    signup_right_panel, 
    text="or use your College email for registration", 
    font=("Helvetica", 10), 
    bg="white", 
    fg="#666666"
).pack(anchor="w", pady=(0, 20))

# Name field
signup_name_entry = create_entry_with_placeholder(signup_right_panel, "Name")
signup_name_entry.pack(fill="x", ipady=8, pady=(0, 15))

# Email field
signup_email_entry = create_entry_with_placeholder(signup_right_panel, "Email")
signup_email_entry.pack(fill="x", ipady=8, pady=(0, 15))

# Password field
signup_password_entry = create_entry_with_placeholder(signup_right_panel, "Password", show="*")
signup_password_entry.pack(fill="x", ipady=8, pady=(0, 25))

# Sign up button
create_rounded_button(
    signup_right_panel,
    "SIGN UP",
    signup,
    "#5D54A4",
    "white",
    "#4A4184",
    width=20
).pack(pady=10)

# Initially show signup screen first
show_signup()

# Center the window on screen
root.update_idletasks()
width = root.winfo_width()
height = root.winfo_height()
x = (root.winfo_screenwidth() // 2) - (width // 2)
y = (root.winfo_screenheight() // 2) - (height // 2)
root.geometry('{}x{}+{}+{}'.format(width, height, x, y))

root.mainloop()