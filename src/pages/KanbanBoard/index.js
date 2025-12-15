import { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { KanbanColumn } from '../../components/Kanban/KanbanColumn';
import { AddColumnDialog } from '../../components/Kanban/AddColumnDialog';
import KanbanCard from '../../components/Kanban/KanbanCard';
import { AddCardDialog } from '../../components/Kanban/AddCardDialog';
import { CardDetailDialog } from '../../components/Kanban/CardDetailDialog';
import { EditColumnDialog } from '../../components/Kanban/EditColumnDialog';
import { EditCardDialog } from '../../components/Kanban/EditCardDialog';
import { BoardHeader, BoardContainer } from '../../components/Kanban/styles';
import { alpha, useTheme } from '@mui/material';
import api from '../../services/api';
import { useShowcaseContext } from '../../contexts/ShowcaseContext';
import { mockKanbanData } from '../../utils/mockData';
import ShowcaseBlocker from '../../components/Showcase/ShowcaseBlocker';

export default function KanbanBoard() {
  const [loading, setLoading] = useState(true);
  const [hasBoard, setHasBoard] = useState(false);
  const [boardId, setBoardId] = useState(null);
  const [columns, setColumns] = useState({});
  const [activeItem, setActiveItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState('');
  const [editingColumn, setEditingColumn] = useState(null);
  const [columnEditName, setColumnEditName] = useState('');
  const [editingCard, setEditingCard] = useState(null);
  const [isMovingCard, setIsMovingCard] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const { isGuestMode, openModal } = useShowcaseContext();
  const theme = useTheme();

  // ALTERAÇÃO: Criando um array de cores para os cards baseado no tema
  const cardColors = useMemo(() => [
    theme.palette.secondary.light,
    theme.palette.accent.main,
    theme.palette.success.main,
    theme.palette.info.main,
    theme.palette.warning.main,
    theme.palette.primary.light,
  ], [theme]);

  useEffect(() => {
    // ... (lógica de fetch de dados continua a mesma)
    const fetchInitialData = async () => {
      if (isGuestMode) {
        const formattedColumns = mockKanbanData.columns.reduce((acc, column) => {
          acc[column._id] = {
            id: column._id,
            title: column.title,
            items: column.items.map(item => ({ ...item, id: item._id })),
          };
          return acc;
        }, {});
        setColumns(formattedColumns);
        setBoardId(mockKanbanData._id);
        setHasBoard(true);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await api.get('/kanban/init');
        if (response.data && response.data.columns) {
          const formattedColumns = response.data.columns.reduce((acc, column) => {
            acc[column._id] = {
              id: column._id,
              title: column.title,
              items: column.items.map(item => ({
                ...item,
                id: item._id || item.id
              })) || []
            };
            return acc;
          }, {});
          setColumns(formattedColumns);
          setBoardId(response.data._id);
          setHasBoard(true);
        } else {
          setHasBoard(false);
        }
      } catch (error) {
        console.error('Erro ao buscar dados iniciais:', error);
        setHasBoard(false);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [isGuestMode]);

  // ... (funções de handle continuam as mesmas)
  const handleCreateBoard = async () => {
    try {
      setLoading(true);
      const response = await api.post('/kanban/boards', {
        name: 'Meu Quadro Kanban'
      });

      if (response.data) {
        const formattedColumns = {};
        response.data.columns.forEach(column => {
          formattedColumns[column._id] = {
            id: column._id,
            title: column.title,
            items: column.items.map(item => ({
              ...item,
              id: item._id || item.id
            })) || []
          };
        });

        setColumns(formattedColumns);
        setBoardId(response.data._id);
        setHasBoard(true);
      }
    } catch (error) {
      console.error('Erro ao criar quadro:', error);
      showSnackbar('Erro ao criar quadro: ' + (error.response?.data?.error || error.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const allItems = useMemo(() => {
    return Object.values(columns).flatMap(column => column.items);
  }, [columns]);

  const handleDragStart = (event) => {
    const { active } = event;
    const item = allItems.find(item => item.id === active.id);
    setActiveItem(item);
    document.body.style.cursor = 'grabbing';
  };

  const handleMoveCard = async (cardId, newColumnId, newPosition) => {
    try {
      await api.put(`/kanban/cards/${cardId}/move`, {
        columnId: newColumnId,
        position: newPosition
      });
    } catch (error) {
      console.error('Erro ao mover card:', error);
      throw error;
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    document.body.style.cursor = '';
    setActiveItem(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer) return;

    const originalColumns = { ...columns };

    setIsMovingCard(true);

    try {
      if (activeContainer === overContainer) {
        const newIndex = columns[activeContainer].items.findIndex(item => item.id === overId);

        setColumns(prev => {
          const column = prev[activeContainer];
          const oldIndex = column.items.findIndex(item => item.id === activeId);

          return {
            ...prev,
            [activeContainer]: {
              ...column,
              items: arrayMove(column.items, oldIndex, newIndex)
            }
          };
        });

        await handleMoveCard(activeId, activeContainer, newIndex);

      } else {
        const activeColumn = columns[activeContainer];
        const overColumn = columns[overContainer];
        const activeIndex = activeColumn.items.findIndex(item => item.id === activeId);

        if (activeIndex === -1) return;

        const newItem = activeColumn.items[activeIndex];
        const overIndex = overColumn.items.findIndex(item => item.id === overId);
        const insertPosition = overIndex === -1 ? overColumn.items.length : overIndex;

        setColumns(prev => ({
          ...prev,
          [activeContainer]: {
            ...prev[activeContainer],
            items: prev[activeContainer].items.filter(item => item.id !== activeId)
          },
          [overContainer]: {
            ...prev[overContainer],
            items: [
              ...prev[overContainer].items.slice(0, insertPosition),
              newItem,
              ...prev[overContainer].items.slice(insertPosition)
            ]
          }
        }));

        await handleMoveCard(activeId, overContainer, insertPosition);
      }

      showSnackbar('Card movido com sucesso!', 'success');
    } catch (error) {
      setColumns(originalColumns);
      showSnackbar('Erro ao mover card: ' + (error.response?.data?.error || error.message), 'error');
    } finally {
      setIsMovingCard(false);
    }
  };

  const findContainer = (id) => {
    if (id in columns) return id;
    return Object.keys(columns).find(key =>
      columns[key].items.some(item => item.id === id)
    );
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleCardClick = (item) => {
    setSelectedItem(item);
  };

  const handleAddColumn = async (newColumnName) => {
    if (!newColumnName.trim() || !boardId) {
      showSnackbar('Por favor, insira um nome para a coluna e certifique-se de que um quadro está selecionado', 'error');
      return;
    }

    try {
      const response = await api.post('/kanban/columns', {
        title: newColumnName,
        boardId: boardId
      });

      setColumns(prev => ({
        ...prev,
        [response.data._id]: {
          id: response.data._id,
          title: response.data.title,
          items: []
        }
      }));
      setShowAddColumn(false);
      showSnackbar('Coluna criada com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao adicionar coluna:', error);
      if (error.response?.status === 403) {
        showSnackbar('Você não tem permissão para adicionar colunas a este quadro', 'error');
      } else {
        showSnackbar('Erro ao adicionar coluna. Por favor, tente novamente.', 'error');
      }
    }
  };

  const handleEditColumn = async () => {
    if (!columnEditName.trim() || !editingColumn) return;

    try {
      const response = await api.put(`/kanban/columns/${editingColumn}`, {
        title: columnEditName
      });

      if (response.data) {
        setColumns(prev => ({
          ...prev,
          [editingColumn]: {
            ...prev[editingColumn],
            title: response.data.title
          }
        }));
        showSnackbar('Coluna atualizada com sucesso!', 'success');
      }
    } catch (error) {
      console.error('Erro ao editar coluna:', error);
      showSnackbar('Erro ao editar coluna: ' + (error.response?.data?.error || error.message), 'error');
    } finally {
      setEditingColumn(null);
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (!cardId) return;

    try {
      await api.delete(`/kanban/cards/${cardId}`);

      setColumns(prev => {
        const newColumns = { ...prev };
        Object.keys(newColumns).forEach(colId => {
          newColumns[colId].items = newColumns[colId].items.filter(item =>
            item.id !== cardId && item._id !== cardId
          );
        });
        return newColumns;
      });
      showSnackbar('Card removido com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao deletar card:', error);
      showSnackbar('Erro ao remover card: ' + (error.response?.data?.error || error.message), 'error');
    }
  };

  const handleEditCard = async (updatedCard) => {
    try {
      const cardId = updatedCard?.id || updatedCard?._id;

      if (!cardId) {
        throw new Error('ID do card não encontrado');
      }

      const response = await api.put(`/kanban/cards/${cardId}`, {
        title: updatedCard.title,
        description: updatedCard.description,
        priority: updatedCard.priority,
        tags: updatedCard.tags
      });

      if (response.data) {
        setColumns(prev => {
          const newColumns = { ...prev };
          Object.keys(newColumns).forEach(colId => {
            const column = newColumns[colId];
            const itemIndex = column.items.findIndex(item =>
              (item.id === cardId) || (item._id === cardId)
            );
            if (itemIndex !== -1) {
              newColumns[colId].items[itemIndex] = {
                ...newColumns[colId].items[itemIndex],
                ...response.data,
                id: response.data._id || response.data.id
              };
            }
          });
          return newColumns;
        });
        showSnackbar('Card atualizado com sucesso!', 'success');
      }
    } catch (error) {
      console.error('Erro ao atualizar card:', error);
      showSnackbar(`Erro: ${error.response?.data?.error || error.message}`, 'error');
    }
  };

  const handleRemoveColumn = async (columnId) => {
    if (Object.keys(columns).length <= 1) {
      showSnackbar('Você não pode remover a última coluna', 'error');
      return;
    }

    try {
      const targetColumnId = Object.keys(columns).find(id => id !== columnId);

      if (!targetColumnId) return;

      await api.delete(`/kanban/columns/${columnId}`, {
        data: { moveToColumnId: targetColumnId }
      });

      const { [columnId]: _, ...remainingColumns } = columns;

      setColumns({
        ...remainingColumns,
        [targetColumnId]: {
          ...remainingColumns[targetColumnId],
          items: [
            ...remainingColumns[targetColumnId].items,
            ...columns[columnId].items
          ]
        }
      });
      showSnackbar('Coluna removida com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao remover coluna:', error);
      showSnackbar('Erro ao remover coluna: ' + (error.response?.data?.error || error.message), 'error');
    }
  };


  const handleAddItem = async (newItem) => {
    if (!newItem.title.trim() || !selectedColumn) return;

    const payload = {
      title: newItem.title,
      description: newItem.description || '',
      priority: newItem.priority || 'Baixa',
      tags: Array.isArray(newItem.tags) ? newItem.tags : [],
      columnId: selectedColumn
    };

    try {
      const response = await api.post('/kanban/cards', payload);
      // ALTERAÇÃO: Usando o array de cores do tema
      const randomColor = cardColors[Math.floor(Math.random() * cardColors.length)];

      if (response.data) {
        setColumns(prev => ({
          ...prev,
          [selectedColumn]: {
            ...prev[selectedColumn],
            items: [
              ...prev[selectedColumn].items,
              {
                id: response.data._id,
                title: response.data.title,
                description: response.data.description,
                color: randomColor,
                priority: response.data.priority,
                date: new Date().toLocaleDateString('pt-BR'),
                tags: response.data.tags
              }
            ]
          }
        }));
        showSnackbar('Card adicionado com sucesso!', 'success');
      }
    } catch (error) {
      console.error('Erro ao adicionar card:', error);
      showSnackbar('Erro ao adicionar card: ' + (error.response?.data?.error || error.message), 'error');
    } finally {
      setShowAddItem(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!hasBoard) {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        gap: 3
      }}>
        <Typography variant="h4" sx={{ mb: 2, color: 'text.secondary' }}>
          Você ainda não tem um quadro criado
        </Typography>
        <ShowcaseBlocker>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            size="large"
            onClick={handleCreateBoard}
            sx={{
              borderRadius: '12px',
              px: 4,
              py: 2,
              fontWeight: 600,
              fontSize: '1.1rem',
              // ALTERAÇÃO: Sombra do botão baseada no tema
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`,
              '&:hover': {
                boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.35)}`,
              }
            }}
          >
            Criar Novo Quadro
          </Button>
        </ShowcaseBlocker>
      </Box>
    );
  }

  return (
    <BoardContainer>
      <BoardHeader>
        <Typography variant="h3" sx={{
          fontWeight: 800,
          // ALTERAÇÃO: Gradiente do texto vindo do tema
          background: theme.palette.custom.gradients.text,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Quadro
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <ShowcaseBlocker inline>
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              onClick={() => setShowAddColumn(true)}
              sx={{
                borderRadius: '12px',
                px: 3,
                py: 1.5,
                fontWeight: 600,
                // ALTERAÇÃO: Sombra do botão baseada no tema
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                '&:hover': {
                  boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
                }
              }}
            >
              Nova Coluna
            </Button>
          </ShowcaseBlocker>
          <ShowcaseBlocker inline>
            <Button
              startIcon={<AddIcon />}
              variant="outlined"
              onClick={() => setShowAddItem(true)}
              sx={{
                borderRadius: '12px',
                px: 3,
                py: 1.5,
                fontWeight: 600,
                borderWidth: '2px',
                '&:hover': {
                  borderWidth: '2px'
                }
              }}
            >
              Novo Card
            </Button>
          </ShowcaseBlocker>
        </Box>
      </BoardHeader>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={isGuestMode ? undefined : handleDragStart}
        onDragEnd={isGuestMode ? undefined : handleDragEnd}
      >
        <Box sx={{ position: 'relative' }}>
          <Box sx={{
            display: 'flex',
            overflowX: 'auto',
            pb: 3,
            pt: 1,
            transition: 'filter 0.3s, opacity 0.3s',
            filter: isGuestMode ? 'blur(4px)' : 'none',
            opacity: isGuestMode ? 0.5 : 1,
            pointerEvents: isGuestMode ? 'none' : 'auto',
            // A estilização da scrollbar agora vem do theme.js, mas uma override local é aceitável
          }}>
            {Object.values(columns).map(column => (
              <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                items={column.items}
                onClickCard={handleCardClick}
                onRemoveColumn={handleRemoveColumn}
                onEditColumn={(id) => {
                  setEditingColumn(id);
                  setColumnEditName(columns[id].title);
                }}
                onEditCard={setEditingCard}
              />
            ))}
          </Box>
          {isGuestMode && (
            <Box
              sx={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                zIndex: 10,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={openModal}
            >
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: theme.spacing(3),
                backgroundColor: alpha(theme.palette.background.paper, 0.9),
                borderRadius: '50%',
                boxShadow: theme.shadows[6],
              }}>
                <LockIcon sx={{ fontSize: 48, color: 'primary.main' }} />
              </Box>
            </Box>
          )}
        </Box>

        <DragOverlay adjustScale={false}>
          {activeItem ? <KanbanCard item={activeItem} /> : null}
        </DragOverlay>
      </DndContext>

      {isMovingCard && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          // ALTERAÇÃO: Cor de fundo da sobreposição baseada no tema
          backgroundColor: alpha(theme.palette.background.default, 0.5),
          zIndex: 9999
        }}>
          <CircularProgress size={60} />
        </Box>
      )}

      {/* Todos os Dialogs abaixo usarão o estilo padrão do tema */}
      <AddColumnDialog
        open={showAddColumn}
        onClose={() => setShowAddColumn(false)}
        onAddColumn={handleAddColumn}
      />

      <AddCardDialog
        open={showAddItem}
        onClose={() => setShowAddItem(false)}
        columns={columns}
        onAddItem={handleAddItem}
        onSelectColumn={setSelectedColumn}
      />

      <CardDetailDialog
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onEdit={setEditingCard}
        onDelete={() => handleDeleteCard(selectedItem?.id || selectedItem?._id)}
      />

      <EditColumnDialog
        open={!!editingColumn}
        name={columnEditName}
        onChange={setColumnEditName}
        onClose={() => setEditingColumn(null)}
        onSave={handleEditColumn}
      />

      <EditCardDialog
        open={!!editingCard}
        onClose={() => setEditingCard(null)}
        card={editingCard}
        onSave={handleEditCard}
        onDelete={() => handleDeleteCard(editingCard?.id || editingCard?._id)}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </BoardContainer>
  );
}