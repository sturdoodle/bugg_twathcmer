import 'bootstrap/dist/css/bootstrap.min.css';
import { HashRouter as BrowserRouter, Routes, Route } from "react-router-dom";
import Timer from './Timer';
import Main from './Main';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<Main />} />
          <Route exact path='/timer' element={<Timer />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
