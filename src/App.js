import 'bootstrap/dist/css/bootstrap.min.css';
import { HashRouter as BrowserRouter, Routes, Route } from "react-router-dom";
import Timer from './Timer';
import Main from './Main';
import V2Main from './v2/V2Main';
import V2Timer from './v2/V2Timer';
import V2CelebrationSetup from './v2/V2CelebrationSetup';
import { FocusProvider } from './v2/useFocusStore';

function App() {
  return (
    <FocusProvider>
      <BrowserRouter>
        <Routes>
          <Route exact path='/classic' element={<Main />} />
          <Route exact path='/classic/timer' element={<Timer />} />
          {/* Support legacy paths */}
          <Route exact path='/' element={<V2Main />} />
          <Route exact path='/timer' element={<V2Timer />} />
          <Route exact path='/celebration' element={<V2CelebrationSetup />} />
          <Route exact path='/v2' element={<V2Main />} />
          <Route exact path='/v2/timer' element={<V2Timer />} />
        </Routes>
      </BrowserRouter>
    </FocusProvider>
  );
}

export default App;
