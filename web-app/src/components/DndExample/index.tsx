import {
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
} from "@material-ui/core";
import RootRef from "@material-ui/core/RootRef";
import EditIcon from "@material-ui/icons/Edit";
import InboxIcon from "@material-ui/icons/Inbox";
import React, { useState } from "react";
import {
    DragDropContext,
    Draggable,
    DraggableProvided,
    DraggableStateSnapshot,
    Droppable,
    DroppableProvided,
    DroppableStateSnapshot,
} from "react-beautiful-dnd";

interface IItem {
    id: string;
    primary: string;
    secondary: string | undefined;
}

// fake data generator
const getItems = (count: number) =>
    Array.from({ length: count }, (v, k) => k).map((k) => ({
        id: `item-${k}`,
        primary: `item ${k}`,
        secondary: k % 2 === 0 ? `Whatever for ${k}` : undefined,
    }));

const reorder = (list: IItem[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    // styles to apply on draggables
    ...draggableStyle,
    ...(isDragging && {
        background: "rgb(235,235,235)",
    }),
});

const getListStyle = (isDraggingOver: boolean) => ({
    //background: isDraggingOver ? 'lightblue' : 'lightgrey',
});

const DndExample: React.FC = () => {
    const [items, setItems] = useState(getItems(10) as IItem[]);

    const onDragEnd = (result: any) => {
        if (!result.destination) {
            // dropped outside the list
            return;
        }
        const newItems = reorder(
            items,
            result.source.index,
            result.destination.index,
        );
        setItems(newItems);
    };

    // Normally you would split things out into separate components.
    // But in this example everything is done in one place for simplicity
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {(
                    provided: DroppableProvided,
                    snapshot: DroppableStateSnapshot,
                ) => (
                    <RootRef rootRef={provided.innerRef}>
                        <List style={getListStyle(snapshot.isDraggingOver)}>
                            {items.map((item, index) => (
                                <Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={index}
                                >
                                    {(
                                        provided: DraggableProvided,
                                        snapshot: DraggableStateSnapshot,
                                    ) => (
                                        <ListItem
                                            ContainerProps={
                                                {
                                                    ref: provided.innerRef,
                                                } as any
                                            }
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={getItemStyle(
                                                snapshot.isDragging,
                                                provided.draggableProps.style,
                                            )}
                                        >
                                            <ListItemIcon>
                                                <InboxIcon />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={item.primary}
                                                secondary={item.secondary}
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton>
                                                    <EditIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </List>
                    </RootRef>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export { DndExample };
