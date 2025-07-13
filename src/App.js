import { MyMediaDiaryApp } from './components/MyMediaDiaryApp';
import { UserContextProvider } from './context/user-context';

const App = () => (
  <UserContextProvider>
    <MyMediaDiaryApp />
  </UserContextProvider>
);

export default App;
