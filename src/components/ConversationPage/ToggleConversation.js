import React from 'react';
import { useLayoutStore } from 'stores/layoutStore';

import Conversations from 'pages/Conversations';
import ConversationPageWhats from 'pages/ConversationsWhats';

export default function ConversationsPage() {
  const showCardsView = useLayoutStore((state) => state.showCardsView);

  return (
    <>
      {showCardsView ? <Conversations /> : <ConversationPageWhats />}
    </> 
  );
}