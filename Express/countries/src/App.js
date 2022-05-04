import { useState } from 'react';
import Countries from './components/Countries';
import Filter from './components/Filter';

function App() {
  const [filter, setFilter] = useState('');

  return (
    <div>
      <Filter filter={filter} setFilter={setFilter} />
      <Countries filter={filter} setFilter={setFilter} />
    </div>
  );
}

export default App;
