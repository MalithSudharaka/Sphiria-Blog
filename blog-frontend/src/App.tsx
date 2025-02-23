import React from 'react';
import ShowContent from './components/ShowContent';
import ShowDraft from './components/ShowDrafts';
import QuillEditor from './pages/Quil';

const App: React.FC = () => {
  return (
    <div>
      {/* <TiptapEditor />
      <ShowContent /> */}
      <QuillEditor />
      <ShowContent />
      <ShowDraft />
    </div>
  );
};

export default App;
