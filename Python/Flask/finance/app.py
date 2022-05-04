import os

from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.security import check_password_hash, generate_password_hash

from helpers import apology, login_required, lookup, usd

# Configure application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Custom filter
app.jinja_env.filters["usd"] = usd

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///finance.db")

db.execute("CREATE TABLE IF NOT EXISTS transactions (\
    id INTEGER PRIMARY KEY AUTOINCREMENT, \
    user_id INTEGER NOT NULL, \
    symbol TEXT NOT NULL, \
    shares INTEGER NOT NULL, \
    price INTEGER NOT NULL, \
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, \
    FOREIGN KEY(user_id) REFERENCES users(id))")

# Make sure API key is set
if not os.environ.get("API_KEY"):
    raise RuntimeError("API_KEY not set")


@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/")
@login_required
def index():
    """Show portfolio of stocks"""

    user_id = session["user_id"]
    stocks = db.execute("SELECT symbol, SUM(shares) as total_shares FROM transactions \
    WHERE user_id = ? GROUP BY symbol HAVING SUM(shares) > 0", user_id)
    cash = db.execute("SELECT cash FROM users WHERE id = ?", user_id)[0]["cash"]

    total = cash
    for stock in stocks:
        quote = lookup(stock["symbol"])
        stock["name"] = quote["name"]
        stock["price"] = usd(quote["price"])
        stock["total"] = usd(stock["total_shares"] * quote["price"])
        total += stock["total_shares"] * quote["price"]

    return render_template("index.html", stocks=stocks, cash=usd(cash), total=usd(total))


@app.route("/buy", methods=["GET", "POST"])
@login_required
def buy():
    """Buy shares of stock"""

    if request.method == "GET":
        return render_template("buy.html")

    # Check for valid input

    symbol = request.form.get("symbol").upper()
    quote = lookup(symbol)
    if (not symbol) or (quote is None):
        return apology("That stock symbol does not exist")

    try:
        shares = int(request.form.get("shares"))
    except:
        return apology("The number of shares must be an integer")
    if shares <= 0:
        return apology("You can only buy a positive amount of shares")

    # Check if user can afford stock
    user_id = session["user_id"]
    price = quote["price"]
    cost = price * shares
    cash = db.execute("SELECT cash FROM users WHERE id = ?", user_id)[0]["cash"]
    if (cash - shares * price) < 0:
        return apology("You cannot afford that amount of shares")

    # Take money out of user's cash
    db.execute("UPDATE users SET cash = ? WHERE id = ?", cash - cost, user_id)

    # Store in transactions db
    db.execute("INSERT INTO transactions (user_id, symbol, shares, price) VALUES (?, ?, ?, ?)", user_id, symbol, shares, price)

    return redirect("/")


@app.route("/history")
@login_required
def history():
    """Show history of transactions"""

    user_id = session["user_id"]
    stocks = db.execute("SELECT symbol, shares, price, timestamp FROM transactions WHERE user_id = ?", user_id)

    for stock in stocks:
        quote = lookup(stock["symbol"])
        stock["name"] = quote["name"]
        stock["price"] = usd(stock["price"])

    return render_template("history.html", stocks=stocks)


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":

        # Ensure username was submitted
        if not request.form.get("username"):
            return apology("must provide username", 403)

        # Ensure password was submitted
        elif not request.form.get("password"):
            return apology("must provide password", 403)

        # Query database for username
        rows = db.execute("SELECT * FROM users WHERE username = ?", request.form.get("username"))

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(rows[0]["hash"], request.form.get("password")):
            return apology("invalid username and/or password", 403)

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]

        # Redirect user to home page
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")


@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")


@app.route("/quote", methods=["GET", "POST"])
@login_required
def quote():
    """Get stock quote."""

    if request.method == "GET":
        return render_template("quote.html")

    # Lookup stock symbol
    symbol = request.form.get("symbol")
    quote = lookup(symbol)

    # If lookup is unsucessful, return apology
    if quote is None:
        return apology("That stock symbol does not exist")

    # If lookup is successful, display results
    return render_template("quoted.html", name=quote["name"], price=usd(quote["price"]), symbol=quote["symbol"])


@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""

    if request.method == "GET":
        return render_template("register.html")

    # Get form data
    username = request.form.get("username")
    password = request.form.get("password")
    confirmation = request.form.get("confirmation")

    # Check for possible errors
    if not username:
        return apology("Username must not be blank")
    if not password:
        return apology("Password must not be blank")
    if password != confirmation:
        return apology("Password and confirmation must match")

    #  Insert the new user into users table
    hash = generate_password_hash(password)
    try:
        user_id = db.execute("INSERT INTO users (username, hash) VALUES (?, ?)", username, hash)
    except:
        return apology("Username already exists")

    # Log user in
    session["user_id"] = user_id

    return redirect("/")


@app.route("/sell", methods=["GET", "POST"])
@login_required
def sell():
    """Sell shares of stock"""

    user_id = session["user_id"]
    rows = db.execute("SELECT symbol FROM transactions WHERE user_id = ? GROUP BY symbol HAVING SUM (shares) > 0", user_id)
    symbols = []
    for row in rows:
        symbols.append(row["symbol"])

    if request.method == "GET":
        return render_template("sell.html", symbols=symbols)

    elif request.method == "POST":
        # Symbol validation
        symbol = request.form.get("symbol")
        if not symbol:
            return apology("You must select a stock to be able to sell")
        if symbol not in symbols:
            return apology("You can only sell stocks that you own")

        # Shares validation
        try:
            shares = int(request.form.get("shares"))
        except:
            return apology("The number of shares must be an integer")
        if shares <= 0:
            return apology("You can only buy a positive amount of shares")
        owned_shares = db.execute("SELECT SUM(shares) as amount FROM transactions \
        WHERE user_id = ? AND symbol = ? GROUP BY symbol", user_id, symbol)[0]["amount"]
        if shares > owned_shares:
            return apology("You don't have that many shares to sell")

        # Tranfer money into user's cash
        quote = lookup(symbol)
        price = quote["price"]
        cash = db.execute("SELECT cash FROM users WHERE id = ?", user_id)[0]["cash"]
        db.execute("UPDATE users SET cash = ? WHERE id = ?", cash + price * shares, user_id)

        # Store in transactions db
        db.execute("INSERT INTO transactions (user_id, symbol, shares, price) VALUES (?, ?, ?, ?)", user_id, symbol, shares * -1, price)

        return redirect("/")