import React from 'react';
import TiptapEditor from './components/TiptapEditor';
import ShowContent from './components/ShowContent';
import QuillEditor from './pages/Quil';

const App: React.FC = () => {
  return (
    <div>
      {/* <TiptapEditor />
      <ShowContent /> */}
      <QuillEditor />
      <ShowContent />
    </div>
  );
};

export default App;
