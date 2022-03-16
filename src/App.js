import React, {useRef, useState} from 'react';
import {BiConversation} from 'react-icons/bi';
import logo from './logo.svg';
import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';


import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';



firebase.initializeApp({
  apiKey: "AIzaSyC30QImv75ZD6Br1e04F3wEHeZUyZC20tc",
  authDomain: "chat-app-84af6.firebaseapp.com",
  projectId: "chat-app-84af6",
  storageBucket: "chat-app-84af6.appspot.com",
  messagingSenderId: "960200150071",
  appId: "1:960200150071:web:2d076e1fae40b5a85f03b2"
})


const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1><BiConversation/></h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom/> : <SignIn/>}
      </section>
    </div>
  );
}

function SignIn(){
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return(
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
    </>
    
  );
}

function SignOut(){
  
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign out</button>
  );
}

function ChatMessage(props){
  const {text, uid, photoURL} = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return(<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL}/>
      <p>{text}</p>
    </div>
  </>
    
  );
}

function ChatRoom(){
  const dummy = useRef();
  const msgRef = firestore.collection('messages');
  const query = msgRef.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query, {idField: 'id'});
  const [formValue, setFormValue] = useState('');

  const sendMsg = async(e) => {
    e.preventDefault()
    const {uid, photoURL} = auth.currentUser;
    await msgRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({behaviour: 'smooth'})
  }

  return (
      <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}

        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMsg}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="..."/>
        <button type="submit" disabled={!formValue}>Send</button>
      </form>
      </>
    
  );
}

export default App;
