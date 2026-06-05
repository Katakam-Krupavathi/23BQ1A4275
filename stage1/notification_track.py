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
        r = requests.get("http://4.224.186.213/evaluation-service/notifications", timeout=4)
        if r.status_code == 200:
            res = r.json().get("notifications", [])
            if res:
                return res
    except:
        pass
    
    
    return [
        {"ID": "1", "Type": "Event", "Message": "Annual Campus Fest", "Timestamp": "2026-06-05 09:00:00"},
        {"ID": "2", "Type": "Placement", "Message": "Google Drive Phase 1", "Timestamp": "2026-06-05 08:30:00"},
        {"ID": "3", "Type": "Result", "Message": "B.Tech Semester Results", "Timestamp": "2026-06-05 09:15:00"},
        {"ID": "4", "Type": "Placement", "Message": "Amazon SDE Drive", "Timestamp": "2026-06-05 09:45:00"}
    ]

def main():
    cap = int(sys.argv[1]) if len(sys.argv) > 1 else 10
    feed = pull_feed()
    
    stream = sorted(feed, key=evaluate_node, reverse=True)[:cap]
    
    print("=" * 60)
    print(f"TOP {cap} ENTRIES")
    print("=" * 60)
    for rank, node in enumerate(stream, 1):
        print(f"{rank:02d}. [{node.get('Type'):<10}] {node.get('Message'):<30} | {node.get('Timestamp')}")
    print("=" * 60)

if __name__ == "__main__":
    main()