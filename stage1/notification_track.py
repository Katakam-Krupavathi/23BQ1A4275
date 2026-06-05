import sys
import requests
from datetime import datetime

def evaluate_node(x):
    scale = {"Placement": 3, "Result": 2, "Event": 1}
    score = scale.get(x.get("Type", ""), 0)
    try:
        epoch = int(datetime.strptime(x.get("Timestamp", "1970-01-01 00:00:00"), "%Y-%m-%d %H:%M:%S").timestamp())
    except:
        epoch = 0
    return (score, epoch)

def pull_feed():
    try:
        r = requests.get("http://4.224.186.213/evaluation-service/notifications", timeout=5)
        if r.status_code == 200:
            return r.json().get("notifications", [])
    except Exception as e:
        print(f"Network Connection Error: {e}")
    return []

def main():
    cap = int(sys.argv[1]) if len(sys.argv) > 1 else 10
    feed = pull_feed()
    
    if not feed:
        print(" The server API is currently running but contains 0 live notifications.")
        return
    
    stream = sorted(feed, key=evaluate_node, reverse=True)[:cap]
    
    print("=" * 60)
    print(f" STREAM DISPLAY: TOP {len(stream)} LIVE ENTRIES")
    print("=" * 60)
    for rank, node in enumerate(stream, 1):
        print(f"{rank:02d}. [{node.get('Type'):<10}] {node.get('Message'):<30} | {node.get('Timestamp')}")
    print("=" * 60)

if __name__ == "__main__":
    main()