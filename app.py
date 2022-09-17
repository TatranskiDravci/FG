from flask import Flask, render_template, request, redirect
from subprocess import call

app = Flask(__name__)

# open DBs
form_DB = open("db/mail_log.feed", "a", 1)
click_DB = open("db/click.count", "r+", 1)
name_DB = {
    "1": "db/name1.count",
    "2": "db/name2.count",
    "3": "db/name3.count"
}


# render index
@app.route("/")
def index():
    return render_template("index.html")

# tick click counter
@app.route("/click")
def click():
    print("clicked")

    # db logger
    call("./tick db/click.count", shell=True)
    return ('', 200)

@app.route("/poll")
def poll():
    num = request.args.get("num")
    call("./tick " + name_DB[num], shell=True)
    return redirect("/")

# save form into DB
@app.route("/form", methods=["POST"])
def form():
    mail = request.form.get("mail")
    cb_FG = request.form.get("checkbox_fgsvk")
    cb_PS = request.form.get("checkbox_porshe")

    if cb_FG == "on":
        cb_FG = 1
    else:
        cb_FG = 0

    if cb_PS == "on":
        cb_PS = 1
    else:
        cb_PS = 0

    # db logger
    print(mail, cb_FG, cb_PS, file=form_DB)
    return redirect("/")
