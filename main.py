from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/pools")
def get_pools():
    # This is a placeholder. In a real application, you would fetch this data from the blockchain or a backend service.
    pools = [
        {"id": 1, "name": "ETH/DAI", "tokens": ["ETH", "DAI"], "weights": [50, 50], "fee": 0.3},
        {"id": 2, "name": "WBTC/USDC", "tokens": ["WBTC", "USDC"], "weights": [80, 20], "fee": 0.2},
        {"id": 3, "name": "ETH/USDC/DAI", "tokens": ["ETH", "USDC", "DAI"], "weights": [40, 30, 30], "fee": 0.4},
    ]
    return {"pools": pools}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
