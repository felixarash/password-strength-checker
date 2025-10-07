from flask import Flask, render_template, request, jsonify

app = Flask(__name__)


def rate_password(pw: str):
    length_ok = len(pw) >= 8
    has_upper = any(c.isupper() for c in pw)
    has_lower = any(c.islower() for c in pw)
    has_digit = any(c.isdigit() for c in pw)
    has_special = any(not c.isalnum() for c in pw)

    categories = 0
    if has_upper and has_lower:
        categories += 1
    if has_digit:
        categories += 1
    if has_special:
        categories += 1

    if not length_ok or categories == 0:
        return "Weak \ud83d\ude1e", "red"
    elif categories in (1, 2):
        return "Moderate \ud83d\ude10", "orange"
    else:  # categories == 3 and length_ok
        return "Strong \ud83d\udcaa", "green"


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/check", methods=["POST"])
def check():
    data = request.get_json(silent=True) or {}
    pw = data.get("password", "")
    rating, color = rate_password(pw)
    return jsonify({"rating": rating, "color": color})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)