import { useEffect } from "react"


function Dinatran({ title }) {
  useEffect(() => {
    document.title = title;
  }, []);
  
  return (
    <div>Dinatran</div>
  )
}

export default Dinatran