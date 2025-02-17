import React from 'react';
import TiptapEditor from './components/TiptapEditor';
import ShowContent from './components/ShowContent';

const App: React.FC = () => {
  return (
    <div>
      <h1>My Beautiful Text Editor</h1>
      <TiptapEditor />
      <ShowContent />
    </div>
  );
};

export default App;
