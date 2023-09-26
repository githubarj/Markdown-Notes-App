import Sidebar from "./Components/Sidebar";
import Editor from "./Components/Editor";
import Split from "react-split";
import { useEffect, useState } from "react";
import { onSnapshot, addDoc, doc, deleteDoc } from "firebase/firestore";
import { notesCollection, db } from "../firebase";
import "./App.css";

export default function App() {
  const [notes, setNotes] = useState([]);

  const [currentNoteId, setCurrentNoteId] = useState(notes[0]?.id || "");

  const currentNote =
    notes.find((note) => note.id === currentNoteId) || notes[0];

  useEffect(() => {
    const unsubscribe = onSnapshot(notesCollection, function (snapshot) {
      // Sync up our local notes array with the snapshot data
      const notesArr = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setNotes(notesArr);
    });
    return unsubscribe;
  }, []);

 

   async function createNewNote() {
     const newNote = {
       body: "# Type your markdown note's title here",
     };
     const newNoteRef = await addDoc(notesCollection, newNote);
     setCurrentNoteId(newNoteRef.id);
   }


  function updateNote(text) {
    // Try to rearrange the most recently-modified
    // not to be at the top
    setNotes((oldNotes) => {
      const newArray = [];
      for (let i = 0; i < oldNotes.length; i++) {
        const oldNote = oldNotes[i];
        if (oldNote.id === currentNoteId) {
          newArray.unshift({ ...oldNote, body: text });
        } else {
          newArray.push(oldNote);
        }
      }
      return newArray;
    });

    // This does not rearrange the notes
    // setNotes(oldNotes => oldNotes.map(oldNote => {
    //     return oldNote.id === currentNoteId
    //         ? { ...oldNote, body: text }
    //         : oldNote
    // }))
  }

     async function deleteNote(noteId) {
       const docRef = doc(db, "notes", noteId);
       await deleteDoc(docRef);
     }

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction="horizontal" className="split">
          <Sidebar
            notes={notes}
            currentNote={currentNote}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            deleteNote={deleteNote}
          />
          {currentNoteId && notes.length > 0 && (
            <Editor currentNote={currentNote} updateNote={updateNote} />
          )}
        </Split>
      ) : (
        <div className="no-notes">
          <h1>You have no notes</h1>
          <button className="first-note" onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}
