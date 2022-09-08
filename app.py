from flask import Flask, render_template, request, redirect

app = Flask(__name__)


form_DB = open("db/mail_log.feed", "a", 1)
click_DB = open("db/click.count", "w")



@app.route("/")
def index():
    return render_template("index.html")

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

    # print(mail, cb_FG, cb_PS, file=form_DB)
    return redirect("/")