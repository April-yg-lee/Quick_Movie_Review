import "./app.css";
import { useState } from "react";

function Header(props) {
  return (
    <header>
      <h1>
        <a
          href='/'
          onClick={(event) => {
            event.preventDefault();
            props.onChangeMode();
          }}
        >
          {props.title}
        </a>
      </h1>
    </header>
  );
}

function Nav(props) {
  const lis = [];
  for (let i = 0; i < props.topics.length; i++) {
    let t = props.topics[i];
    lis.push(
      <li key={t.id}>
        <a
          id={t.id}
          href={"/read/" + t.id}
          onClick={(event) => {
            event.preventDefault();
            props.onChangeMode(Number(event.target.id));
          }}
        >
          {t.title}
        </a>
      </li>
    );
  }
  return (
    <nav>
      <ol>{lis}</ol>
    </nav>
  );
}

function Article(props) {
  return (
    <article className='bodyArticle'>
      <h2>{props.title}</h2>
      <p>{props.body}</p>
    </article>
  );
}

function Create(props) {
  return (
    <article className='createArt'>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const title = event.target.title.value;
          const body = event.target.body.value;
          props.onCreate(title, body);
        }}
      >
        <p>
          <input type='text' name='title' placeholder='Movie Title' />
        </p>
        <p>
          <textarea name='body' placeholder='Write the Review'></textarea>
        </p>
        <p>
          <input type='submit' value='Submit' />
        </p>
      </form>
    </article>
  );
}

function Update(props) {
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  return (
    <article className='createArt'>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const title = event.target.title.value;
          const body = event.target.body.value;
          props.onUpdate(title, body);
        }}
      >
        <p>
          <input
            type='text'
            name='title'
            placeholder='Movie Title'
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
        </p>
        <p>
          <textarea
            name='body'
            placeholder='Write the Review'
            value={body}
            onChange={(event) => {
              setBody(event.target.value);
            }}
          ></textarea>
        </p>
        <p>
          <input type='submit' value='Update' />
        </p>
      </form>
    </article>
  );
}

function App() {
  const [mode, setMode] = useState("WELCOME");
  // WELCOME 이라는 것은 mode 의 초기 인자 값. App 이 다시실행되려면 useState 를 사용해서 (setMode) 설정값을 바꾸어 줘야지만 새로 로딩 됨.
  const [id, setId] = useState(null);
  // 현재 값이 선택되지 않았으니까 초기값이 없게 null로 지정
  const [nextId, setNextId] = useState(4);

  const [topics, setTopics] = useState([
    {
      id: 1,
      title: "Titanic",
      body: "Legendary romance movie based on real story",
    },
    {
      id: 2,
      title: "Harry Porter",
      body: "Harry porter reminds us of our childhood",
    },
    {
      id: 3,
      title: "Inception",
      body: "A simple little idea that would change everything",
    },
  ]);
  let content = null;
  let contextControl = null;

  if (mode === "WELCOME") {
    content = (
      <Article
        title='Welcome!'
        body="Check out April's quick movie reviews."
      ></Article>
    );
  } else if (mode === "READ") {
    let title,
      body = null;
    for (let i = 0; i < topics.length; i++) {
      if (topics[i].id === id) {
        // topics[i].id 가 id(useState의) 값과 일치하면
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body}></Article>;
    contextControl = (
      <>
        <li>
          <a className='updateBtn'
            href={"/update" + id}
            onClick={(event) => {
              event.preventDefault();
              setMode("UPDATE");
            }}
          >
            Update My Review
          </a>
        </li>
        <li>
          <a className='deleteBtn'
            href='/delete'
            onClick={(event) => {
              event.preventDefault();
              const newTopics = [];
              for (let i = 0; i < topics.length; i++) {
                if (topics[i].id !== id) {
                  newTopics.push(topics[i]);
                }
              }
              setTopics(newTopics);
              setMode("WELCOME");
            }}
          >Delete My Review</a>
        </li>
      </>
    );
  } else if (mode === "CREATE") {
    content = (
      <Create
        onCreate={(_title, _body) => {
          const newTopic = { id: nextId, title: _title, body: _body };
          const newTopics = [...topics];
          newTopics.push(newTopic);
          setTopics(newTopics);
          setMode("READ");
          setId(nextId);
          setNextId(nextId + 1);
        }}
      ></Create>
    );
  } else if (mode === "UPDATE") {
    let title,
      body = null;
    for (let i = 0; i < topics.length; i++) {
      if (topics[i].id === id) {
        // topics[i].id 가 id(useState의) 값과 일치하면
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = (
      <Update
        title={title}
        body={body}
        onUpdate={(title, body) => {
          console.log(title, body);
          const newTopics = [...topics];
          const updatedTopic = { id: id, title: title, body: body };
          for (let i = 0; i < newTopics.length; i++) {
            if (newTopics[i].id === id) {
              newTopics[i] = updatedTopic;
              break;
            }
          }
          setTopics(newTopics);
          setMode("READ");
        }}
      ></Update>
    );
  }
  return (
    <div className='container'>
      <Header
        title='Quick Movie Reviews💜'
        onChangeMode={() => {
          setMode("WELCOME");
        }}
      ></Header>
      <Nav
        topics={topics}
        onChangeMode={(_id) => {
          setMode("READ");
          setId(_id);
        }}
      ></Nav>
      {content}
      <ul>
        {contextControl}
        <li>
          <a
            className='createBtn'
            href='/create'
            onClick={(event) => {
              event.preventDefault();
              setMode("CREATE");
            }}
          >
            Create New Review
          </a>
        </li>
      </ul>
    </div>
  );
}

export default App;
