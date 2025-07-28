'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { BiolinkComponent, ComponentType, PageBuilderState, DraggedComponent } from '../../types';

type DragAction =
  | { type: 'START_DRAG'; payload: { componentType: ComponentType; id: string } }
  | { type: 'END_DRAG' }
  | { type: 'SET_COMPONENTS'; payload: BiolinkComponent[] }
  | { type: 'SELECT_COMPONENT'; payload: BiolinkComponent | null }
  | { type: 'ADD_COMPONENT'; payload: BiolinkComponent }
  | { type: 'UPDATE_COMPONENT'; payload: { id: number; data: Partial<BiolinkComponent> } }
  | { type: 'DELETE_COMPONENT'; payload: number }
  | { type: 'REORDER_COMPONENTS'; payload: number[] };

type DragContextType = {
  state: PageBuilderState;
  startDrag: (componentType: ComponentType, id: string) => void;
  endDrag: () => void;
  setComponents: (components: BiolinkComponent[]) => void;
  selectComponent: (component: BiolinkComponent | null) => void;
  addComponent: (component: BiolinkComponent) => void;
  updateComponent: (id: number, data: Partial<BiolinkComponent>) => void;
  deleteComponent: (id: number) => void;
  reorderComponents: (componentIds: number[]) => void;
};

const initialState: PageBuilderState = {
  components: [],
  selectedComponent: null,
  isDragging: false,
  draggedComponent: null,
};

const dragReducer = (state: PageBuilderState, action: DragAction): PageBuilderState => {
  switch (action.type) {
    case 'START_DRAG':
      return {
        ...state,
        isDragging: true,
        draggedComponent: {
          type: action.payload.componentType,
          id: action.payload.id,
          tempId: `temp-${Date.now()}`,
        },
      };
    case 'END_DRAG':
      return {
        ...state,
        isDragging: false,
        draggedComponent: null,
      };
    case 'SET_COMPONENTS':
      return {
        ...state,
        components: action.payload,
      };
    case 'SELECT_COMPONENT':
      return {
        ...state,
        selectedComponent: action.payload,
      };
    case 'ADD_COMPONENT':
      return {
        ...state,
        components: [...state.components, action.payload],
      };
    case 'UPDATE_COMPONENT':
      return {
        ...state,
        components: state.components.map(comp =>
          comp.id === action.payload.id ? { ...comp, ...action.payload.data } : comp
        ),
        selectedComponent:
          state.selectedComponent?.id === action.payload.id
            ? { ...state.selectedComponent, ...action.payload.data }
            : state.selectedComponent,
      };
    case 'DELETE_COMPONENT':
      return {
        ...state,
        components: state.components.filter(comp => comp.id !== action.payload),
        selectedComponent:
          state.selectedComponent?.id === action.payload ? null : state.selectedComponent,
      };
    case 'REORDER_COMPONENTS':
      const reorderedComponents = action.payload.map((id, index) => {
        const component = state.components.find(comp => comp.id === id);
        return component ? { ...component, order: index } : null;
      }).filter(Boolean) as BiolinkComponent[];
      
      return {
        ...state,
        components: reorderedComponents,
      };
    default:
      return state;
  }
};

const DragContext = createContext<DragContextType | null>(null);

export const useDragContext = () => {
  const context = useContext(DragContext);
  if (!context) {
    throw new Error('useDragContext must be used within a DragProvider');
  }
  return context;
};

export const DragProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(dragReducer, initialState);

  const startDrag = useCallback((componentType: ComponentType, id: string) => {
    dispatch({ type: 'START_DRAG', payload: { componentType, id } });
  }, []);

  const endDrag = useCallback(() => {
    dispatch({ type: 'END_DRAG' });
  }, []);

  const setComponents = useCallback((components: BiolinkComponent[]) => {
    dispatch({ type: 'SET_COMPONENTS', payload: components });
  }, []);

  const selectComponent = useCallback((component: BiolinkComponent | null) => {
    dispatch({ type: 'SELECT_COMPONENT', payload: component });
  }, []);

  const addComponent = useCallback((component: BiolinkComponent) => {
    dispatch({ type: 'ADD_COMPONENT', payload: component });
  }, []);

  const updateComponent = useCallback((id: number, data: Partial<BiolinkComponent>) => {
    dispatch({ type: 'UPDATE_COMPONENT', payload: { id, data } });
  }, []);

  const deleteComponent = useCallback((id: number) => {
    dispatch({ type: 'DELETE_COMPONENT', payload: id });
  }, []);

  const reorderComponents = useCallback((componentIds: number[]) => {
    dispatch({ type: 'REORDER_COMPONENTS', payload: componentIds });
  }, []);

  const value: DragContextType = {
    state,
    startDrag,
    endDrag,
    setComponents,
    selectComponent,
    addComponent,
    updateComponent,
    deleteComponent,
    reorderComponents,
  };

  return <DragContext.Provider value={value}>{children}</DragContext.Provider>;
}; 