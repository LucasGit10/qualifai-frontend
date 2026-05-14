import React from 'react';
import { useParams } from 'react-router-dom';
import { useLayoutStore } from 'stores/layoutStore';

import Conversations from 'pages/Conversations';
import ConversationPageWhats from 'pages/ConversationsWhats';

export default function ConversationsPage() {
  const showCardsView = useLayoutStore((state) => state.showCardsView);
  const { teamMemberId } = useParams();

  return (
    <>
      {showCardsView ? <Conversations teamMemberId={teamMemberId} /> : <ConversationPageWhats teamMemberId={teamMemberId} />}
    </> 
  );
}
