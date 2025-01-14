import React from "react";
import { useDrag, useDrop } from "react-dnd";

const DraggableCell = ({ row, col, cellValue, moveCell, onDrop }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: "cell",
    item: { row, col },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: "cell",
    drop: (item) => onDrop(item.row, item.col, row, col),
  });

  return (
    <div
      ref={(node) => dragRef(dropRef(node))}
      className="cell"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {cellValue}
    </div>
  );
};

export default DraggableCell;
