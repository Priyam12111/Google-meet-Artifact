from g4f.client import Client

def sendMsg(msg):
    try:
        client = Client()
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": msg}],
        )
        return (response.choices[0].message.content)
    except Exception:
        pass
if __name__ == "__main__":
    sendMsg('''Moral of this story is''')