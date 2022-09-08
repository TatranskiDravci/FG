from flask import Flask, render_template, request, redirect
from subprocess import call
from flask_cors import cross_origin

app = Flask(__name__)

# open DBs
form_DB = open("db/mail_log.feed", "a", 1)
click_DB = open("db/click.count", "r+", 1)


# render index
@app.route("/")
def index():
    return render_template("index.html")

# tick click counter
@app.route("/click")
@cross_origin(origin="*")
def click():
    print("clicked")
    # call("tick db/click.count", shell=True)
    return ('', 200)

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
    # print(mail, cb_FG, cb_PS, file=form_DB)
    return redirect("/")