import { authentication, createDirectus, readItems, realtime, rest } from '@directus/sdk';
import { useState, useEffect } from 'react';

const url = 'https://dir.manazl.site';

const client = createDirectus(url).with(rest()).with(authentication()).with(realtime());

// client.globals.fetch = (input, opts) => fetch(input, { headers: { 'mode': "no-cors", ...opts } })

export default function App() {
  const [messageHistory, setMessageHistory] = useState([]);

  useEffect(() => {
    client
      .request(
        readItems("products")
      )
      .then(console.log)
      .catch(console.log);
    const cleanup = client.onWebSocket('message', function (data) {
      if (data.type == 'auth' && data.status == 'ok') {
        readAllMessages();
        subscribe('create');
      }

      if (data.type === 'items') {
        for (const item of data.data) {
          addMessageToList(item);
        }
      }
    });
     client.login('s@gmail.com', '123').then(console.log)
      .catch(console.log);
    client.connect();

    return cleanup;
  }, []);

  const loginSubmit = (event) => {
    event.preventDefault();
    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;
    client.login(email, password).then(console.log)
      .catch(console.log);
  };

  async function subscribe(event) {
    const { subscription } = await client.subscribe('messages', {
      event,
      query: {
        fields: ['*.*',],
      },
    });

    for await (const message of subscription) {
      console.log('receiveMessage', message);
      receiveMessage(message);
    }
  }

  function readAllMessages() {
    client.sendMessage({
      type: 'items',
      collection: 'messages2',
      action: 'read',
      query: {
        limit: 10,
        sort: '-date_created',
        fields: ['*', 'user_created.first_name'],
      },
    });
  }

  function receiveMessage(data) {
    if (data.type == 'subscription' && data.event == 'init') {
      console.log('subscription started');
    }
    if (data.type == 'subscription' && data.event == 'create') {
      addMessageToList(message.data[0]);
    }
  }

  function addMessageToList(message) {
    setMessageHistory([...messageHistory, message]);
  }

  const messageSubmit = (event) => {
    event.preventDefault();

    const text = event.target.elements.text.value;

    client.sendMessage({
      type: 'items',
      collection: 'messages2',
      action: 'create',
      data: { text },
    });

    event.target.reset();
  };

  return (
    <div className='App'>
      <form onSubmit={loginSubmit}>
        <label htmlFor='email'>Email</label>
        <input type='email' id='email' defaultValue='s@gmail.com' />
        <label htmlFor='password'>Password</label>
        <input type='password' id='password' defaultValue='123' />
        <input type='submit' />
      </form>

      <ol>
        {messageHistory.map((message) => (
          <li key={message.id}>
            {message.user_created.first_name}: {message.text}
          </li>
        ))}
      </ol>

      <form onSubmit={messageSubmit}>
        <label htmlFor='message'>Message</label>
        <input type='text' id='text' />
        <input type='submit' />
      </form>
    </div>
  );
}