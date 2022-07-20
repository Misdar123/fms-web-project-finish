import React, { useState } from "react";
import { useSelector } from "react-redux";
import { updateDataBase } from "../../../../../../lib/function/dataBaseCRUD";

const ListChild = ({ listData, onClick }) => {
  const [layoutName, setLayoutName] = useState("");
  const [showInput, setShowInput] = useState(false);

  const { layoutList } = useSelector((state) => state.layouts);
  const { userId } = useSelector((state) => state.user);

  const handleOnDoubleClick = () => {
    setShowInput(!showInput);
    setLayoutName(listData.name);
  };

  const handleUpdateLayoutName = () => {
    const indexAllLayout = layoutList.map((layout) => layout.id);
    const newlayout = {
      ...layoutList.find((layout) => layout.id === listData.id),
    };

    const newLayoutList = [...layoutList];

    newlayout.name = layoutName;
    const index = indexAllLayout.indexOf(newlayout.id);
    newLayoutList[index] = newlayout;
    const path = `users/${userId}/layouts/`;
    updateDataBase(path, newLayoutList);
    setShowInput(!showInput);
  };

  return (
    <div onDoubleClick={handleOnDoubleClick} onClick={onClick}>
      {!showInput ? (
        <p
          style={{
            fontSize: "16px",
            margin: 0,
          }}
        >
          {listData.name}
        </p>
      ) : (
        <>
          <input
            style={{
              height: "30px",
              width: "150px",
              paddingLeft: "5px",
              border: "none",
              borderRadius: "3px",
              fontSize: "16px",
              marginBottom: "2px",
              margin: 0,
            }}
            autoFocus={true}
            value={layoutName}
            onChange={(e) => {
              if(e.target.value.length > 15) return
              setLayoutName(e.target.value)
            }}
            onBlur={handleUpdateLayoutName}
          />
        </>
      )}
    </div>
  );
};

export default ListChild;
