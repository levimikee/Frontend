import React, { useEffect, useState } from "react";

import { Button, Menu } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  LockOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { crud } from "@/redux/crud/actions";
import { selectItemById } from "@/redux/crud/selectors";
import { useCrudContext } from "@/context/crud";
import uniqueId from "@/utils/uinqueId";
import DataTable from "@/components/DataTable";

function AddNewItem({ config }) {
  const { crudContextAction } = useCrudContext();
  const { collapsedBox, panel } = crudContextAction;
  const { ADD_NEW_ENTITY } = config;
  const handelClick = () => {
    panel.open();
    collapsedBox.close();
  };

  return (
    <Button onClick={handelClick} type="primary">
      {ADD_NEW_ENTITY}
    </Button>
  );
}

export default function AdminCrudModule({ config }) {
  const dispatch = useDispatch();
  const { crudContextAction } = useCrudContext();
  const { panel, collapsedBox, modal, advancedBox, readBox, editBox } =
    crudContextAction;

  const show = (row) => {
    dispatch(crud.currentItem(row));
    panel.open();
    collapsedBox.open();
    readBox.open();
  };
  const edit = (row) => {
    dispatch(crud.currentAction("update", row));
    editBox.open();
    panel.open();
    collapsedBox.open();
  };
  const updatePassword = (row) => {
    dispatch(crud.currentAction("update", row));
    advancedBox.open();
    panel.open();
    collapsedBox.open();
  };
  const deleteItem = (row) => {
    dispatch(crud.currentAction("delete", row));
    modal.open();
  };

  function DropDownRowMenu({ row }) {
    return (
      <Menu style={{ minWidth: 130 }}>
        <Menu.Item
          key={`${uniqueId()}`}
          icon={<EyeOutlined />}
          onClick={() => show(row)}
        >
          Show
        </Menu.Item>
        <Menu.Item
          key={`${uniqueId()}`}
          icon={<EditOutlined />}
          onClick={() => edit(row)}
        >
          Edit
        </Menu.Item>
        <Menu.Item
          key={`${uniqueId()}`}
          icon={<LockOutlined />}
          onClick={() => updatePassword(row)}
        >
          Update Password
        </Menu.Item>
        <Menu.Item
          key={`${uniqueId()}`}
          icon={<DeleteOutlined />}
          onClick={() => deleteItem(row)}
        >
          Delete
        </Menu.Item>
      </Menu>
    );
  }

  return (
    <DataTable
      config={config}
      DropDownRowMenu={DropDownRowMenu}
      AddNewItem={AddNewItem}
    />
  );
}
