from flask import Flask, render_template

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
app.config['TEMPLATES_AUTO_RELOAD'] = True

@app.route('/')
def index():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True, host='localhost')
    
