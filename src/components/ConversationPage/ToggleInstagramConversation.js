import React from 'react';
import { useLayoutStore } from 'stores/layoutStore';

import Conversations from 'pages/Conversations';
import InstagramConversations from 'pages/InstagramConversations';

export default function ToggleInstagramConversation() {
  const showCardsView = useLayoutStore((state) => state.showCardsView);

  return (
    <>
      {showCardsView ? <Conversations channel="instagram" /> : <InstagramConversations />}
    </> 
  );
}