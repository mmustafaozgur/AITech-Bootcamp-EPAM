import { useEffect } from 'react';
import { KanbanBoard } from './features/tasks/KanbanBoard';

function App() {
  useEffect(() => {
    if (!localStorage.getItem('taskboard:version')) {
      localStorage.setItem('taskboard:version', '1');
    }
  }, []);

  return (
    <>
      <header style={{ padding: '16px 24px', borderBottom: '1px solid #dfe1e6' }}>
        <h1 style={{ margin: 0, fontSize: '1.25rem', color: '#172b4d' }}>Task Board</h1>
      </header>
      <KanbanBoard />
    </>
  );
}

export default App;
