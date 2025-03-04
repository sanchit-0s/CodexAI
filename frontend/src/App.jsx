import { useState ,useEffect} from 'react'
import 'prismjs/themes/prism-tomorrow.css'
import Editor from "react-simple-code-editor"
import prism from 'prismjs'
import './App.css'
import axios from 'axios'
import Markdown from "react-markdown"

function App() {
  const [count, setCount] = useState(0)

  const [code, setcode] = useState(``)
const [review, setReview] = useState(``)
const [loading, setLoading] = useState(false); // Loading state


  useEffect(() => {
    prism.highlightAll()
})
 async function reviewCode(){
  setLoading(true); // Show loading before the request
  try {
    const response = await axios.post("http://localhost:3000/ai/get-review", { code });
    setReview(response.data);
  } catch (error) {
    console.error("Error fetching review:", error);
    setReview("Failed to get review. Please try again.");
  }
  setLoading(false); // Hide loading after the request
}


  return (
    <>
      <main>
        <div className="left">
          <h1>CodexAI</h1>
          <div className="code">
            <Editor
            value={code}
            onValueChange={code =>setcode(code)}
            highlight={code=> prism.highlight(code, prism.languages.javascript,"javascript")}
            padding={10}
            style={{
              fontFamily:'"Fira code","Fira Mono",monospace',
              color:'white',
              fontSize:17,
              border:"1px solid #ddd",
              borderRadius:"5px",
              height:"100%", 
              width:"100%"
            }}
            />
          </div>
          <button 
          onClick={reviewCode}
          className="review">
            Review
          </button>
        </div>
        <div className="right">
        {loading ? <div className="loader"></div> : <Markdown>{review}</Markdown>}
        </div>
      </main>
    </>
  )
}

export default App
