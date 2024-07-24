from flask import Flask, render_template
from pymongo import MongoClient
from gpt import sendMsg

app = Flask(__name__)

# Connect to MongoDB
client = MongoClient('mongodb+srv://priyam356:Tomar9999@cluster0.cawjk02.mongodb.net/')
db = client['MeetingRecords']
collection = db['Transcripts']

@app.route('/')
def index():
    # Retrieve data from MongoDB
    data = list(collection.find())
    for item in data:
        if 'text' in item:
            if 'fresh' not in item:
                fresh_text = sendMsg(f'{item["text"]} can you summarise this')
                collection.update_one({'_id': item['_id']}, {'$set': {'fresh': fresh_text}})
                item['fresh'] = fresh_text
            
        else:
            item['fresh'] = 'unknown'
    return render_template('index.html', data=data)

if __name__ == '__main__':
    app.run(debug=True)
